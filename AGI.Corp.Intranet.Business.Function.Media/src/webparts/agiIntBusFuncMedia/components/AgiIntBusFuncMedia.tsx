import * as React from 'react';
import styles from './AgiIntBusFuncMedia.module.scss';
import { IAgiIntBusFuncMediaProps } from './IAgiIntBusFuncMediaProps';
import { escape } from '@microsoft/sp-lodash-subset';
import { sp } from '@pnp/sp/presets/all';
import { IAgiIntBusFuncMediaState } from './IAgiIntBusFuncMediaState';
import { IContentItem } from '../models/IContentItem';
import { LIST_CONTENT, NULL_CONTENT_ITEM } from '../common/constants';

//require('../css/business.css');

export default class AgiIntBusFuncMedia extends React.Component<IAgiIntBusFuncMediaProps, IAgiIntBusFuncMediaState> {



  constructor(props: IAgiIntBusFuncMediaProps) {
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
    sp.web.lists.getByTitle(currentListName).items.select('*, Title, SitePages/Title, SitePages/Id, SitePages/NavigationComponent').expand("SitePages").filter(tempProgramme).get().then((items: IContentItem[]) => {
      this.setState({
        contentItems: items,
        programID: catVal
      }, () => {
        this.fnInitiate();
      });
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

  private fnInitiate() {
    let mediaItems = document.querySelectorAll(".media-carousel .carousel-item");

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

  private fnOpenPropertyPabe()
  {
    this.context.propertyPane.open();
  }
  private renderCarouselSection(): JSX.Element {

    const carouselItem = this.state.contentItems;
    if (!carouselItem) {
      return;
    }

    return (
      <section className="section media-section">
        <div className="container">
          <div className="row">
            <div className="col-8 col-lg-11 text-let text-lg-center">
              <h3 className="section-title">Media</h3>

            </div>
            <div className="align-self-end col-4 col-lg-1">
              <div className="button-container">
                <button className="carousel-control-prev" type="button" data-bs-target="#mediaCarousel"
                  data-bs-slide="prev">
                  <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                  <span className="visually-hidden">Previous</span>
                </button>
                <button className="carousel-control-next" type="button" data-bs-target="#mediaCarousel"
                  data-bs-slide="next">
                  <span className="carousel-control-next-icon" aria-hidden="true"></span>
                  <span className="visually-hidden">Next</span>
                </button>
              </div>
            </div>
            <div id="mediaCarousel" className="carousel slide container media-carousel mt-5"
              data-bs-ride="carousel">
              <div className="carousel-inner w-100">
                {
                  this.state.contentItems.map((items, i) => {
                    const imgVal = this.getImageUrl(items.MediaIcon);
                    const tempNav = `${this.props.siteUrl}/SitePages/${items.SitePages.NavigationComponent}?program=${this.state.lastNavItem}&programId=${this.state.programID}`;
                    // const finalNavUrl = {tempNav}`?program=Function&programId=2`
                    return (
                      <div className={i == 0 ? "carousel-item active" : "carousel-item"}>
                        <div className="col-md-3 m-2 ">
                          <div className="card  d-flex align-items-stretch">
                            <img className="w-100" src={imgVal} />
                          </div>
                          <div className="card-body  d-flex flex-column">
                            <h4 className="card-title">{items.Title}</h4>
                            <p className="card-description" dangerouslySetInnerHTML={{ __html: items.Description }}></p>
                            <a href={tempNav} className="btn news-read-more  align-self-center">{items.NavigationText}</a>
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
    );
  }

  public render(): React.ReactElement<IAgiIntBusFuncMediaProps> {
    return (
      <div className={styles.agiIntBusFuncMedia}>

        {/* {this.renderCarouselSection()} */}
        {this.props.listName && this.props.listName ?

          <section className="section media-section">
            <div className="container">
              <div className="row">
                <div className="col-8 col-lg-11 text-let text-lg-center">
                  <h3 className="section-title">{this.props.listName}</h3>

                </div>
                <div className="align-self-end col-4 col-lg-1">
                  <div className="button-container">
                    <button className="carousel-control-prev" type="button" data-bs-target="#mediaCarousel"
                      data-bs-slide="prev">
                      <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                      <span className="visually-hidden">Previous</span>
                    </button>
                    <button className="carousel-control-next" type="button" data-bs-target="#mediaCarousel"
                      data-bs-slide="next">
                      <span className="carousel-control-next-icon" aria-hidden="true"></span>
                      <span className="visually-hidden">Next</span>
                    </button>
                  </div>
                </div>
                <div id="mediaCarousel" className="carousel slide container media-carousel mt-5"
                  data-bs-ride="carousel">
                  <div className="carousel-inner w-100">
                    {
                      this.state.contentItems.map((items, i) => {
                        const imgVal = this.getImageUrl(items.MediaIcon);
                        const tempNav = `${this.props.siteUrl}/SitePages/${items.SitePages.NavigationComponent}?program=${this.state.lastNavItem}&programId=${this.state.programID}`;
                        // const finalNavUrl = {tempNav}`?program=Function&programId=2`
                        return (
                          <div className={i == 0 ? "carousel-item active" : "carousel-item"}>
                            <div className="col-md-3 m-2 ">
                              <div className="card  d-flex align-items-stretch">
                                <img className="w-100" src={imgVal} />
                              </div>
                              <div className="card-body  d-flex flex-column">
                                <h4 className="card-title">{items.Title}</h4>
                                <p className="card-description" dangerouslySetInnerHTML={{ __html: items.Description }}></p>
                                <a href={tempNav} className="btn news-read-more  align-self-center">{items.NavigationText}</a>
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
