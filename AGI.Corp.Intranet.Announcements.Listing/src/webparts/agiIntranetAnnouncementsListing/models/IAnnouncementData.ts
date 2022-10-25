export interface IAnnouncementData {
    ID: number;
    Title: string;
    Description: string;
    Summary: string;
    AnnouncementImage: string;
    AnnouncementThumbnail: string;
    PublishedDate: string;
    Functions: {
        ID: number;
        Title: String;
    };
    Business: {
        ID: number;
        Title: String;
    };
    Location: string;
    Featured: boolean;
    Modified: string;
}