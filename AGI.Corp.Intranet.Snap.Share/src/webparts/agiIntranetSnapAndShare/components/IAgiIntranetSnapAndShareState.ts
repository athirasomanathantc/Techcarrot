import { IImageItem } from "../models/IImageItem";

export interface IAgiIntranetSnapAndShareState {
    images: IImageItem[];
    pageData: IImageItem[];
    preview: boolean;
    currentIndex: number;
    selectedImageUrl: string;
    selectedImageTitle: string;
    selectedImageDescription: string;
    selectedImageAuthorName: string;
    selectedImageDate: string;
    description: string;
    fileName: string;
    file: any;
    showSuccessModal: boolean;
    itemCount: number;
    totalPages: number;
    currentPage: number;
    pageSize: number;
    
}