import { WebPartContext } from '@microsoft/sp-webpart-base';

export interface IAgiCorpIntranetGalleryListingProps {
  description: string;
  isDarkTheme: boolean;
  environmentMessage: string;
  hasTeamsContext: boolean;
  userDisplayName: string;
  siteUrl: string;
  context: WebPartContext;
  orderBy: string;
  libraryName: string;
  libraryPath: string;
}
