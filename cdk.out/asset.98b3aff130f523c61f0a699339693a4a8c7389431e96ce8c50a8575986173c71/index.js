"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/processFunction.ts
var processFunction_exports = {};
__export(processFunction_exports, {
  handler: () => handler
});
module.exports = __toCommonJS(processFunction_exports);
var import_client_sns = require("@aws-sdk/client-sns");
var import_client_dynamodb = require("@aws-sdk/client-dynamodb");
var snsClient = new import_client_sns.SNSClient({});
var dynamoClient = new import_client_dynamodb.DynamoDBClient({});
var handler = async (event) => {
  const body = JSON.parse(event.body);
  const isValidJson = body.text ? true : false;
  console.log("Event body:", event.body);
  console.log("Parsed body:", body);
  if (!isValidJson) {
    console.log("Invalid JSON detected");
    const ttl = Math.floor(Date.now() / 1e3) + 3600;
    const putItemParams = {
      TableName: process.env.TABLE_NAME,
      Item: {
        id: { S: (/* @__PURE__ */ new Date()).toISOString() },
        errorMessage: { S: "Invalid JSON" },
        ttl: { N: ttl.toString() }
      }
    };
    console.log("DynamoDB Params:", putItemParams);
    await dynamoClient.send(new import_client_dynamodb.PutItemCommand(putItemParams));
  } else {
    console.log("Valid JSON detected");
    const message = `Valid JSON received: ${body.text}`;
    const snsParams = {
      TopicArn: process.env.TOPIC_ARN,
      Message: message
    };
    console.log("SNS Params:", snsParams);
    await snsClient.send(new import_client_sns.PublishCommand(snsParams));
    console.log("Notification sent!");
  }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  handler
});
