import { IImageItem } from "../models/IImageItem";

export const LIBRARY_SNAP_SHARE = 'SnapAndShare';
export const TEXT_UPLOAD_SUCCESS = 'File uploaded successfully and sent for approval.';

export const WARNING_TEXT_INVALID_FILETYPE = "Invalid file type, only support .jpg, .jpeg, .png, .gif";
export const WARNING_TEXT_FILE_SIZE = "File size should be less than 8MB";
export const WARNING_TEXT_DESCRIPTION_LENGTH = "Only 200 charecters are allowed";
export const WARNING_TEXT_DESCRIPTION_REQUIRED = "Description is required";

export const PAGE_SIZE = 12;

export const NULL_IMAGE_ITEM: IImageItem = { 
    ID: 0,
    File: { ServerRelativeUrl: '', Name: '' },
    ImageDescription: '',
    Author: { Title: '', ID: 0 },
    Created:""
}