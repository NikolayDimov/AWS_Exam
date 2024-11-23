import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import { Subscription, SubscriptionProtocol, Topic } from "aws-cdk-lib/aws-sns";
import { AttributeType, BillingMode, StreamViewType, Table } from "aws-cdk-lib/aws-dynamodb";
import { CfnOutput } from "aws-cdk-lib";

export class CdkStack extends cdk.Stack {
    constructor(scope: Construct, id: string, props?: cdk.StackProps) {
        super(scope, id, props);

        // DynamoDB Table (added earlier)
        const errorTable = new Table(this, "ErrorTable", {
            partitionKey: {
                name: "id",
                type: AttributeType.STRING,
            },
            billingMode: BillingMode.PAY_PER_REQUEST,
            timeToLiveAttribute: "ttl",
            stream: StreamViewType.NEW_AND_OLD_IMAGES,
        });

        // SNS Topic
        const errorTopic = new Topic(this, "ErrorTopic", {
            topicName: "ErrorTopic",
        });

        // Email Subscription
        new Subscription(this, "ErrorSubscription", {
            topic: errorTopic,
            protocol: SubscriptionProtocol.EMAIL,
            endpoint: "atclient115@gmail.com",
        });

        // Outputs
        new CfnOutput(this, "TopicArn", {
            value: errorTopic.topicArn,
        });
    }
}
