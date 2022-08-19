import { IEventData }from '../Model/IEventData';
export interface IAgiIntranetEventsStates {  
  eventsData:IEventData[];
  currentPage:number;
  totalPage:number;
  pageData:IEventData[];
  filterValues:{
    ID:number;
    Title:string;
  }[];
  selectedFilter:number;
  selectedTabValues:IEventData[];
  selectedTab:string;
  filterData:IEventData[];
  ongoingEvents:IEventData[];
  upcomingEvents:IEventData[];
  pastEvents:IEventData[];
}
