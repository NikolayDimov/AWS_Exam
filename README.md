# AWS-based Service for Processing JSON Documents

This project implements an AWS-based service that processes JSON documents, providing the following functionality:

-   **Public REST API**: Accepts JSON documents via POST requests.
-   **Email Notifications**:
    -   Sends an email if the JSON is valid.
    -   Logs invalid JSON to DynamoDB and schedules deletion after 30 minutes.
    -   Sends an email when a logged item is deleted.
-   **Error Handling**: Manages invalid JSON entries and processes automatic cleanup via DynamoDB TTL.
-   **CI/CD Pipeline**: Ensures code quality using GitHub Actions.
-   **Reusable Components**: Designed with AWS CDK in TypeScript for easy deployment and scalability.

---

## Architecture

The system leverages the following AWS services:

-   **API Gateway**: Provides a REST API endpoint for public access.
-   **Lambda Functions**: Handles JSON validation, processing, and TTL-based deletion events.
-   **DynamoDB**: Logs invalid JSON documents with a Time-To-Live (TTL) for automatic deletion.
-   **SNS**: Sends email notifications for valid JSON and deletion events.
-   **CloudWatch**: Logs and monitors system activities.

---

## Project Structure

```plaintext
json-processing-service/
├── bin/                       # Entry point for the CDK application
│   └── json-processing-service.ts
├── lib/                       # Contains the CDK stack definitions
│   └── json-processing-service-stack.ts
├── lambdas/                   # Lambda function source code
│   ├── processJson.ts         # Lambda to validate and process JSON
│   └── handleDeletion.ts      # Lambda to handle TTL-triggered deletions
├── test/                      # Unit tests for the infrastructure
│   └── json-processing-service.test.ts
├── .gitignore                 # Files to ignore in the repository
├── cdk.json                   # CDK project configuration
├── package.json               # NPM dependencies and scripts
├── README.md                  # Project documentation
└── tsconfig.json              # TypeScript configuration



```
