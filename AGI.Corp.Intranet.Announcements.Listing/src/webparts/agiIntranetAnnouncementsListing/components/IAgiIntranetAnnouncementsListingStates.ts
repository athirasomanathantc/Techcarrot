import { IAnnouncementData } from "../models/IAnnouncementData";
export interface IAgiIntranetEventsStates {
    totalAnnouncementData: IAnnouncementData[];
    exceptionOccured: boolean;
    currentPage: number;
    totalPage: number;
    currentPageAnnouncementData:IAnnouncementData[];
}