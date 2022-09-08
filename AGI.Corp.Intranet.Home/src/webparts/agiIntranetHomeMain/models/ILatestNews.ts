export interface ILatestNews {
    index: number;
    key?: string;
    Id: number;
    Title: string;
    Created: Date;
    Business: {
        Title: string;
    };
    PublishedDate: Date;
    NewsImage: string;
}