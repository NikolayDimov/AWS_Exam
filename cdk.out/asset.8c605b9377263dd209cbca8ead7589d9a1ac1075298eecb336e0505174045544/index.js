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

// src/cleanupFunction.ts
var cleanupFunction_exports = {};
__export(cleanupFunction_exports, {
  handler: () => handler
});
module.exports = __toCommonJS(cleanupFunction_exports);
var import_client_dynamodb = require("@aws-sdk/client-dynamodb");
var import_client_sns = require("@aws-sdk/client-sns");
var snsClient = new import_client_sns.SNSClient({});
var dynamoDBClient = new import_client_dynamodb.DynamoDBClient({});
var handler = async (event) => {
  const tableName = process.env.TABLE_NAME;
  const topicArn = process.env.TOPIC_ARN;
  console.log("Event received:", JSON.stringify(event, null, 2));
  for (const record of event.Records) {
    if (record.eventName === "REMOVE") {
      const deletedItem = record.dynamodb?.OldImage;
      if (deletedItem) {
        const message = `DynamoDB item deleted: ${JSON.stringify(deletedItem)}`;
        await snsClient.send(
          new import_client_sns.PublishCommand({
            TopicArn: topicArn,
            Message: message
          })
        );
        console.log("SNS notification sent for deleted item:", message);
      }
    }
  }
  return {
    statusCode: 200,
    body: "Cleanup function processed successfully"
  };
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  handler
});
