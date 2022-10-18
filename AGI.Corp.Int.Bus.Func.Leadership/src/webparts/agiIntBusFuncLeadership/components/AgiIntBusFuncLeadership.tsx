import * as React from 'react';
import styles from './AgiIntBusFuncLeadership.module.scss';
import { IAgiIntBusFuncLeadershipProps } from './IAgiIntBusFuncLeadershipProps';
import { escape } from '@microsoft/sp-lodash-subset';
import { sp } from '@pnp/sp/presets/all';
import { IAgiIntBusFuncLeadershipState } from './IAgiIntBusFuncLeadershipState';
import { IContentItem } from '../models/IContentItem';
import { LIST_CONTENT, NULL_CONTENT_ITEM } from '../common/constants';
import * as $ from 'jquery';
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
      programID: '',
      showModal: false,
      selectedItem: null
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
        this.fnInitiate();
        this.renderScripts();
      });
    });
  }

  private renderScripts(): void {
    const reacthandler = this;
    $(document).on('click', '.cardItem', function () {
      debugger;
      const element = $(this);
      const id = element.attr('data-id');
      // get leader details
      const selectedItem = reacthandler.state.contentItems.filter((item: any) => item.ID == id)[0];
      reacthandler.setState({
        selectedItem,
        showModal: true
      });
    })
  }

  private fnInitiate() {
    // let mediaItems = document.querySelectorAll(".leadership-carousel .carousel-item");

    // mediaItems.forEach((el) => {
    //   const minPerSlide = 4;
    //   let mediaNext = el.nextElementSibling;
    //   for (var i = 1; i < minPerSlide; i++) {
    //     if (!mediaNext) {
    //       // wrap carousel by using first child
    //       mediaNext = mediaItems[0];
    //     }
    //     let cloneChild: any = mediaNext.cloneNode(true);
    //     el.appendChild(cloneChild.children[0]);
    //     mediaNext = mediaNext.nextElementSibling;
    //   }
    // });

    var ourServiceCardCarousel = document.querySelector(
      "#leadershipCarousel"
    );
    if (window.matchMedia("(min-width: 768px)").matches) {
      // var carousel = new bootstrap.Carousel(ourServiceCardCarousel, {
      //   interval: false,
      // });
      ourServiceCardCarousel.addEventListener('slide.bs.carousel', function () {

        interval: false
      });
      var carouselWidth = $(".business-leadership-section .carousel-inner")[0].scrollWidth;
      var cardWidth = $(".business-leadership-section  .carousel-item").width();
      var scrollPosition = 0;
      $(".business-leadership-control-next").click(function () {

        if (scrollPosition < carouselWidth - cardWidth * 4) {
          scrollPosition += cardWidth;
          $("#leadershipCarousel .carousel-inner").animate(
            { scrollLeft: scrollPosition },
            600
          );
        }
      });
      $(".business-leadership-control-prev").on("click", function () {
        if (scrollPosition > 0) {
          scrollPosition -= cardWidth;
          $("#leadershipCarousel .carousel-inner").animate(
            { scrollLeft: scrollPosition },
            600
          );
        }
      });
    } else {
      $(ourServiceCardCarousel).addClass("slide");
    }
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


  private showLeaderDetail(e: React.MouseEvent<HTMLInputElement, MouseEvent>, id: number) {
    e.preventDefault();
    const selectedItem = this.state.contentItems.filter(item => item.ID == id)[0];
    this.setState({
      selectedItem,
      showModal: true
    });
  }

  private closeLeaderModal() {
    this.setState({
      showModal: false
    });
  }

  public render(): React.ReactElement<IAgiIntBusFuncLeadershipProps> {
    const { selectedItem } = this.state;
    const leadershipImgVal = this.getImageUrl(selectedItem?.UserImage);

    return (
      <div className={styles.agiIntBusFuncLeadership}>
        {this.props.listName && this.props.listName.length > 0

          ?

          <section className="section business-leadership-section" style={{ display: this.state.contentItems.length > 0 ? 'block' : 'none' }}>
            <div className="container">
              <div className="row">
                <div className="col-8 col-lg-10 text-let text-lg-center">
                  <h3 className="leadership-team-heading">{this.props.listName}</h3>

                </div>
                <div className="align-self-end col-4 col-lg-2">
                  <div className="button-container">
                    <button className="carousel-control-prev business-leadership-control-prev" type="button" data-bs-target="#leadershipCarousel"
                      data-bs-slide="prev">
                      <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                      <span className="visually-hidden">Previous</span>
                    </button>
                    <button className="carousel-control-next business-leadership-control-next" type="button" data-bs-target="#leadershipCarousel"
                      data-bs-slide="next">
                      <span className="carousel-control-next-icon" aria-hidden="true"></span>
                      <span className="visually-hidden">Next</span>
                    </button>
                  </div>
                </div>
              </div>

              <div id="leadershipCarousel" className="carousel js-carousel leadership-carousel"
                data-bs-ride="carousel" data-bs-interval="false" data-bs-wrap="false">
                <div className="carousel-inner" role="listbox">
                  {
                    this.state.contentItems.map((items, i) => {
                      const imgVal = this.getImageUrl(items.UserImage);
                      return (
                        <div className={i == 0 ? "carousel-item js-carousel-item active" : "carousel-item js-carousel-item"} key={`leadershipcarousel${i}`}>
                          <div className="col-md-3 h-100">
                            <div className="team-card cardItem h-100 business-leadership-section" data-id={items.ID} >
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
                                <input type="button" className="view-profile" onClick={(e: React.MouseEvent<HTMLInputElement, MouseEvent>) => this.showLeaderDetail(e, items.ID)} value='View Profile' />
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

            {selectedItem && this.state.showModal && <div className={this.state.showModal ? "modal show overlay" : "modal fade overlay"} id="viewProfileModal" aria-labelledby="exampleModalLabel"
              aria-hidden="true" style={{ display: this.state.showModal ? 'block' : 'none' }}>
              <div className={this.state.showModal ? "modal show" : "modal fade"} id="viewProfileModal" aria-labelledby="exampleModalLabel" aria-hidden="true" style={{ display: this.state.showModal ? 'block' : 'none' }} >
                <div className="modal-dialog modal-dialog-centered modal-lg">
                  <div className="modal-content">
                    <div className="modal-header">
                      <input type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" onClick={() => this.closeLeaderModal()} />
                    </div>
                    <div className="modal-body">
                      <div className="row profile-wrapper m-0">
                        <div className="profile-img col-lg-4">
                          <img id="leadershipImage" src={leadershipImgVal} className="w-100" />
                          <p className="profile-content text-center mt-3">
                            <b id="leadershipName">{selectedItem.Title}</b> <br />
                            <span id="leadershipDesignation">{selectedItem.Designation}, {selectedItem.Company}</span> <br />
                            <span id="leadershipBusiness">{selectedItem.Business}</span>
                          </p>
                        </div>
                        <div className="view-profile-content col-lg-8" id="leadershipDetail" dangerouslySetInnerHTML={{ __html: selectedItem.About }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>}

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
