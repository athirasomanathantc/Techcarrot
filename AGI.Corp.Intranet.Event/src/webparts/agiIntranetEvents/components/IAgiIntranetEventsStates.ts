import { IEventData } from '../Model/IEventData';
export interface IAgiIntranetEventsStates {
  eventsData: IEventData[];
  currentPage: number;
  totalPage: number;
  pageSize: number;
  pageData: IEventData[];
  filterValuesBusiness: {
    ID: number;
    Title: string;
  }[];
  filterValuesFunctions: {
    ID: number;
    Title: string;
  }[];
  selectedFilter: number;
  selectedTabValues: IEventData[];
  selectedTab: string;
  filterData: IEventData[];
  upcomingEvents: IEventData[];
  pastEvents: IEventData[];
  showBusinessData: boolean;
  selectedOption: {
    ID: number;
  };
  guid: string;
}
