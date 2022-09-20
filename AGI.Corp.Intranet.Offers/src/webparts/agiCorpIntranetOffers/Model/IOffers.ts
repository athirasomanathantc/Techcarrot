export interface IOfferData {
    ID: string;
    Title: string;
    Description: string;
    OfferThumbnail: string;
    OfferImage: string;
    Business: {
        ID: number,
        Title: string
    }
    Functions: {
        ID: number,
        Title: string
    }
}