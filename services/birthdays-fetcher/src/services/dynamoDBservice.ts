import { DynamoDBClient, PutItemCommand, PutItemCommandInput } from '@aws-sdk/client-dynamodb';
import { NotionDataType } from './notionFetcherService';

export class DynamoDBService {
  dynamoDBClient: DynamoDBClient;
  params: NotionDataType[];

  constructor(params: NotionDataType[]) {
    this.dynamoDBClient = new DynamoDBClient({ region: 'eu-central-1' });
    this.params = params;
  }

  async updateAllData(): Promise<void> {
    let inputParams: PutItemCommandInput;

    for (const employee of this.params) {
      inputParams = this.prepareParams(employee);
      try {
        await this.dynamoDBClient.send(new PutItemCommand(inputParams));
      } catch (err) {
        console.log(err);
      }
    }
  }

  private prepareParams(employee: NotionDataType): PutItemCommandInput {
    return {
      Item: {
        userName: {
          S: employee.userName
        },
        birthday: {
          S: employee.birthday
        },
        photo: {
          S: employee.photo
        }
      },
      ReturnConsumedCapacity: 'TOTAL',
      TableName: 'Birthdays'
    };
  }
}
