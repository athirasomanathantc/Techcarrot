import {IBlogData} from '../Model/IBlogData'
export interface IAgiCorpIntranetBlogsState {
  blogData: IBlogData[];
  filterData:IBlogData[];
  filterValues:{
    ID:number,
    Title:string
  }[];
  currentPage: number;
  totalPages: number;
  pageData:IBlogData[];
  pageSize:number;
  
}
