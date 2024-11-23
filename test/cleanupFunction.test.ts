// import { handler } from "../src/cleanupFunction";
// import { SNSClient, PublishCommand } from "@aws-sdk/client-sns";

// // Mocking the SNSClient and its methods
// jest.mock("@aws-sdk/client-sns", () => {
//     return {
//         SNSClient: jest.fn().mockImplementation(() => {
//             return {
//                 send: jest.fn(), // Mock the `send` method
//             };
//         }),
//         PublishCommand: jest.fn(), // Mock the PublishCommand constructor
//     };
// });

// describe("cleanupFunction", () => {
//     let mockSend: jest.Mock;

//     beforeEach(() => {
//         // Reset the mock for each test
//         mockSend = jest.fn().mockResolvedValue({});
//         (SNSClient.prototype.send as jest.Mock) = mockSend;
//     });

//     it("should send SNS notification for deleted item", async () => {
//         // Arrange
//         const event = {
//             Records: [
//                 {
//                     eventName: "REMOVE",
//                     dynamodb: {
//                         OldImage: {
//                             id: { S: "some-id" },
//                             errorMessage: { S: "Something went wrong!" },
//                         },
//                     },
//                 },
//             ],
//         };
//         process.env.TOPIC_ARN = "arn:aws:sns:eu-central-1:600627359610:ErrorTopic";

//         // Act
//         await handler(event);

//         // Assert
//         expect(mockSend).toHaveBeenCalledTimes(1); // Verify `send` was called once
//         expect(mockSend).toHaveBeenCalledWith(
//             expect.objectContaining({
//                 TopicArn: process.env.TOPIC_ARN,
//                 Message: expect.stringContaining("DynamoDB item deleted"),
//             })
//         );
//     });
// });

import { Stack } from "aws-cdk-lib";
import { Table, AttributeType } from "aws-cdk-lib/aws-dynamodb";
import { Topic } from "aws-cdk-lib/aws-sns";
import "jest-cdk-snapshot"; // Import jest-cdk-snapshot

describe("Infrastructure Snapshot Test", () => {
    it("should match the CloudFormation snapshot", () => {
        // Create a new CDK stack
        const stack = new Stack();

        // Add resources to the stack
        new Table(stack, "ErrorTable", {
            partitionKey: { name: "id", type: AttributeType.STRING },
        });

        new Topic(stack, "ErrorTopic");

        // Take a snapshot of the stack and compare it
        expect(stack).toMatchCdkSnapshot();
    });
});
