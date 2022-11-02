import { IAnnouncementData } from "../models/IAnnouncementData";
import { IBusinessData } from "../models/IBusinessData";
import { IFunctionData } from "../models/IFunctionData";
export interface IAgiIntranetEventsStates {
  totalAnnouncementData: IAnnouncementData[];
  filteredAnnouncementData: IAnnouncementData[];
  featuredAnnouncements: IAnnouncementData[];
  exceptionOccured: boolean;
  currentPage: number;
  totalPage: number;
  currentPageAnnouncementData: IAnnouncementData[];
  businessData: IBusinessData[],
  functionData: IFunctionData[],
  filterValues: {
    ID: number;
    Title: string;
  }[];
  itemsPerPage: number;
  showBusinessData: boolean;
  selectedOption: {
    ID: number;
  }
  featuredTitle: string;
  announcementsTitle:string;
}