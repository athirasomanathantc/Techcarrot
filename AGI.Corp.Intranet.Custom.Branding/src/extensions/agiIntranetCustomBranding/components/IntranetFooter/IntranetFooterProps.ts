import { ApplicationCustomizerContext } from "@microsoft/sp-application-base";
import { SPHttpClient } from '@microsoft/sp-http';

export interface IIntranetFooterProps {
  siteUrl: string;
  context: ApplicationCustomizerContext;
  spHttpClient: SPHttpClient;
}