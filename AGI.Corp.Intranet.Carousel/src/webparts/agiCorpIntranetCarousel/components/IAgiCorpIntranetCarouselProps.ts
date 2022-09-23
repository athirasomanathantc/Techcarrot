import { SPHttpClient } from '@microsoft/sp-http';

export interface IAgiCorpIntranetCarouselProps {
  description: string;
  siteUrl: string;
  context: any;
  spHttpClient: SPHttpClient; 
  listName: string;
}
