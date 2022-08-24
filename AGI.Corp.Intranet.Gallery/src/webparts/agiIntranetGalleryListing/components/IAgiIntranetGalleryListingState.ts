import { IFolderItem } from "../models/IFolderItem";
import { IImageItem } from "../models/IImageItem";

export interface IAgiIntranetGalleryListingState {
    folders: IFolderItem[];
    files: IImageItem[];
    videoItems : IImageItem[];
    imageItems : IImageItem[];
    selectedImageFolder:string;
    selectedItem: IImageItem;
    showVideo: boolean;
    selectedVideoUrl: string;
}
