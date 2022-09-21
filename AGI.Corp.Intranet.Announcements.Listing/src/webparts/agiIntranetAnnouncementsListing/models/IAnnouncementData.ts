export interface IAnnouncementData {
    ID: number;
    Title: string;
    Description: string;
    Summary: string;
    AnnouncementImage: string;
    AnnouncementThumbnail: string;
    PublishedDate: Date;
    Functions: {
        ID: number;
        Title: String;
    };
    Business: {
        ID: number;
        Title: String;
    };
    Location: string;
}