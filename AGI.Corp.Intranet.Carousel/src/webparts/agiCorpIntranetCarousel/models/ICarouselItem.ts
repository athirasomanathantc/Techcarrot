export interface ICarouselItem {
    ID: number;
    Title: string;
    SubTitle: string;
    PageType: string;
    OtherPage: string;
    Business: string;
    Function: string;
    ImageorVideo: string;
    AttachmentFiles:{ServerRelativeUrl: string}
}