import { IContentItem } from "../models/IContentItem";


export interface IAgiIntBusFuncServiceState {
  contentItems: IContentItem[];
  lastNavItem: string;
  programID: string;
  ourServicesTitle: string;
}