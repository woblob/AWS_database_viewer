function buildResponse(statusCode, obody){
    return {
        headers: {
            'Content-Type': 'application/json'
        },
        statusCode: statusCode,
        body: JSON.stringify(obody)
    }
}

export const handler = async function(event, context) {
    return buildResponse(200, {condition: "alive", input:event})
}