import { FetchBirthdayDaysService } from './services/notionFetcherService';
import { DynamoDBService } from './services/dynamoDBservice';

export const handler = async(event: any, context: any): Promise<any> => {
  const fetchBirthdayDaysService = new FetchBirthdayDaysService();
  const userData = await fetchBirthdayDaysService.fetchData();

  const dynamoDBService = new DynamoDBService(userData);
  await dynamoDBService.updateAllData();

  return {
    statusCode: 200,
    body: JSON.stringify({
      message: 'processed successfully'
    })
  };
};
