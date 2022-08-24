import { WebPartContext } from '@microsoft/sp-webpart-base';

export interface IAgiIntranetGalleryListingProps {
  description: string;
  siteUrl: string;
  context: WebPartContext;
  orderBy: string;
  libraryName: string;
  libraryPath: string;
}
