import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { SNSClient, PublishCommand } from "@aws-sdk/client-sns";

// SDK For SNS and DynamoDB
const snsClient = new SNSClient({});
const dynamoDBClient = new DynamoDBClient({});

export const handler = async (event: any) => {
    const tableName = process.env.TABLE_NAME;
    const topicArn = process.env.TOPIC_ARN;

    if (!topicArn) {
        throw new Error("TOPIC_ARN is not defined in the environment variables.");
    }

    console.log("Event received:", JSON.stringify(event, null, 2));

    // Process the DynamoDB stream event records
    for (const record of event.Records) {
        console.log("Event Name:", record.eventName); // Debugging event name

        // Check if the event type is REMOVE (item deletion)
        if (record.eventName === "REMOVE") {
            // Access the deleted item from the DynamoDB stream record
            const deletedItem = record.dynamodb?.OldImage;
            console.log("Deleted Item:", deletedItem); // Debugging deleted item

            if (deletedItem) {
                // Create a message for the SNS notification
                const message = `DynamoDB item deleted: ${JSON.stringify(deletedItem)}`;

                // Publish a message to SNS
                console.log("Sending SNS notification...");
                await snsClient.send(
                    new PublishCommand({
                        TopicArn: topicArn,
                        Message: message,
                    })
                );

                console.log("SNS notification sent for deleted item:", message);
            }
        }
    }

    return {
        statusCode: 200,
        body: "Cleanup function processed successfully",
    };
};
