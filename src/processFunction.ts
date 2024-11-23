import { SNSClient, PublishCommand } from "@aws-sdk/client-sns";
import { DynamoDBClient, PutItemCommand } from "@aws-sdk/client-dynamodb";

const snsClient = new SNSClient({});
const dynamoClient = new DynamoDBClient({});

export const handler = async (event: any) => {
    const body = JSON.parse(event.body);
    const isValidJson = body.text ? true : false; // Just a simple check for validity

    console.log("Event body:", event.body); // Debugging log
    console.log("Parsed body:", body); // Debugging log

    if (!isValidJson) {
        console.log("Invalid JSON detected");

        // Add an item to DynamoDB with the invalid JSON message
        const ttl = Math.floor(Date.now() / 1000) + 3600; // TTL example: 1 hour
        const putItemParams = {
            TableName: process.env.TABLE_NAME,
            Item: {
                id: { S: new Date().toISOString() },
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
            TopicArn: process.env.TOPIC_ARN,
            Message: message,
        };

        console.log("SNS Params:", snsParams); // Debugging log

        await snsClient.send(new PublishCommand(snsParams));
        console.log("Notification sent!");
    }
};
