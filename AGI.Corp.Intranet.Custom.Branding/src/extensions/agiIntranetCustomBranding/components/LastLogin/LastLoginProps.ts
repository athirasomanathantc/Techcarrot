import { ApplicationCustomizerContext } from "@microsoft/sp-application-base";
import { SPHttpClient } from '@microsoft/sp-http';

export interface LastLoginProps {
  siteUrl: string;
  context: any;
  spHttpClient: SPHttpClient;
  
}