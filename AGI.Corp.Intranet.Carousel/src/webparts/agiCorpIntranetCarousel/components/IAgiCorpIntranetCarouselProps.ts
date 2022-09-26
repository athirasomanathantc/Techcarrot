import { SPHttpClient } from '@microsoft/sp-http';
import { IAgiCorpIntranetCarouselWebPartProps } from '../AgiCorpIntranetCarouselWebPart';

export interface IAgiCorpIntranetCarouselProps extends IAgiCorpIntranetCarouselWebPartProps {
    siteUrl: string;
    context: any;
    spHttpClient: SPHttpClient;
    listName: string;
}
