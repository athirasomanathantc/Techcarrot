export interface INewsItem {
    ID: number;
    Title: string;
    Summary: string;
    NewsImage: string;
    Category: string;
    PublishedDate: Date;
    ViewsJSON: string;
    NewsLikedBy: string;
    Business: {
        Title: string;
        ID: number;
    };
    Functions: {
        Title: string;
        ID: number;
    };
    News: {
        Id: number;
    }
}