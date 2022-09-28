import { IContentItem } from "../models/IContentItem";


export interface IAgiIntBusFuncsServiceState {
  contentItems : IContentItem[];
  lastNavItem: string;
  programID: string;
}