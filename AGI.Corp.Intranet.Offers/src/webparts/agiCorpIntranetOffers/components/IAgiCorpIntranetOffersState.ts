import { IOfferData} from '../Model/IOffers'
export interface IAgiCorpIntranetOffersState {
  offerData: IOfferData[];
  filterData:IOfferData[];
  filterValues:{
    ID:number,
    Title:string
  }[];
  currentPage: number;
  totalPages: number;
  pageData:IOfferData[];
  pageSize:number;
}
