export interface INewsData {
    ID: string;
    Title: string;
    PublishedDate: string;
    Modified: string;
    Description: string;
    Summary: string;
    NewsThumbnail: string;
    NewsImage: string;
    Business: {
        ID: number;
        Title: string;
    }
    Functions: {
        ID: number,
        Title: string
    },
    Featured: boolean
}