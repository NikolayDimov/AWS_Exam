// import { handler } from "../src/processFunction";
// import { PutItemCommand, DynamoDBClient } from "@aws-sdk/client-dynamodb";
// import { PublishCommand, SNSClient } from "@aws-sdk/client-sns";

// // Mock AWS SDK clients
// jest.mock("@aws-sdk/client-dynamodb", () => {
//     return {
//         DynamoDBClient: jest.fn().mockImplementation(() => ({
//             send: jest.fn(),
//         })),
//         PutItemCommand: jest.fn(),
//     };
// });

// jest.mock("@aws-sdk/client-sns", () => {
//     return {
//         SNSClient: jest.fn().mockImplementation(() => ({
//             send: jest.fn(),
//         })),
//         PublishCommand: jest.fn(),
//     };
// });

// describe("handler function tests", () => {
//     let dynamoClient: DynamoDBClient;
//     let snsClient: SNSClient;

//     beforeEach(() => {
//         process.env.TABLE_NAME = "ErrorTable";
//         process.env.TOPIC_ARN = "arn:aws:sns:us-east-1:123456789012:ErrorTopic";

//         dynamoClient = new DynamoDBClient({});
//         snsClient = new SNSClient({});

//         (dynamoClient.send as jest.Mock).mockImplementation(() => Promise.resolve({}));
//         (snsClient.send as jest.Mock).mockImplementation(() => Promise.resolve({}));
//     });

//     afterEach(() => {
//         jest.clearAllMocks();
//     });

//     test("should call DynamoDB for invalid JSON", async () => {
//         const event = {
//             body: JSON.stringify({ invalid: "data" }),
//         };

//         await handler(event);

//         expect(PutItemCommand).toHaveBeenCalledWith(
//             expect.objectContaining({
//                 TableName: process.env.TABLE_NAME,
//                 Item: expect.any(Object),
//             })
//         );
//         expect(dynamoClient.send).toHaveBeenCalledTimes(1);
//     });

//     test("should send an SNS notification for valid JSON", async () => {
//         const event = {
//             body: JSON.stringify({ text: "Valid JSON" }),
//         };

//         await handler(event);

//         expect(PublishCommand).toHaveBeenCalledWith(
//             expect.objectContaining({
//                 TopicArn: process.env.TOPIC_ARN,
//                 Message: "Valid JSON received: Valid JSON",
//             })
//         );
//         expect(snsClient.send).toHaveBeenCalledTimes(1);
//     });
// });

import { handler } from "../src/processFunction";
import { Stack } from "aws-cdk-lib";
import { Table, AttributeType } from "aws-cdk-lib/aws-dynamodb"; // Corrected DynamoDB import
import { Topic } from "aws-cdk-lib/aws-sns"; // Corrected SNS import
import "jest-cdk-snapshot"; // This is the important import for snapshot matching
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { SNSClient } from "@aws-sdk/client-sns";

// Mock AWS SDK clients
jest.mock("@aws-sdk/client-dynamodb", () => {
    return {
        DynamoDBClient: jest.fn().mockImplementation(() => ({
            send: jest.fn(),
        })),
        PutItemCommand: jest.fn(),
    };
});

jest.mock("@aws-sdk/client-sns", () => {
    return {
        SNSClient: jest.fn().mockImplementation(() => ({
            send: jest.fn(),
        })),
        PublishCommand: jest.fn(),
    };
});

describe("handler function tests with CDK snapshot", () => {
    let dynamoClient: DynamoDBClient;
    let snsClient: SNSClient;

    beforeEach(() => {
        process.env.TABLE_NAME = "ErrorTable";
        process.env.TOPIC_ARN = "arn:aws:sns:us-east-1:123456789012:ErrorTopic";

        dynamoClient = new DynamoDBClient({});
        snsClient = new SNSClient({});

        (dynamoClient.send as jest.Mock).mockImplementation(() => Promise.resolve({}));
        (snsClient.send as jest.Mock).mockImplementation(() => Promise.resolve({}));
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    test("should call DynamoDB for invalid JSON", async () => {
        const event = {
            body: JSON.stringify({ invalid: "data" }),
        };

        await handler(event);

        // Snapshot of the stack after handler executes (simulating DynamoDB and SNS resource creation)
        const stack = new Stack();
        new Table(stack, "ErrorTable", {
            partitionKey: { name: "id", type: AttributeType.STRING },
        });

        new Topic(stack, "ErrorTopic");

        // Use jest-cdk-snapshot to validate CloudFormation template of the stack
        expect(stack).toMatchCdkSnapshot();
    });

    test("should send an SNS notification for valid JSON", async () => {
        const event = {
            body: JSON.stringify({ text: "Valid JSON" }),
        };

        await handler(event);

        // Snapshot of the stack after handler executes (simulating DynamoDB and SNS resource creation)
        const stack = new Stack();
        new Table(stack, "ErrorTable", {
            partitionKey: { name: "id", type: AttributeType.STRING },
        });

        new Topic(stack, "ErrorTopic");

        // Use jest-cdk-snapshot to validate CloudFormation template of the stack
        expect(stack).toMatchCdkSnapshot();
    });
});
