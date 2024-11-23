import { App } from "aws-cdk-lib";
import { Template } from "aws-cdk-lib/assertions";
import { CdkStack } from "../lib/cdkstack";

test("DynamoDB Table Created", () => {
    const app = new App();
    const stack = new CdkStack(app, "TestStack");

    const template = Template.fromStack(stack);

    // Check if DynamoDB Table was created with the expected properties
    template.hasResourceProperties("AWS::DynamoDB::Table", {
        BillingMode: "PAY_PER_REQUEST",
        TimeToLiveSpecification: {
            AttributeName: "ttl",
            Enabled: true,
        },
    });
});

test("API Gateway Created", () => {
    const app = new App();
    const stack = new CdkStack(app, "TestStack");

    const template = Template.fromStack(stack);

    // Check if API Gateway was created
    template.hasResource("AWS::ApiGateway::RestApi", {});
});

test("SNS Topic Created", () => {
    const app = new App();
    const stack = new CdkStack(app, "TestStack");

    const template = Template.fromStack(stack);

    // Check if SNS Topic was created with TopicName
    template.hasResourceProperties("AWS::SNS::Topic", {
        TopicName: "ErrorTopic", // Ensure this matches your SNS topic's name
    });
});
