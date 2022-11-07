import {IBanner} from '../Models/IBanner'
import { IContent } from '../Models/IContent';
export interface IAgiCorpIntranemInterimState {
  
  banner:IBanner[];
  content:IContent[],
  moveCarousel:boolean;
  title:string;
}
