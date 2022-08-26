export interface IBlogItem {
    ID: number;
    Title: string;
    Summary: string;
    BlogImage: string;
    Business: { ID: number, Title: string },
    Author: { ID: number, Title: string },
    PublishedDate: Date,
    ViewsJSON: string;
    BlogLikedBy: string;
}