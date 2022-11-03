import { IFolder } from "@pnp/sp/folders";
import { IFileData } from "../models/IFileData";
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
  imageTitle: string;
    videoTitle: string;
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
  },
  isDataLoaded: boolean;
  //paging - images
  pagedImages: IImageItem[];
  imagesPerPage: number;
  totalImages: number;
  imagesCurrentPage: number;

  fileData: IFileData[];
  isFeatured: boolean;
  featured: {
    fileData: IFileData[];
    imageItems: IImageItem[];
    pagedImages: IImageItem[];
    totalImages: number;
    imagesPerPage: number;
    selectedImageFolder: string;
    imagesCurrentPage: number;
    pageData: IFolderItem[];
    videoData: IImageItem[];
    totalPage: number;
    currentPage: number;
    filterVideoData: IImageItem[];
    pageVideoSize: number;
    imageGalleryTitle: string;
    videoGalleryTitle: string;
  }
}
