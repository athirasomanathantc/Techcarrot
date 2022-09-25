import { IContentItem } from "../models/IContentItem";


export interface IAgiIntBusFuncContentState {
  contentItems : IContentItem[];
  lastNavItem: string;
  programID: string;
}