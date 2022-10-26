import { IAboutUsItem } from "../models/IAboutUsItem";
import { ILeadershipMessageItem } from "../models/ILeadershipMessageItem";
import { ILeadershipTeamItem } from "../models/ILeadershipTeamItem";
import { IPurposeCultureVisionItem } from "../models/IPurposeCultureVisionItem";

export interface IAgiIntranetAboutMainState {
   aboutUsItem: IAboutUsItem;
   leadershipMessageItem: ILeadershipMessageItem[];
   leadershipTeamItems: ILeadershipTeamItem[];
   purposeCultureVisionItems: IPurposeCultureVisionItem[];
   selectedItem: ILeadershipTeamItem;
   showVideo: boolean;
   selectedVideoUrl: string;
   readMore: {
      leadershipContent1: boolean;
      leadershipContent2: boolean;
      aboutContent: boolean;
      ourCultureContent: boolean;
   }
}