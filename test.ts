const AWS = require("aws-sdk")

// class MyResponse{
//     statusCode: number
//     body: string
//     headers: object

//     constructor(statusCode: number, obody: object) {
//         this.headers = {
//             'Content-Type': 'application/json'
//         }
//         this.statusCode = statusCode    
//         this.body = JSON.stringify(obody)
//     }
// }

function buildResponse(statusCode, obody){
    return {
        headers: {
            'Content-Type': 'application/json'
        },
        statusCode: statusCode,
        body: JSON.stringify(obody)
    }
}

AWS.config.update({
    region: "eu-central-1"
})

const dynamoDB = new AWS.DynamoDB.DocumentClient()
const dynamoDBTab = "people_at_company"
const alivePath = "/alive"
const peoplePath = "/people"
const personPath = "/person"


async function getPerson(personId: string) {
    const params = {
        TableName: dynamoDBTab,
        Key: {
            'personId': personId
        }
    }
    return await dynamoDB.get(params).promise().then(
        (response) => {
            return buildResponse(200, response.Item)
        },
        (error) => {
            return buildResponse(400, {error: error, key: params.Key})
        }
    )
}

async function scanDynamoRecords(scanParams, itemArray) {
    try {
        const dynamoData = await dynamoDB.scan(scanParams).promise()
        itemArray = itemArray.concat(dynamoData.Items)
        if (dynamoData.LastEvaluatedKey) {
            scanParams.ExclusiveStartkey = dynamoData.LastEvaluatedKey
            return await scanDynamoRecords(scanParams, itemArray)
        }
        return itemArray
    } catch (error) {
        return buildResponse(400, error)
    }
}

async function getPeople() {
    const params = {
        TableName: dynamoDBTab
    }
    const allPersons = await scanDynamoRecords(params, [])
    const body = {
        headcount: allPersons
    }
    return buildResponse(200, body)
}

async function savePerson(requestBody) {
    const params = {
        TableName: dynamoDBTab,
        Item: requestBody
    }
    return await dynamoDB.put(params).promise().then(
        () => {
            const body = {
                Operation: 'SAVE',
                Message: 'SUCCESS',
                Item: requestBody
            }
            return buildResponse(201, body)
        },
        (error) => {
            return buildResponse(400, error)
        }
    )
}

async function modifyPerson(personId, updateKey, updateValue) {
    const params = {
        TableName: dynamoDBTab,
        Key: {
            'personId': personId
        },
        UpdateExpression: `set ${updateKey} = :value`,
        ExpressionAttributeValues: {
            ':value': updateValue
        },
        ReturnValues: 'UPDATED_NEW'
    }
    return await dynamoDB.update(params).promise().then(
        (response) => {
            const body = {
                Operation: 'UPDATE',
                Message: 'SUCCESS',
                UpdatedAttributes: response
            }
            return buildResponse(200, body)
        }, 
        (error) => {
            return buildResponse(400, error)
        }
    )
}

async function deletePerson(personId) {
    const params = {
        TableName: dynamoDBTab,
        Key: {
            'personId': personId
        },
        ReturnValues: 'ALL_OLD'
    }
    return await dynamoDB.delete(params).promise().then(
        (response) => {
            const body = {
                Operation: 'DELETE',
                Message: 'SUCCESS',
                Item: response
            }
            return buildResponse(200, body)
        },
        (error) => {
            return buildResponse(400, error)
        }
    )
}

export const handler = async function(event, context) {
    let response

    if (event.path === alivePath && event.httpMethod === 'GET'){
        response = buildResponse(200, {condition: "alive"})
        return response
    }

    if (event.path === peoplePath && event.httpMethod === 'GET'){
        response = await getPeople()
        return response
    }

    if (!event.path.startsWith(personPath)){
        let body = {input: event}
        response = buildResponse(404, body)
        return response
    } else {
        const personId = event.pathParameters.personId
        switch (event.httpMethod) {
            case 'DELETE':
                // let body = {input: event}
                // response = buildResponse(202, body)
                response = await deletePerson(personId)
                break      

            case 'GET':
                response = await getPerson(personId)
                // response = await getPerson(JSON.parse(event.body).personId)
                // let body = {input: event}
                // response = buildResponse(202, body)
                break   

            case 'POST':
                response = await savePerson(JSON.parse(event.body))
                break;

            case 'PATCH':
                const requestBody = JSON.parse(event.body)
                response = await modifyPerson(
                    requestBody.personId,
                    requestBody.updateKey,
                    requestBody.updateValue
                )
                break
            
            // API Gateway 403 forbidden
            // default:
            //     response = buildResponse(404, {params2: [event.httpMethod, event.path, event]})
        }
    }
    return response
}