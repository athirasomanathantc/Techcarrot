export interface IContentItem {
    ID: number;
    Title: string;
    ServiceName: {Title: string, Id: string};
    ContentImage: string;
    PrimaryDescription: string;
    SecondaryDescription: string;
}