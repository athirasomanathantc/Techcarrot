import * as React from 'react';
import styles from './AgiIntBusFuncBanner.module.scss';
import { IAgiIntBusFuncBannerProps } from './IAgiIntBusFuncBannerProps';
import { escape } from '@microsoft/sp-lodash-subset';
import { sp } from '@pnp/sp/presets/all';
import { IAgiIntBusFuncBannerState } from './IAgiIntBusFuncBannerState';
import { IContentItem } from '../models/IContentItem';
import { LIST_CONTENT, NULL_CONTENT_ITEM } from '../common/constants';

//require('../css/business.css');

export default class AgiIntBusFuncBanner extends React.Component<IAgiIntBusFuncBannerProps, IAgiIntBusFuncBannerState> {



  constructor(props: IAgiIntBusFuncBannerProps) {
    super(props);
    sp.setup({
      spfxContext: this.props.context
    });
    this.state = {
      contentItems: [],
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
    const tempProgramme = `${this.state.lastNavItem}Id eq ${catVal}`;
    const currentListName = this.props.listName;
    sp.web.lists.getByTitle(currentListName).items.filter(tempProgramme).get().then((items: IContentItem[]) => {
      this.setState({
        contentItems: items,
        programID: catVal
      }, () => {
        // this.fnInitiate();
      });
    });
  }

  private fnInitiate() {
    let mediaItems = document.querySelectorAll(".leadership-carousel .carousel-item");

    mediaItems.forEach((el) => {
      const minPerSlide = 4;
      let mediaNext = el.nextElementSibling;
      for (var i = 1; i < minPerSlide; i++) {
        if (!mediaNext) {
          // wrap carousel by using first child
          mediaNext = mediaItems[0];
        }
        let cloneChild: any = mediaNext.cloneNode(true);
        el.appendChild(cloneChild.children[0]);
        mediaNext = mediaNext.nextElementSibling;
      }
    });
  }

  private getImageUrl(imageContent: string): string {
    if (!imageContent) {
      return;
    }

    const imageObj: any = JSON.parse(imageContent);
    return imageObj.serverUrl + imageObj.serverRelativeUrl;
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

  public render(): React.ReactElement<IAgiIntBusFuncBannerProps> {
    return (
      <div className={styles.agiIntBusFuncBanner}>
        {this.props.listName && this.props.listName.length > 0

          ?

            this.state.contentItems.map((items, i) => {
              const imgVal = this.getImageUrl(items.BannerImage);
              return (
                <section className="section banner-section ">
                  <img src={imgVal} className="banner-bg" />
                  <div className="container">
                    <div className="row">
                      <div className="col-6 col-lg-4 banner-text-wrapper ">
                        <p dangerouslySetInnerHTML={{__html:items.Description}}></p>
                      </div>
                    </div>
                  </div>
                </section>
              )
            })
          
          :

          <div>
            <div className='propertiesWarning'>Please configure list name</div>
          </div>
        }

      </div>
    );
  }
}
