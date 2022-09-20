export interface IBlogData {
    ID: string;
    Title: string;
    PublishedDate: string;
    BlogThumbnail: string;
    BlogImage: string;
    Author: {
        ID: string,
        Title: string,
    };
    Business: {
        ID: number,
        Title: string
    }
    Functions: {
        ID: number,
        Title: string
    }
}