import { IContentItem } from "../models/IContentItem";


export interface IAgiIntBusFuncBannerState {
  contentItems : IContentItem[];
  lastNavItem: string;
  programID: string;
}