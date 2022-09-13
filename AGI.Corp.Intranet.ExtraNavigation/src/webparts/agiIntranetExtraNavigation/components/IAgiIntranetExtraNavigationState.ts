import { IExtraNavigationItem } from "../models/IExtraNavigationItem";

export interface IAgiIntranetExtraNavigationState {
   extraNavigationItems : IExtraNavigationItem[];
   currentSitePagesNavArr: [];
   lastNavItem: string;
}