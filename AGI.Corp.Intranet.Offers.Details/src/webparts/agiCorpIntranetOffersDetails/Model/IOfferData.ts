export interface IOfferData{
    ID:number;
    Title:string;
    OfferThumbnail:string;
    OfferImage:string;
    ReadBy:string;
    Content1:string;
    Content2:string;
    MiddleImage:string;

    Business:{
        ID: number;
        Title: string;
    }
}