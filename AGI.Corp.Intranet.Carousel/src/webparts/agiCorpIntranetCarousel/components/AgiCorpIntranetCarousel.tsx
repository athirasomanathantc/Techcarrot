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
      carouselItems: [],
      lastNavItem: '',
      programID: ''
    }
  }

  public async componentDidMount(): Promise<void> {
    await this.getCurrentNavInfo();
    await this.getCarouselItem();
  }

  private async getCarouselItem(): Promise<void> {
    const catVal = this.getQueryStringValue('categoryId');
    const currentListName = this.props.listName;
    let filter = '';
    if (!catVal.length) {
      filter = `OtherPage eq '${this.props.page}'`;
    }
    else {
      filter = `${this.state.lastNavItem}Id eq ${catVal}`;
    }
    sp.web.lists.getByTitle(currentListName).items.select('*, AttachmentFiles').expand("AttachmentFiles").filter(filter).get().then((items: ICarouselItem[]) => {
      this.setState({
        carouselItems: items,
        programID: catVal
      });
    })
  }

  private getQueryStringValue(param: string): string {
    const params = new URLSearchParams(window.location.search);
    let value = params.get(param) || '';
    return value;
  }

  private getCurrentNavInfo() {
    try {
      const currentWindowUrl = window.location.href;
      const currentSitePages = currentWindowUrl.split("SitePages");
      const currentSitePagesNav: any = currentSitePages[1].split("/");

      const currentArray: any = [];
      let i: any;
      for (i = 0; i < currentSitePagesNav.length; i++) {
        const isLastPage = currentSitePagesNav[i].includes(".aspx");
        if (isLastPage == true) {
          var newItem = currentSitePagesNav[i].split(".aspx")[0];
          var re = /%20/gi
          const tempItem = newItem.replace(re, " ");
          this.setState({
            lastNavItem: tempItem
          })
        }
      }
    }
    catch (e) {
      console.log(e);
    }
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

                  if (videoType === 'Image') {
                    const imageUrl = item && item.AttachmentFiles[0]?.ServerRelativeUrl ? item.AttachmentFiles[0]?.ServerRelativeUrl : '';
                    return (
                      <div className={i == 0 ? "carousel-item active" : "carousel-item"}>
                        {imageUrl.length > 0 && <img src={imageUrl} className="d-block w-100" alt="..." />}
                        <div className="carousel-caption ">
                          <h2>{item.Title}</h2>
                          <p>{item.SubTitle}</p>
                        </div>
                      </div>
                    )
                  }
                  else if (videoType === 'Video') {
                    const videoUrl = item && item.AttachmentFiles[0]?.ServerRelativeUrl ? item.AttachmentFiles[0]?.ServerRelativeUrl : '';
                    const thumbnailUrl = item && item.VideoThumbnail ? this.getImageUrl(item.VideoThumbnail) : '';
                    return (
                      <div className={i == 0 ? "carousel-item active" : "carousel-item"}>
                        <div className="videoWrapper">
                          <video className="video1" loop controls autoPlay muted poster={thumbnailUrl}>
                            <source src={videoUrl} type="video/mp4" />
                            Your browser does not support the video tag.
                          </video>
                        </div>
                      </div>
                    )
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
