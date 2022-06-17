import dotenv from 'dotenv';
import { Client } from '@notionhq/client';

dotenv.config();

export type NotionDataType = {
  userName: string,
  birthday: string,
  photo: string
}

export class FetchBirthdayDaysService {
  notion: Client;
  notionDatabaseID: string;

  constructor() {
    this.notion = new Client({ auth: process.env.NOTION_API_KEY ?? 'wrong_api_key' });
    this.notionDatabaseID = process.env.NOTION_DATABASE_ID ?? 'wrong_id';
  }

  async fetchData(): Promise<NotionDataType[]> {
    const databaseUsersList = await this.notion.databases.query({ database_id: this.notionDatabaseID });

    const result = databaseUsersList.results.map((userObject: Record<string, any>) => {
      const userName = userObject.properties.Name.title[0].text.content;
      const Date = userObject.properties.Birthday.date.start;
      const photoUrl = userObject.properties.Photo.files[0].file.url;

      return { userName: userName, birthday: Date, photo: photoUrl };
    });

    return result;
  };
}
