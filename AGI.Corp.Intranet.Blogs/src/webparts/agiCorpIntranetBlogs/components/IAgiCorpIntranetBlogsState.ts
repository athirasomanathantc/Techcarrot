import { IBlogData } from '../Model/IBlogData'
export interface IAgiCorpIntranetBlogsState {
  blogData: IBlogData[];
  filterData: IBlogData[];
  featuredBlogs: IBlogData[];
  filterValuesBusiness: {
    ID: number,
    Title: string
  }[];
  filterValuesFunctions: {
    ID: number,
    Title: string
  }[];
  currentPage: number;
  totalPages: number;
  pageData: IBlogData[];
  pageSize: number;
  isDataLoaded: boolean;
  showBusinessData: boolean;
  selectedOption: {
    ID: number;
  }
}
