import { SNSClient, PublishCommand } from "@aws-sdk/client-sns";
import { DynamoDBClient, PutItemCommand } from "@aws-sdk/client-dynamodb";
import { v4 } from "uuid";

const snsClient = new SNSClient({});
const dynamoClient = new DynamoDBClient({});

export const handler = async (event: any) => {
    const tableName = process.env.TABLE_NAME;
    const topicArn = process.env.TOPIC_ARN;

    const body = JSON.parse(event.body);

    console.log("Event body:", event.body); // Debugging log
    console.log("Parsed body:", body); // Debugging log

    if (!body || !body.text) {
        console.log("Invalid JSON detected");

        // Add an item to DynamoDB with the invalid JSON message
        const ttl = Math.floor(Date.now() / 1000) + 3600; // TTL example: 1 hour
        const putItemParams = {
            TableName: tableName,
            Item: {
                id: { S: v4() },
                errorMessage: { S: "Invalid JSON" },
                ttl: { N: ttl.toString() },
            },
        };

        console.log("DynamoDB Params:", putItemParams); // Debugging log

        await dynamoClient.send(new PutItemCommand(putItemParams));
    } else {
        console.log("Valid JSON detected");

        // Send an SNS message
        const message = `Valid JSON received: ${body.text}`;
        const snsParams = {
            TopicArn: topicArn,
            Message: message,
        };

        console.log("SNS Params:", snsParams); // Debugging log

        await snsClient.send(new PublishCommand(snsParams));
        console.log("Notification sent!");
    }

    return {
        statusCode: 200,
        body: "Hi from Lambda",
    };
};
