import { IFolder } from "@pnp/sp/folders";
import { IFolderItem } from "../models/IFolderItem";
import { IImageItem } from "../models/IImageItem";

export interface IAgiCorpIntranetGalleryListingState {
    folders: IFolderItem[];
    files: IImageItem[];
    videoItems : IImageItem[];
    imageItems : IImageItem[];
    selectedImageFolder:string;
    selectedItem: IImageItem;
    showVideo: boolean;
    selectedVideoUrl: string;
    slides: any;
    images: any;
    previewImage: string;
    preview: boolean;
    currentIndex: number;
    currentImageUrl: string;
    ServerRelativeUrl: string;
    folderData: IFolderItem[];
    filterData:IFolderItem[];
    filterValues:{
      ID:number;
      Title:string;
    }[];
    currentPage: number;
    totalPages: number;
    pageData:IFolderItem[];
    pageSize:number;
    totalPage:number;
}
