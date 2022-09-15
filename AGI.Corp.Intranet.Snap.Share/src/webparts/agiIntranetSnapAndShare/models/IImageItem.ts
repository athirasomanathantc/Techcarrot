export interface IImageItem {
    ID: number;
    File: { ServerRelativeUrl: string, Name: string };
    ImageDescription: string;
    Author: { Title: string, ID: number };
    Created:string;
}