import { IContentItem } from "../models/IContentItem";


export interface IAgiIntBusFuncLeadershipState {
  contentItems : IContentItem[];
  lastNavItem: string;
  programID: string;
}