import pino from 'pino';
import { DynamoDBDataFetcher } from './services/dynamoDBDataFetcher';

const logger = pino();

export const handler = async(): Promise<any> => {
  try {
    const dynamoDBFetcherService = new DynamoDBDataFetcher(logger);
    const result = await dynamoDBFetcherService.getAllData();

    return {
      statusCode: 200,
      body: JSON.stringify(result)
    };
  } catch (error: any) {
    logger.error(error);

    return {
      status: error.status,
      body: JSON.stringify({
        message: JSON.parse(error.body).message
      })
    };
  }
};
