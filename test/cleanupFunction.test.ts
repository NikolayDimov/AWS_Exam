import { handler } from "../src/cleanupFunction";
import { SNSClient, PublishCommand } from "@aws-sdk/client-sns";

// Mocking the SNSClient and its methods
jest.mock("@aws-sdk/client-sns", () => {
    return {
        SNSClient: jest.fn().mockImplementation(() => {
            return {
                send: jest.fn(), // Mock the `send` method
            };
        }),
        PublishCommand: jest.fn(), // Mock the PublishCommand constructor
    };
});

describe("cleanupFunction", () => {
    let mockSend: jest.Mock;

    beforeEach(() => {
        // Reset the mock for each test
        mockSend = jest.fn().mockResolvedValue({});
        (SNSClient.prototype.send as jest.Mock) = mockSend;
    });

    it("should send SNS notification for deleted item", async () => {
        // Arrange
        const event = {
            Records: [
                {
                    eventName: "REMOVE",
                    dynamodb: {
                        OldImage: {
                            id: { S: "some-id" },
                            errorMessage: { S: "Something went wrong!" },
                        },
                    },
                },
            ],
        };
        process.env.TOPIC_ARN = "arn:aws:sns:region:123456789012:example-topic";

        // Act
        await handler(event);

        // Assert
        expect(mockSend).toHaveBeenCalledTimes(1); // Verify `send` was called once
        expect(mockSend).toHaveBeenCalledWith(
            expect.objectContaining({
                TopicArn: process.env.TOPIC_ARN,
                Message: expect.stringContaining("DynamoDB item deleted"),
            })
        );
    });
});
