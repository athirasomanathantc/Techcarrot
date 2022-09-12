import { ApplicationCustomizerContext } from "@microsoft/sp-application-base";
import { SPHttpClient } from '@microsoft/sp-http';

export interface IIntranetHeaderProps {
  siteUrl: string;
  context: any;
  spHttpClient: SPHttpClient;
}