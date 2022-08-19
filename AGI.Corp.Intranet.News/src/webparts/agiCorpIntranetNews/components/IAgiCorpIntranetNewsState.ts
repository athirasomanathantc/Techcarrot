import { INewsData }from '../Model/INewsData';
export interface IAgiCorpIntranetNewsState {
  newsData: INewsData[];
  filterData:INewsData[];
  filterValues:{
    ID:number;
    Title:string;
  }[];
  currentPage: number;
  totalPages: number;
  pageData:INewsData[];
  
}
