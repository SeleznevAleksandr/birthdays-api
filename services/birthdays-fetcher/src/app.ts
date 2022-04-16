import { FetchBirthdayDaysService } from './services/notionFetcherService';
import { DynamoDBService } from './services/dynamoDBservice';

async function getResult(): Promise<any> {
  const fetchBirthdayDaysService = new FetchBirthdayDaysService();
  const userData = await fetchBirthdayDaysService.fetchData();

  const dynamoDBService = new DynamoDBService(userData);
  dynamoDBService.updateAllData();
}

getResult();
