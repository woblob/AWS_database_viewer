"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = void 0;
var AWS = require("aws-sdk");
function buildResponse(statusCode, obody) {
    return {
        headers: {
            'Content-Type': 'application/json'
        },
        statusCode: statusCode,
        body: JSON.stringify(obody)
    };
}
AWS.config.update({
    region: "eu-central-1"
});
var dynamoDB = new AWS.DynamoDB.DocumentClient();
var dynamoDBTab = "people_at_company";
function scanDynamoRecords(scanParams, itemArray) {
    return __awaiter(this, void 0, void 0, function () {
        var dynamoData, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 4, , 5]);
                    return [4 /*yield*/, dynamoDB.scan(scanParams).promise()];
                case 1:
                    dynamoData = _a.sent();
                    itemArray = itemArray.concat(dynamoData.Items);
                    if (!dynamoData.LastEvaluatedKey) return [3 /*break*/, 3];
                    scanParams.ExclusiveStartkey = dynamoData.LastEvaluatedKey;
                    return [4 /*yield*/, scanDynamoRecords(scanParams, itemArray)];
                case 2: return [2 /*return*/, _a.sent()];
                case 3: return [2 /*return*/, itemArray];
                case 4:
                    error_1 = _a.sent();
                    return [2 /*return*/, buildResponse(400, error_1)];
                case 5: return [2 /*return*/];
            }
        });
    });
}
function getPeople() {
    return __awaiter(this, void 0, void 0, function () {
        var params, allPersons, body;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    params = {
                        TableName: dynamoDBTab
                    };
                    return [4 /*yield*/, scanDynamoRecords(params, [])];
                case 1:
                    allPersons = _a.sent();
                    body = {
                        headcount: allPersons
                    };
                    return [2 /*return*/, buildResponse(200, body)];
            }
        });
    });
}
var handler = function () { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, getPeople()];
            case 1: return [2 /*return*/, _a.sent()];
        }
    });
}); };
exports.handler = handler;
// const AWS = require("aws-sdk")
// function buildResponse(statusCode, obody){
//     return {
//         headers: {
//             'Content-Type': 'application/json'
//         },
//         statusCode: statusCode,
//         body: JSON.stringify(obody)
//     }
// }
// AWS.config.update({
//     region: "eu-central-1"
// })
// const dynamoDB = new AWS.DynamoDB.DocumentClient()
// const dynamoDBTab = "people_at_company"
// const peoplePath = "/people"
// // const personPath = "/person"
// // async function getPerson(personId: string) {
// //     const params = {
// //         TableName: dynamoDBTab,
// //         Key: {
// //             'personId': personId
// //         }
// //     }
// //     return await dynamoDB.get(params).promise().then(
// //         (response) => {
// //             return buildResponse(200, response.Item)
// //         },
// //         (error) => {
// //             return buildResponse(400, {error: error, key: params.Key})
// //         }
// //     )
// // }
// async function scanDynamoRecords(scanParams, itemArray) {
//     try {
//         const dynamoData = await dynamoDB.scan(scanParams).promise()
//         itemArray = itemArray.concat(dynamoData.Items)
//         if (dynamoData.LastEvaluatedKey) {
//             scanParams.ExclusiveStartkey = dynamoData.LastEvaluatedKey
//             return await scanDynamoRecords(scanParams, itemArray)
//         }
//         return itemArray
//     } catch (error) {
//         return buildResponse(400, error)
//     }
// }
// async function getPeople() {
//     const params = {
//         TableName: dynamoDBTab
//     }
//     const allPersons = await scanDynamoRecords(params, [])
//     const body = {
//         headcount: allPersons
//     }
//     return buildResponse(200, body)
// }
// // async function savePerson(requestBody) {
// //     const params = {
// //         TableName: dynamoDBTab,
// //         Item: requestBody
// //     }
// //     return await dynamoDB.put(params).promise().then(
// //         () => {
// //             const body = {
// //                 Operation: 'SAVE',
// //                 Message: 'SUCCESS',
// //                 Item: requestBody
// //             }
// //             return buildResponse(201, body)
// //         },
// //         (error) => {
// //             return buildResponse(400, error)
// //         }
// //     )
// // }
// // async function modifyPerson(personId, updateKey, updateValue) {
// //     const params = {
// //         TableName: dynamoDBTab,
// //         Key: {
// //             'personId': personId
// //         },
// //         UpdateExpression: `set ${updateKey} = :value`,
// //         ExpressionAttributeValues: {
// //             ':value': updateValue
// //         },
// //         ReturnValues: 'UPDATED_NEW'
// //     }
// //     return await dynamoDB.update(params).promise().then(
// //         (response) => {
// //             const body = {
// //                 Operation: 'UPDATE',
// //                 Message: 'SUCCESS',
// //                 UpdatedAttributes: response
// //             }
// //             return buildResponse(200, body)
// //         }, 
// //         (error) => {
// //             return buildResponse(400, error)
// //         }
// //     )
// // }
// // async function deletePerson(personId) {
// //     const params = {
// //         TableName: dynamoDBTab,
// //         Key: {
// //             'personId': personId
// //         },
// //         ReturnValues: 'ALL_OLD'
// //     }
// //     return await dynamoDB.delete(params).promise().then(
// //         (response) => {
// //             const body = {
// //                 Operation: 'DELETE',
// //                 Message: 'SUCCESS',
// //                 Item: response
// //             }
// //             return buildResponse(200, body)
// //         },
// //         (error) => {
// //             return buildResponse(400, error)
// //         }
// //     )
// // }
// export const handler = async function(event, context) {
//     let response 
//     if (event.path === peoplePath && event.httpMethod === 'GET'){
//         response = await getPeople()
//         return response
//     }
//     // if (!event.path.startsWith(personPath)){
//     //     let body = {input: event}
//     //     response = buildResponse(404, body)
//     //     return response
//     // } else {
//     //     const personId = event.pathParameters.personId
//     //     switch (event.httpMethod) {
//     //         case 'DELETE':
//     //             // let body = {input: event}
//     //             // response = buildResponse(202, body)
//     //             response = await deletePerson(personId)
//     //             break      
//     //         case 'GET':
//     //             response = await getPerson(personId)
//     //             // response = await getPerson(JSON.parse(event.body).personId)
//     //             // let body = {input: event}
//     //             // response = buildResponse(202, body)
//     //             break   
//     //         case 'POST':
//     //             response = await savePerson(JSON.parse(event.body))
//     //             break;
//     //         case 'PATCH':
//     //             const requestBody = JSON.parse(event.body)
//     //             response = await modifyPerson(
//     //                 requestBody.personId,
//     //                 requestBody.updateKey,
//     //                 requestBody.updateValue
//     //             )
//     //             break
//     //         // API Gateway 403 forbidden
//     //         // default:
//     //         //     response = buildResponse(404, {params2: [event.httpMethod, event.path, event]})
//     //     }
//     // }
//     return response
// }
