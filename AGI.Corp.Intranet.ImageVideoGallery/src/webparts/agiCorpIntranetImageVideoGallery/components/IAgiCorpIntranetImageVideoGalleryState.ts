import { IFolder } from "@pnp/sp/folders";
import { IFolderItem } from "../models/IFolderItem";
import { IImageItem } from "../models/IImageItem";

export interface IAgiCorpIntranetImageVideoGalleryState {
  folders: IFolderItem[];
  files: IImageItem[];
  videoItems: IImageItem[];
  imageItems: IImageItem[];
  selectedImageFolder: string;
  selectedItem: IImageItem;
  showVideo: boolean;
  selectedVideoUrl: string;
  slides: any;
  images: any;
  previewImage: string;
  preview: boolean;
  currentIndex: number;
  currentImageUrl: string;
  currentImageTitle: string;
  currentImageDescription: string;
  currentImageAuthorName: string;
  currentTabName: string;
  ServerRelativeUrl: string;
  folderData: IFolderItem[];
  filterData: IFolderItem[];
  filterVideoData: IImageItem[];
  filterValuesBusiness: {
    ID: number,
    Title: string
  }[];
  filterValuesFunctions: {
    ID: number,
    Title: string
  }[];
  currentPage: number;
  totalPages: number;
  pageData: IFolderItem[];
  videoData: IImageItem[];
  pageSize: number;
  totalPage: number;
  pageVideoSize: number;
  totalVideoPage: number;
  curFilterValue: number;
  showBusinessData: boolean;
  selectedOption: {
    ID: number;
  }
}