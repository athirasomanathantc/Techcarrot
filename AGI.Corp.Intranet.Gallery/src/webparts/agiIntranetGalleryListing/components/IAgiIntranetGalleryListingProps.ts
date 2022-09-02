import { WebPartContext } from '@microsoft/sp-webpart-base';

export interface IAgiIntranetGalleryListingProps {
  description: string;
  isDarkTheme: boolean;
  environmentMessage: string;
  hasTeamsContext: boolean;
  userDisplayName: string;
  siteUrl: string;
  context: any;
  orderBy: string;
  libraryName: string;
  libraryPath: string;
}
