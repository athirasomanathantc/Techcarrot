export interface IAnnouncementData {
    ID: number;
    Title: string;
    Description: string;
    Summary: string;
    AnnouncementImage: string;
    AnnouncementThumbnail: string;
    PublishedDate: Date;
    Business:{
        ID:number;
        Title:String;
    };
    Location:string;
}