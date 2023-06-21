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
var alivePath = "/alive";
var peoplePath = "/people";
var personPath = "/person";
function getPerson(personId) {
    return __awaiter(this, void 0, void 0, function () {
        var params;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    params = {
                        TableName: dynamoDBTab,
                        Key: {
                            'personId': personId
                        }
                    };
                    return [4 /*yield*/, dynamoDB.get(params).promise().then(function (response) {
                            return buildResponse(200, response.Item);
                        }, function (error) {
                            return buildResponse(400, { error: error, key: params.Key });
                        })];
                case 1: return [2 /*return*/, _a.sent()];
            }
        });
    });
}
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
function savePerson(requestBody) {
    return __awaiter(this, void 0, void 0, function () {
        var params;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    params = {
                        TableName: dynamoDBTab,
                        Item: requestBody
                    };
                    return [4 /*yield*/, dynamoDB.put(params).promise().then(function () {
                            var body = {
                                Operation: 'SAVE',
                                Message: 'SUCCESS',
                                Item: requestBody
                            };
                            return buildResponse(201, body);
                        }, function (error) {
                            return buildResponse(400, error);
                        })];
                case 1: return [2 /*return*/, _a.sent()];
            }
        });
    });
}
function modifyPerson(personId, updateKey, updateValue) {
    return __awaiter(this, void 0, void 0, function () {
        var params;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    params = {
                        TableName: dynamoDBTab,
                        Key: {
                            'personId': personId
                        },
                        UpdateExpression: "set ".concat(updateKey, " = :value"),
                        ExpressionAttributeValues: {
                            ':value': updateValue
                        },
                        ReturnValues: 'UPDATED_NEW'
                    };
                    return [4 /*yield*/, dynamoDB.update(params).promise().then(function (response) {
                            var body = {
                                Operation: 'UPDATE',
                                Message: 'SUCCESS',
                                UpdatedAttributes: response
                            };
                            return buildResponse(200, body);
                        }, function (error) {
                            return buildResponse(400, error);
                        })];
                case 1: return [2 /*return*/, _a.sent()];
            }
        });
    });
}
function deletePerson(personId) {
    return __awaiter(this, void 0, void 0, function () {
        var params;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    params = {
                        TableName: dynamoDBTab,
                        Key: {
                            'personId': personId
                        },
                        ReturnValues: 'ALL_OLD'
                    };
                    return [4 /*yield*/, dynamoDB.delete(params).promise().then(function (response) {
                            var body = {
                                Operation: 'DELETE',
                                Message: 'SUCCESS',
                                Item: response
                            };
                            return buildResponse(200, body);
                        }, function (error) {
                            return buildResponse(400, error);
                        })];
                case 1: return [2 /*return*/, _a.sent()];
            }
        });
    });
}
var handler = function (event, context) {
    return __awaiter(this, void 0, void 0, function () {
        var response, body, personId, _a, requestBody;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    if (event.path === alivePath && event.httpMethod === 'GET') {
                        response = buildResponse(200, { condition: "alive" });
                        return [2 /*return*/, response];
                    }
                    if (!(event.path === peoplePath && event.httpMethod === 'GET')) return [3 /*break*/, 2];
                    return [4 /*yield*/, getPeople()];
                case 1:
                    response = _b.sent();
                    return [2 /*return*/, response];
                case 2:
                    if (!!event.path.startsWith(personPath)) return [3 /*break*/, 3];
                    body = { input: event };
                    response = buildResponse(404, body);
                    return [2 /*return*/, response];
                case 3:
                    personId = event.pathParameters.personId;
                    _a = event.httpMethod;
                    switch (_a) {
                        case 'DELETE': return [3 /*break*/, 4];
                        case 'GET': return [3 /*break*/, 6];
                        case 'POST': return [3 /*break*/, 8];
                        case 'PATCH': return [3 /*break*/, 10];
                    }
                    return [3 /*break*/, 12];
                case 4: return [4 /*yield*/, deletePerson(personId)
                    // let body = {input: event, personId: personId}
                    // response = buildResponse(202, body)
                ];
                case 5:
                    // let body = {input: event}
                    // response = buildResponse(202, body)
                    response = _b.sent();
                    // let body = {input: event, personId: personId}
                    // response = buildResponse(202, body)
                    return [3 /*break*/, 12];
                case 6: return [4 /*yield*/, getPerson(personId)
                    // response = await getPerson(JSON.parse(event.body).personId)
                    // let body = {input: event}
                    // response = buildResponse(202, body)
                ];
                case 7:
                    response = _b.sent();
                    // response = await getPerson(JSON.parse(event.body).personId)
                    // let body = {input: event}
                    // response = buildResponse(202, body)
                    return [3 /*break*/, 12];
                case 8: return [4 /*yield*/, savePerson(JSON.parse(event.body))];
                case 9:
                    response = _b.sent();
                    return [3 /*break*/, 12];
                case 10:
                    requestBody = JSON.parse(event.body);
                    return [4 /*yield*/, modifyPerson(requestBody.personId, requestBody.updateKey, requestBody.updateValue)];
                case 11:
                    response = _b.sent();
                    return [3 /*break*/, 12];
                case 12: return [2 /*return*/, response];
            }
        });
    });
};
exports.handler = handler;
