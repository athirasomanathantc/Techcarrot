import { SPHttpClient } from '@microsoft/sp-http';
import { WebPartContext } from '@microsoft/sp-webpart-base';

export interface IAgiCorpIntranetImageVideoGalleryProps {
  description: string;
  isDarkTheme: boolean;
  environmentMessage: string;
  spHttpClient: SPHttpClient;
  hasTeamsContext: boolean;
  userDisplayName: string;
  siteUrl: string;
  context: any;
  orderBy: string;
  libraryName: string;
  libraryPath: string;
}
