export interface IBlogData{
    ID:string;
    Title:string;
    Category:string;
    PublishedDate:string;
    Summary:string;
    BlogThumbnail:string;
    BlogImage:string;
    Editor:{
        ID:string,
        Title:string,
    };
    Business:{
        ID:number,
        Title:string
        
    }

}