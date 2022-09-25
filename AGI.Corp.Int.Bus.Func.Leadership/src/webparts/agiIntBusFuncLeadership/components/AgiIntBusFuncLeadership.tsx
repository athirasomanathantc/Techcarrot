import * as React from 'react';
import styles from './AgiIntBusFuncLeadership.module.scss';
import { IAgiIntBusFuncLeadershipProps } from './IAgiIntBusFuncLeadershipProps';
import { escape } from '@microsoft/sp-lodash-subset';
import { sp } from '@pnp/sp/presets/all';
import { IAgiIntBusFuncLeadershipState } from './IAgiIntBusFuncLeadershipState';
import { IContentItem } from '../models/IContentItem';
import { LIST_CONTENT, NULL_CONTENT_ITEM } from '../common/constants';

//require('../css/business.css');

export default class AgiIntBusFuncLeadership extends React.Component<IAgiIntBusFuncLeadershipProps, IAgiIntBusFuncLeadershipState> {



  constructor(props: IAgiIntBusFuncLeadershipProps) {
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

  private renderCarouselSection(): JSX.Element {

    const carouselItem = this.state.contentItems;
    if (!carouselItem) {
      return;
    }

    return (
      <section className="section business-leadership-section">
        <div className="container">
          <div className="row">
            <div className="col-8 col-lg-11 text-let text-lg-center">
              <h3 className="leadership-team-heading">{this.props.listName}</h3>

            </div>
            <div className="align-self-end col-4 col-lg-1">
              <div className="button-container">
                <button className="carousel-control-prev" type="button" data-bs-target="#leadershipCarousel"
                  data-bs-slide="prev">
                  <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                  <span className="visually-hidden">Previous</span>
                </button>
                <button className="carousel-control-next" type="button" data-bs-target="#leadershipCarousel"
                  data-bs-slide="next">
                  <span className="carousel-control-next-icon" aria-hidden="true"></span>
                  <span className="visually-hidden">Next</span>
                </button>
              </div>
            </div>
          </div>

          <div id="leadershipCarousel" className="carousel js-carousel slide leadership-carousel"
            data-bs-ride="carousel">


            <div className="carousel-inner" role="listbox">
              {
                this.state.contentItems.map((items, i) => {
                  const imgVal = this.getImageUrl(items.UserImage);
                  return (
                    <div className={i == 0 ? "carousel-item js-carousel-item active" : "carousel-item js-carousel-item"}>
                      <div className="col-md-3">
                        <div className="team-card h-100">
                          <div className="team-img">
                            <img src={imgVal} alt="Card Design" className="w-100" />
                          </div>
                          <div className="team-content mt-3  ">
                            <div className="profile d-flex justify-content-between">
                              <h2 className="team-title">{items.Title}</h2>
                              <svg xmlns="http://www.w3.org/2000/svg" width="27.47" height="27.47"
                                viewBox="0 0 27.47 27.47">
                                <path id="linkedin_1_" data-name="linkedin (1)"
                                  d="M24.985,0H2.485A2.485,2.485,0,0,0,0,2.485v22.5A2.485,2.485,0,0,0,2.485,27.47h22.5a2.485,2.485,0,0,0,2.485-2.485V2.485A2.485,2.485,0,0,0,24.985,0ZM8.5,23.719a.723.723,0,0,1-.723.723H4.7a.723.723,0,0,1-.723-.723v-12.9a.723.723,0,0,1,.723-.723H7.777a.723.723,0,0,1,.723.723ZM6.238,8.876A2.924,2.924,0,1,1,9.162,5.952,2.924,2.924,0,0,1,6.238,8.876Zm18.349,14.9a.665.665,0,0,1-.665.665h-3.3a.665.665,0,0,1-.665-.665V17.725c0-.9.265-3.957-2.36-3.957-2.036,0-2.449,2.09-2.532,3.028v6.981a.665.665,0,0,1-.665.665H11.2a.665.665,0,0,1-.665-.665V10.757a.665.665,0,0,1,.665-.665H14.4a.665.665,0,0,1,.665.665v1.126c.755-1.133,1.877-2.007,4.265-2.007,5.289,0,5.259,4.941,5.259,7.656v6.245Z"
                                  fill="#0077b7" />
                              </svg>
                            </div>
                            <h3 className="team-subtitle">{items.Designation}, {items.Company}</h3>
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
      </section>

    );
  }

  public render(): React.ReactElement<IAgiIntBusFuncLeadershipProps> {
    return (
      <div className={styles.agiIntBusFuncLeadership}>
        {this.props.listName && this.props.listName.length > 0

          ?

          <section className="section business-leadership-section">
            <div className="container">
              <div className="row">
                <div className="col-8 col-lg-11 text-let text-lg-center">
                  <h3 className="leadership-team-heading">{this.props.listName}</h3>

                </div>
                <div className="align-self-end col-4 col-lg-1">
                  <div className="button-container">
                    <button className="carousel-control-prev" type="button" data-bs-target="#leadershipCarousel"
                      data-bs-slide="prev">
                      <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                      <span className="visually-hidden">Previous</span>
                    </button>
                    <button className="carousel-control-next" type="button" data-bs-target="#leadershipCarousel"
                      data-bs-slide="next">
                      <span className="carousel-control-next-icon" aria-hidden="true"></span>
                      <span className="visually-hidden">Next</span>
                    </button>
                  </div>
                </div>
              </div>

              <div id="leadershipCarousel" className="carousel js-carousel slide leadership-carousel"
                data-bs-ride="carousel">


                <div className="carousel-inner" role="listbox">
                  {
                    this.state.contentItems.map((items, i) => {
                      const imgVal = this.getImageUrl(items.UserImage);
                      return (
                        <div className={i == 0 ? "carousel-item js-carousel-item active" : "carousel-item js-carousel-item"}>
                          <div className="col-md-3">
                            <div className="team-card h-100">
                              <div className="team-img">
                                <img src={imgVal} alt="Card Design" className="w-100" />
                              </div>
                              <div className="team-content mt-3  ">
                                <div className="profile d-flex justify-content-between">
                                  <h2 className="team-title">{items.Title}</h2>
                                  <a href={items.LinkedInUrl.Url} target='_blank' data-interception="off">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="27.47" height="27.47"
                                      viewBox="0 0 27.47 27.47">
                                      <path id="linkedin_1_" data-name="linkedin (1)"
                                        d="M24.985,0H2.485A2.485,2.485,0,0,0,0,2.485v22.5A2.485,2.485,0,0,0,2.485,27.47h22.5a2.485,2.485,0,0,0,2.485-2.485V2.485A2.485,2.485,0,0,0,24.985,0ZM8.5,23.719a.723.723,0,0,1-.723.723H4.7a.723.723,0,0,1-.723-.723v-12.9a.723.723,0,0,1,.723-.723H7.777a.723.723,0,0,1,.723.723ZM6.238,8.876A2.924,2.924,0,1,1,9.162,5.952,2.924,2.924,0,0,1,6.238,8.876Zm18.349,14.9a.665.665,0,0,1-.665.665h-3.3a.665.665,0,0,1-.665-.665V17.725c0-.9.265-3.957-2.36-3.957-2.036,0-2.449,2.09-2.532,3.028v6.981a.665.665,0,0,1-.665.665H11.2a.665.665,0,0,1-.665-.665V10.757a.665.665,0,0,1,.665-.665H14.4a.665.665,0,0,1,.665.665v1.126c.755-1.133,1.877-2.007,4.265-2.007,5.289,0,5.259,4.941,5.259,7.656v6.245Z"
                                        fill="#0077b7" />
                                    </svg>
                                  </a>
                                </div>
                                <h3 className="team-subtitle">{items.Designation}, {items.Company}</h3>
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