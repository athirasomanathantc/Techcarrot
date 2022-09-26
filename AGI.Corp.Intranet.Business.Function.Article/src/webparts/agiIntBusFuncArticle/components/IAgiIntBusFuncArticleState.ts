import { IBannerItem } from "../models/IBannerItem";
import { ISlideItem } from "../models/ISlideItem";
import { IContentItem } from "../models/IContentItem";
import { IContent2Item } from "../models/IContent2Item";
import { IContent3Item } from "../models/IContent3Item";


export interface IAgiIntBusFuncArticleState {
  bannerItems : IBannerItem[];
  slideItems : ISlideItem[];
  contentItems : IContentItem[];
  content2Items : IContent2Item[];
  content3Items : IContent3Item[];
  lastNavItem: string;
  programID: string;
}