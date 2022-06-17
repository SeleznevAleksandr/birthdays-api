import { FetchBirthdayDaysService } from './services/notionFetcherService';
import { DynamoDBService } from './services/dynamoDBservice';
import { pino } from 'pino';

const logger = pino();

export const handler = async(event: any, context: any): Promise<any> => {
  try {
    const fetchBirthdayDaysService = new FetchBirthdayDaysService(logger);
    const userData = await fetchBirthdayDaysService.fetchData();

    const dynamoDBService = new DynamoDBService(userData, logger);
    await dynamoDBService.updateAllData();

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: 'processed successfully'
      })
    };
  } catch (error: any) {
    logger.info(error);

    return {
      status: error.status,
      body: JSON.stringify({
        message: JSON.parse(error.body).message
      })
    };
  }
};
