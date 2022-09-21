export interface IEventData {
    ID: string;
    Title: string;
    StartDate: string;
    EndDate: string;
    Description: string;
    EventThumbnail: string;
    Country: string,
    City: string;
    Business: {
        ID: number;
        Title: String;
    };
    Functions: {
        ID: number,
        Title: string
    }
}