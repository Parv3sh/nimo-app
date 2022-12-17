# nimo-app

Project Structure:

- `src` - Code for the application's Lambda function.
- `events` - Invocation events that you can use to invoke the function.
- `__tests__` - Unit tests for the application code.
- `template.yaml` - A template that defines the application's AWS resources.

The application uses several AWS resources, including Lambda functions, an API Gateway API, SSM Parameter Store, Simple Email Service and Amazon DynamoDB tables. These resources are defined in the `template.yaml` file in this project.

## Deploy the sample application

Requirements:

- AWS SAM CLI - [Install the AWS SAM CLI](https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/serverless-sam-cli-install.html).
- Node.js - [Install Node.js 18](https://nodejs.org/en/), including the npm package management tool.
- Docker - [Install Docker community edition](https://hub.docker.com/search/?type=edition&offering=community).

To build and deploy your application for the first time, run the following in your shell:

```bash
sam build
sam deploy --guided
```

The API Gateway endpoint API will be displayed in the outputs when the deployment is complete.

## Use the AWS SAM CLI to build and test locally

Build your application by using the `sam build` command.

```bash
sam build
```

The AWS SAM CLI installs dependencies that are defined in `package.json`, creates a deployment package, and saves it in the `.aws-sam/build` folder.

Test a single function by invoking it directly with a test event. An event is a JSON document that represents the input that the function receives from the event source. Test events are included in the `events` folder in this project.

Run functions locally and invoke them with the `sam local invoke` command.

```bash
sam local invoke putItemFunction --event events/event-post-item.json
sam local invoke getAllItemsFunction --event events/event-get-all-items.json
```

Use the `sam local start-api` command to run the API locally on port 3000.

```bash
sam local start-api
curl http://localhost:3000/
```

```bash
sam deploy
```

## Fetch, tail, and filter Lambda function logs

```bash
sam logs -n putItemFunction --stack-name sam-app --tail
```

## Unit tests

Tests are defined in the `__tests__` folder in this project. Use `npm` to install the [Jest test framework](https://jestjs.io/) and run unit tests.

```bash
npm install
npm run test
```

## Cleanup

To delete the sample application, use the AWS CLI. Assuming you used your project name for the stack name, you can run the following:

```bash
aws cloudformation delete-stack --stack-name nimo-app
```

## How to use microservices

1. Price check and Email notification
   METHOD: POST
   `https://1b1ddt2yl0.execute-api.ap-southeast-2.amazonaws.com/Prod/idOfCoin`
   where idOfCoin is the id of the coin you want to check the price of. You can find the id of the coin in the list of available coins ids below.
   e.g. curl -X POST https://1b1ddt2yl0.execute-api.ap-southeast-2.amazonaws.com/Prod/bitcoin

2. History of price service
   METHOD: GET
   `https://1b1ddt2yl0.execute-api.ap-southeast-2.amazonaws.com/Prod`
   e.g. curl -X GET https://1b1ddt2yl0.execute-api.ap-southeast-2.amazonaws.com/Prod

## List of available coins ids

https://api.coingecko.com/api/v3/coins/list

## To add a new email to the list of emails to be notified

Add the email in SES verified emails list and then add the email in the SSM Parameter Store with the key "EMAILS" and the value being a list of emails separated by a comma.
