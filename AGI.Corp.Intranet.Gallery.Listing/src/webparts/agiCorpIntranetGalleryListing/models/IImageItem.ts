export interface IImageItem {
    ServerRelativeUrl?: string;
    ID?: number;
    Title?: string;
    FileLeafRef?: string;
    FileRef?: string;
    VideoThumbnail?:string;
    isCoverPhoto?:string;
    showVideo?: boolean;
    selectedVideoUrl?: string;
}