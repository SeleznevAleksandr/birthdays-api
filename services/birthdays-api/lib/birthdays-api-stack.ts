import { Stack, StackProps, aws_lambda, aws_dynamodb, aws_apigateway, aws_iam } from 'aws-cdk-lib';
import { AnyPrincipal, Effect } from 'aws-cdk-lib/aws-iam';
import { Construct } from 'constructs';
import dotenv from 'dotenv';

dotenv.config();

export class BirthdaysApiStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const lambda = new aws_lambda.Function(this, 'birthdays-fetcher-api', {
      code: aws_lambda.Code.fromAsset('index.zip'),
      handler: 'index.handler',
      runtime: aws_lambda.Runtime.NODEJS_14_X,
      functionName: 'birthdays-fetcher-api',
      environment: {
        DYNAMO_DB_TABLE_NAME: process.env.DYNAMO_DB_TABLE_NAME!
      }
    });

    const table = aws_dynamodb.Table.fromTableName(this, 'birthdaysTable', process.env.DYNAMO_DB_TABLE_NAME!);

    table.grantReadData(lambda);

    const apiResourcePolicy = new aws_iam.PolicyDocument({
      statements: [
        new aws_iam.PolicyStatement({
          principals: [new AnyPrincipal()],
          actions: ['execute-api:Invoke'],
          resources: [
            'execute-api:/*'
          ]
        }),
        new aws_iam.PolicyStatement({
          effect: Effect.DENY,
          principals: [new AnyPrincipal()],
          actions: ['execute-api:Invoke'],
          resources: ['execute-api:/*'],
          conditions: {
            NotIpAddress: {
              'aws:SourceIp': [process.env.ALLOWED_IP_ADDRESS]
            }
          }
        })
      ]
    });

    // eslint-disable-next-line no-new
    new aws_apigateway.LambdaRestApi(this, 'birthdays-api', {
      restApiName: 'birthdays-api',
      handler: lambda,
      policy: apiResourcePolicy,
      description: 'Birthday API Gateway',
      deployOptions: {
        stageName: 'v1'
      }
    });
  }
}
