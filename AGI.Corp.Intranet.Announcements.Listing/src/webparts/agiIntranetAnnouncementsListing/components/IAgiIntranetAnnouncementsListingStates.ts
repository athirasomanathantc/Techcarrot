import { IAnnouncementData } from "../models/IAnnouncementData";
import { IBusinessData } from "../models/IBusinessData";
export interface IAgiIntranetEventsStates {
    totalAnnouncementData: IAnnouncementData[];
    filteredAnnouncementData: IAnnouncementData[];
    exceptionOccured: boolean;
    currentPage: number;
    totalPage: number;
    currentPageAnnouncementData:IAnnouncementData[];
    businessData:IBusinessData[],
    filterValues:{
        ID:number;
        Title:string;
      }[];
}