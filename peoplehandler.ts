const AWS = require("aws-sdk")

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

export const handler = async () => {
    return await getPeople()
}