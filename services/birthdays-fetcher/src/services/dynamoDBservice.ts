import * as aws from 'aws-sdk';

export class DynamoDBService {
  dynamoDBClient: aws.DynamoDB;
  params: Record<string, any>[];

  constructor(params: Record<string, any>[]) {
    this.dynamoDBClient = new aws.DynamoDB({ region: 'eu-central-1' });
    this.params = params;
  }

  updateAllData() {
    this.params.forEach((employee) => {
      const inputParams = this.prepareParams(employee);

      this.dynamoDBClient.updateItem(inputParams, (err, data) => {
        if (err) {
          console.log(err, err.stack);
        }
      });
    });
  }

  private prepareParams(employee: Record<string, any>) {
    return {
      TableName: 'Birthdays',
      Key: {
        userName: { S: employee.userName }
      },
      ExpressionAttributeNames: {
        '#AT': 'birthday',
        '#Y': 'photo'
      },
      ExpressionAttributeValues: {
        ':t': {
          S: employee.birthday
        },
        ':y': {
          S: employee.photo
        }
      },
      UpdateExpression: 'SET #Y = :y, #AT = :t'
    };
  }
}
