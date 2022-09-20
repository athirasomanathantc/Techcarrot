import { IOfferData } from '../Model/IOffers'
export interface IAgiCorpIntranetOffersState {
  offerData: IOfferData[];
  filterData: IOfferData[];
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
  pageData: IOfferData[];
  pageSize: number;
  showBusinessData: boolean;
  selectedOption: {
    ID: number;
  }
}
