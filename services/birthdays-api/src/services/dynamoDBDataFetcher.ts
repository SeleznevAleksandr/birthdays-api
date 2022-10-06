import { DynamoDBClient, ScanCommand } from '@aws-sdk/client-dynamodb';
import pino from 'pino';

export class DynamoDBDataFetcher {
  #dynamoDBClient: DynamoDBClient;
  #logger: pino.Logger;

  constructor(logger: pino.Logger) {
    this.#dynamoDBClient = new DynamoDBClient({ region: 'eu-central-1', apiVersion: '2012-08-10' });
    this.#logger = logger;
  }

  async getAllData(): Promise<any> {
    this.#logger.info('Start processing data.');

    const result = await this.#dynamoDBClient.send(new ScanCommand({ TableName: process.env.DYNAMO_DB_TABLE_NAME }));
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth() + 1;
    const currentDay = currentDate.getDate();

    const mappedResult = result.Items?.map(entry => {
      return {
        userName: entry.userName.S,
        photo: entry.photo.S,
        birthday: entry.birthday.S
      };
    });

    mappedResult!.sort((date1, date2) => {
      const parsedDate1 = date1.birthday?.split('-').map((value) => Number(value)) as number[];
      const parsedDate2 = date2.birthday?.split('-').map((value) => Number(value)) as number[];

      if ((parsedDate1[1] < currentMonth) || ((parsedDate1[1] === currentMonth) && (parsedDate1[2] < currentDay))) {
        return 1;
      }

      if ((parsedDate2[1] < currentMonth) || ((parsedDate2[1] === currentMonth) && (parsedDate2[2] < currentDay))) {
        return -1;
      };

      const dateToCompare1 = new Date(currentDate.getFullYear(), parsedDate1[1] - 1, parsedDate1[2]);
      const dateToCompare2 = new Date(currentDate.getFullYear(), parsedDate2[1] - 1, parsedDate2[2]);

      const result1 = dateToCompare1.getTime() - currentDate.getTime();
      const result2 = dateToCompare2.getTime() - currentDate.getTime();

      if (result1 > result2) {
        return 1;
      } else if (result1 < result2) {
        return -1;
      } else {
        return 0;
      }
    });

    this.#logger.info('Processed successfully');

    return mappedResult;
  }
}
