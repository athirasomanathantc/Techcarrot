import * as React from 'react';
import styles from './AgiCorpIntranetCarousel.module.scss';
import { IAgiCorpIntranetCarouselProps } from './IAgiCorpIntranetCarouselProps';
import SPService from "../services/spservice";
import { escape } from '@microsoft/sp-lodash-subset';
import { sp } from '@pnp/sp/presets/all';
import { IAgiCorpIntranetCarouselState } from './IAgiCorpIntranetCarouselState';
import { ICarouselItem } from '../models/ICarouselItem';
import { LIST_CAROUSEL, NULL_CAROUSEL_ITEM } from '../common/constants';

export default class AgiCorpIntranetCarousel extends React.Component<IAgiCorpIntranetCarouselProps, IAgiCorpIntranetCarouselState> {



  constructor(props: IAgiCorpIntranetCarouselProps) {
    super(props);
    sp.setup({
      spfxContext: this.props.context
    });
    this.state = {
      carouselItems: []
    }
  }

  public async componentDidMount(): Promise<void> {
    this.getCarouselItem();
  }

  private async getCarouselItem(): Promise<void> {

    // sp.web.lists.getByTitle(LIST_CAROUSEL).items.get().then((items: ICarouselItem[]) => {
    //   const CarouselItem = items && items.length > 0 ? items[0] : NULL_CAROUSEL_ITEM;
    //   this.setState({
    //     carouselItems: items
    //   });
    // });
    debugger;
    const url = `${this.props.siteUrl}/_api/web/lists/getbytitle('Carousel')/items?select=*,AttachmentFiles,Title&$expand=AttachmentFiles&$expand=AttachmentFiles`
    SPService.getItemsByRestApi(url, this.props.spHttpClient).then((data) => {
      //debugger; 
      const carouselItems: ICarouselItem[] = data;
      this.setState({
        carouselItems
      });
    })
  }

  private getImageUrl(imageContent: string): string {
    if (!imageContent) {
      return;
    }

    const imageObj: any = JSON.parse(imageContent);
    return imageObj.serverUrl + imageObj.serverRelativeUrl;
  }

  private renderCarouselSection(): JSX.Element {

    const carouselItem = this.state.carouselItems;
    if (!carouselItem) {
      return;
    }

    //const curDescriptionVal = this.props.description;


    return (
      <div className="business-page-header">
        <div className="banner-container">
          <div id="businessBannerCarousel" className="carousel slide" data-bs-ride="carousel">
            <div className="carousel-inner">
              {
                this.state.carouselItems.map((item, i) => {
                  const videoType = item.ImageorVideo;
                  if (videoType === 'Image') {debugger;
                    const imageUrl = item && item.AttachmentFiles[0].ServerRelativeUrl ? this.getImageUrl(item.AttachmentFiles[0].ServerRelativeUrl) : '';
                    <div className={i == 0 ? "carousel-item active" : "carousel-item"}>
                      <img src={imageUrl} className="d-block w-100" alt="..." />
                      <div className="carousel-caption ">
                        <h2>Al Ghurair Properties</h2>
                        <p>Lorem Ipsum Dolor Sit Amet, Consectetur Adipiscing Elit</p>
                      </div>
                    </div>
                  }
                  else if (videoType === 'Video') {
                    if(item.AttachmentFiles.ServerRelativeUrl.length){
                      
                    }
                    const relativeUrl = item && item.AttachmentFiles[0].ServerRelativeUrl ? this.getImageUrl(item.AttachmentFiles[0].ServerRelativeUrl) : '';
                    
                    var string = "foo";
                    var substring = "oo";
                    
                    console.log(string.indexOf(substring) !== -1);

                    <div className={i == 0 ? "carousel-item active" : "carousel-item"}>
                      <div className="videoWrapper">
                        {/* <video className="video1" loop controls autoPlay muted poster={thumbnailUrl}>
                          <source src={videoUrl} type="video/mp4" />
                          Your browser does not support the video tag.
                        </video> */}
                      </div>
                    </div>
                  }

                })
              }
            </div>
            <button className="carousel-control-prev" type="button" data-bs-target="#businessBannerCarousel" data-bs-slide="prev">
              <span className="carousel-control-prev-icon" aria-hidden="true"></span>
              <span className="visually-hidden">Previous</span>
            </button>
            <button className="carousel-control-next" type="button" data-bs-target="#businessBannerCarousel" data-bs-slide="next">
              <span className="carousel-control-next-icon" aria-hidden="true"></span>
              <span className="visually-hidden">Next</span>
            </button>
          </div>
        </div>
      </div>

    )
  }

  public render(): React.ReactElement<IAgiCorpIntranetCarouselProps> {
    return (
      <div className={styles.agiCorpIntranetCarousel}>
        {this.renderCarouselSection()}
      </div>
    );
  }
}
