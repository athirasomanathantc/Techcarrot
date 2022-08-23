import { WebPartContext } from "@microsoft/sp-webpart-base";

export interface IAgiIntranetNewsNotificationsProps {
  description: string;
  isDarkTheme: boolean;
  environmentMessage: string;
  hasTeamsContext: boolean;
  userDisplayName: string;
  context: any;
}