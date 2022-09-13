export interface ISnap {
    index: number;
    key: number;
    Id: number;
    Author: {
        Title: string;
    };
    ImageDescription: string;
    File: {
        Name: string;
        ServerRelativeUrl: string;
    };
}