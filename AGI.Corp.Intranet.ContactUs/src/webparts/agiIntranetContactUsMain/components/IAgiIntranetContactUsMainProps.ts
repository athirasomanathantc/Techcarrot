import { MSGraphClient } from "@microsoft/sp-http";

export interface IAgiIntranetContactUsMainProps {
  description: string;
  graphClient: MSGraphClient;
  siteUrl: string;
  context: any
}
