export interface IBlogData{
    ID:string;
    Title:string;
    Category:string;
    PublishedDate:string;
    BlogThumbnail:string;
    BlogImage:string;
    Author:{
        ID:string,
        Title:string,
    };
    Business:{
        ID:number,
        Title:string
        
    }

}