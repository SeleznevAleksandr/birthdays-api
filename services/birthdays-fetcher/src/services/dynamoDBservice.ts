import { DynamoDBClient, PutItemCommand, PutItemCommandInput } from '@aws-sdk/client-dynamodb';
import pino from 'pino';
import { NotionDataType } from './notionFetcherService';

export class DynamoDBService {
  #dynamoDBClient: DynamoDBClient;
  #params: NotionDataType[];
  #logger: pino.Logger;

  constructor(params: NotionDataType[], logger: pino.Logger) {
    this.#dynamoDBClient = new DynamoDBClient({ region: 'eu-central-1' });
    this.#params = params;
    this.#logger = logger;
  }

  async updateAllData(): Promise<void> {
    let inputParams: PutItemCommandInput;

    this.#logger.info('Start processing data.');

    for (const employee of this.#params) {
      inputParams = this.prepareParams(employee);
      try {
        await this.#dynamoDBClient.send(new PutItemCommand(inputParams));
      } catch (err: any) {
        this.#logger.error(err);
      }
    }

    this.#logger.info('Processed successfully');
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
