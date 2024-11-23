import { handler } from "../src/processFunction";
import { SNSClient, PublishCommand } from "@aws-sdk/client-sns";
import { DynamoDBClient, PutItemCommand } from "@aws-sdk/client-dynamodb";

// Mock the SNS and DynamoDB clients
jest.mock("@aws-sdk/client-sns", () => ({
    SNSClient: jest.fn().mockImplementation(() => ({
        send: jest.fn().mockResolvedValue({}), // Mocking the send method
    })),
    PublishCommand: jest.fn(),
}));

jest.mock("@aws-sdk/client-dynamodb", () => ({
    DynamoDBClient: jest.fn().mockImplementation(() => ({
        send: jest.fn().mockResolvedValue({}), // Mocking the send method
    })),
    PutItemCommand: jest.fn(),
}));

describe("processFunction", () => {
    beforeAll(() => {
        process.env.TABLE_NAME = "TestTable"; // Mock environment variable
        process.env.TOPIC_ARN = "TestTopicArn"; // Mock environment variable
    });

    it("should send SNS notification for valid JSON", async () => {
        // Mock event with valid JSON
        const event = { body: '{"text":"Valid JSON"}' };

        // Call the handler function
        await handler(event);

        // Check that snsClient.send was called with the correct message
        expect(SNSClient.prototype.send).toHaveBeenCalledWith(
            expect.objectContaining({
                Message: "Valid JSON received: Valid JSON",
            })
        );
    });

    it("should add an item to DynamoDB for invalid JSON", async () => {
        // Mock event with invalid JSON
        const event = { body: "{}" };

        // Call the handler function
        await handler(event);

        // Check that dynamoDBClient.send was called with the correct TableName
        expect(DynamoDBClient.prototype.send).toHaveBeenCalledWith(
            expect.objectContaining({
                TableName: process.env.TABLE_NAME,
            })
        );
    });
});
