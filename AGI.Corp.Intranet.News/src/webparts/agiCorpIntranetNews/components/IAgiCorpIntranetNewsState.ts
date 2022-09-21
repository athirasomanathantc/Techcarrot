import { INewsData } from '../Model/INewsData';
export interface IAgiCorpIntranetNewsState {
  newsData: INewsData[];
  filterData: INewsData[];
  filterValuesBusiness: {
    ID: number;
    Title: string;
  }[];
  filterValuesFunctions: {
    ID: number,
    Title: string
  }[];
  currentPage: number;
  totalPages: number;
  pageData: INewsData[];
  pageSize: number;
  showBusinessData: boolean;
  selectedOption: {
    ID: number;
  }
}
