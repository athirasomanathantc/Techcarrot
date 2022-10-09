import * as React from 'react';
import styles from './AgiIntBusFuncService.module.scss';
import { IAgiIntBusFuncServiceProps } from './IAgiIntBusFuncServiceProps';
import { escape } from '@microsoft/sp-lodash-subset';
import { sp } from '@pnp/sp/presets/all';
import { IAgiIntBusFuncServiceState } from './IAgiIntBusFuncServiceState';
import { IContentItem } from '../models/IContentItem';
import { LIST_CONTENT, NULL_CONTENT_ITEM } from '../common/constants';

//require('../css/business.css');

export default class AgiIntBusFuncService extends React.Component<IAgiIntBusFuncServiceProps, IAgiIntBusFuncServiceState> {



  constructor(props: IAgiIntBusFuncServiceProps) {
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
    debugger;
    const catVal = this.getQueryStringValue('categoryId');
    const tempProgramme = `${this.state.lastNavItem}Id eq ${catVal}`;
    const currentListName = this.props.listName;
    sp.web.lists.getByTitle(currentListName).items.filter(tempProgramme).get().then((items: IContentItem[]) => {
      this.setState({
        contentItems: items,
        programID: catVal
      }, () => {
        this.fnInitiate();
      });
    });
  }

  private fnInitiate() {debugger;
    let serviceItems = document.querySelectorAll(".our-service-carousel .carousel-item");

    serviceItems.forEach((el) => {
      const minPerSlide = 4;
      let serviceNext = el.nextElementSibling;
      for (var i = 1; i < minPerSlide; i++) {
        if (!serviceNext) {
          // wrap carousel by using first child
          serviceNext = serviceItems[0];
        }
        let cloneChild: any = serviceNext.cloneNode(true);
        el.appendChild(cloneChild.children[0]);
        serviceNext = serviceNext.nextElementSibling;
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

  public render(): React.ReactElement<IAgiIntBusFuncServiceProps> {
    return (
      <div className={styles.agiIntBusFuncService}>
        {this.props.listName && this.props.listName.length > 0

          ?

          <section className="section our-services" style={{ display: this.state.contentItems.length > 0 ? 'block' : 'none' }}>
            <div className="container">
              <div className="row">
                <div className="col-8 col-lg-11 text-let text-lg-center">
                  <h3 className="section-title">{this.props.listName}</h3>

                </div>
                <div className="align-self-end col-4 col-lg-1">
                  <div className="button-container">
                    <button className="carousel-control-prev" type="button" data-bs-target="#ourServiceCarousel"
                      data-bs-slide="prev">
                      <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                      <span className="visually-hidden">Previous</span>
                    </button>
                    <button className="carousel-control-next" type="button" data-bs-target="#ourServiceCarousel"
                      data-bs-slide="next">
                      <span className="carousel-control-next-icon" aria-hidden="true"></span>
                      <span className="visually-hidden">Next</span>
                    </button>
                  </div>
                </div>
                <div id="ourServiceCarousel" className="carousel slide container our-service-carousel mt-5"
                  data-bs-ride="carousel">
                  <div className="carousel-inner w-100">
                    {
                      this.state.contentItems.map((items, i) => {
                        const catVal = this.getQueryStringValue('categoryId');
                        const navURL = `${this.props.siteUrl}/SitePages/Articles.aspx?progName=${this.state.lastNavItem}&progId=${catVal}`;//items.NavigationUrl.Url;
                        const imgVal = this.getImageUrl(items.ServiceIcon);
                        return (
                          <div className={i == 0 ? "carousel-item active" : "carousel-item"}>
                            <div className="col-md-3 m-2">
                              <div className="card  our-services">
                                <img className="w-100" src={imgVal} />
                                <div className="card-body">
                                  <h4 className="card-title">{items.Title}</h4>
                                  <p className="card-description mb-4" dangerouslySetInnerHTML={{ __html: items.Description }}></p>
                                  <a href={navURL} className="btn news-read-more mt-auto align-self-end">{items.NavigationText}</a>
                                </div>
                              </div>
                            </div>
                          </div>
                        )

                      })
                    }
                  </div>

                </div>
              </div>
            </div>

          </section>

          :

          <div>
            <div className='propertiesWarning'>Please configure list name</div>
          </div>
        }

      </div>
    );
  }
}
