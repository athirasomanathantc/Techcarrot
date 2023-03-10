import { ICarouselItem } from "../models/ICarouselItem";


export interface IAgiCorpIntranetCarouselState {
   carouselItems: ICarouselItem[];
   lastNavItem: string;
   programID: string;
   moveCarousel: boolean;
}