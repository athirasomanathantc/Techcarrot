export interface IAnnouncementData {
    ID: number;
    Title: string;
    Description: string;
    Summary: string;
    AnnouncementImage: string;
    AnnouncementThumbnail: string;
    PublishedDate: Date;
    ViewsJSON: string;
    Business:{
        ID:number;
        Title:String;
    };
    Location:string;
    Functions: {
        Title: string;
        ID: number;
    };
    Announcements: {
        ID: number;
    }
}