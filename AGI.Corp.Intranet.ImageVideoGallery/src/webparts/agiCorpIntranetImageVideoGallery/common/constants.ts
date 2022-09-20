import { IImageItem } from "../models/IImageItem";

export const LIBRARY_PHOTO_GALLERY = "Image Gallery";

export const LIBRARY_VIDEO_GALLERY = "Video Gallery";

export const PATH_PHOTO_GALLERY: string = 'PhotoGallery';

export const PROP_DEFAULT_ORDERBY = 'TimeLastModified';

export const NULL_SELECTED_ITEM = { 
    FileLeafRef: '',
    FileRef: '' ,
    Author: { Title: '', ID: 0 }
}

    export const NULL_IMAGE_ITEM: IImageItem = { 
        ID: 0,
        File: { ServerRelativeUrl: '', Name: '' },
        ImageDescription: '',
        Author: { Title: '', ID: 0 }
    }

