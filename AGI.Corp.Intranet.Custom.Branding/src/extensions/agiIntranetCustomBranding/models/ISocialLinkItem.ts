export interface ISocialLink {
    ID?: number;
    Title: string;
    Icon: string;
    Link: {
        Url: string;
        Description: string;
    }
}