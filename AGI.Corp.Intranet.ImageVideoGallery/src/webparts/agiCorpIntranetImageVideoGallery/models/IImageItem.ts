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
    BusinessId?: number;
    Business?:{
        ID:number;
        Title:string;
    },
    ListItemAllFields?: {
        ID: number
    }
}