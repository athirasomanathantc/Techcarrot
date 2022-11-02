import { IContentItem } from "../models/IContentItem";


export interface IAgiIntBusFuncMediaState {
  contentItems: IContentItem[];
  lastNavItem: string;
  programID: string;
  mediaTitle: string;
}