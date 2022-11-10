import * as React from 'react';
import styles from './AgiIntBusFuncMedia.module.scss';
import { IAgiIntBusFuncMediaProps } from './IAgiIntBusFuncMediaProps';
import { escape } from '@microsoft/sp-lodash-subset';
import { sp } from '@pnp/sp/presets/all';
import { IAgiIntBusFuncMediaState } from './IAgiIntBusFuncMediaState';
import { IContentItem } from '../models/IContentItem';
import { LIST_CONTENT, NULL_CONTENT_ITEM } from '../common/constants';
import * as $ from 'jquery';
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
      programID: '',
      mediaTitle: ''
    }
  }

  public async componentDidMount(): Promise<void> {

    await this.getCurrentNavInfo();
    await this.getCarouselItem();
    await this.getTitleConfig();
  }

  private async getTitleConfig(): Promise<void> {
    const categoryId = this.getQueryStringValue('categoryId');
    sp.web.lists.getByTitle('TitleConfig').items
      .filter(`(${this.state.lastNavItem}Id eq ${categoryId}) and (Title eq 'Media Title')`)
      .get().then((items: any) => {
        this.setState({
          mediaTitle: items[0]?.Header
        });
      });
  }

  private async getCarouselItem(): Promise<void> {
   // debugger;
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
    // let mediaItems = document.querySelectorAll(".media-carousel .carousel-item");

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
      "#mediaCarousel"
    );
    if (window.matchMedia("(min-width: 768px)").matches) {
      // var carousel = new bootstrap.Carousel(ourServiceCardCarousel, {
      //   interval: false,
      // });
      ourServiceCardCarousel.addEventListener('slide.bs.carousel', function () {

        interval: false
      });
      var carouselWidth = $(".business-media-section .carousel-inner")[0].scrollWidth;
      var cardWidth = $(".business-media-section  .carousel-item").width();
      var scrollPosition = 0;
      $(".media-carousel-control-next").click(function () {

        if (scrollPosition < carouselWidth - cardWidth * 4) {
          scrollPosition += cardWidth;
          $("#mediaCarousel .carousel-inner").animate(
            { scrollLeft: scrollPosition },
            600
          );
        }
      });
      $(".media-carousel-control-prev").on("click", function () {
        if (scrollPosition > 0) {
          scrollPosition -= cardWidth;
          $("#mediaCarousel .carousel-inner").animate(
            { scrollLeft: scrollPosition },
            600
          );
        }
      });
    } else {
      $(ourServiceCardCarousel).addClass("slide");
    }
  }

  private fnOpenPropertyPabe() {
    this.context.propertyPane.open();
  }

  public render(): React.ReactElement<IAgiIntBusFuncMediaProps> {
    return (
      <div className={styles.agiIntBusFuncMedia}>

        {/* {this.renderCarouselSection()} */}
        {this.props.listName && this.props.listName ?

          <section className="section business-media-section" style={{ display: this.state.contentItems.length > 0 ? 'block' : 'none' }}>
            <div className="container">
              <div className="row">
                <div className='title-header'>
                  <div className="text-left text-lg-center">
                    <h3 className="section-title">{this.state.mediaTitle}</h3>

                  </div>
                  <div className="align-self-end media-btn-control">
                    <div className="button-container">
                      <button className="carousel-control-prev media-carousel-control-prev" type="button" data-bs-target="#mediaCarousel"
                        data-bs-slide="prev">
                        <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                        <span className="visually-hidden">Previous</span>
                      </button>
                      <button className="carousel-control-next media-carousel-control-next" type="button" data-bs-target="#mediaCarousel"
                        data-bs-slide="next">
                        <span className="carousel-control-next-icon" aria-hidden="true"></span>
                        <span className="visually-hidden">Next</span>
                      </button>
                    </div>
                  </div>
                </div>
                <div id="mediaCarousel" className="carousel container media-carousel mt-5"
                  data-bs-ride="carousel" data-bs-interval="false" data-bs-wrap="false">
                  <div className="carousel-inner w-100">
                    {
                      this.state.contentItems.map((items, i) => {
                       // debugger;
                        let tempVal: any = ''; let tempNav;
                        const imgVal = this.getImageUrl(items.MediaIcon);
                        const isGallery = items.SitePages.NavigationComponent.includes("Gallery");
                        //{isGallery == true ? const tempNav = `${this.props.siteUrl}/SitePages/${items.SitePages.NavigationComponent}&program=${this.state.lastNavItem}&programId=${this.state.programID}` : const tempNav = `${this.props.siteUrl}/SitePages/${items.SitePages.NavigationComponent}?program=${this.state.lastNavItem}&programId=${this.state.programID}` }
                        if (isGallery == true) {
                          tempNav = `${this.props.siteUrl}/SitePages/${items.SitePages.NavigationComponent}&program=${this.state.lastNavItem}&programId=${this.state.programID}`;
                        }
                        else {
                          tempNav = `${this.props.siteUrl}/SitePages/${items.SitePages.NavigationComponent}?program=${this.state.lastNavItem}&programId=${this.state.programID}`;
                        }

                        return (
                          <div className={i == 0 ? "carousel-item active" : "carousel-item"}>
                            {/* <div className="col-md-3 m-2 "> */}
                            <div className="card">
                              <div className='img-wrapper'>
                                <img className="w-100" src={imgVal} />
                              </div>
                            </div>
                            <div className="card-body  d-flex flex-column">
                              <h4 className="card-title">{items.Title}</h4>
                              <p className="card-description" dangerouslySetInnerHTML={{ __html: items.Description }}></p>
                              <a href={`${tempNav}&env=WebView`} className="btn news-read-more  align-self-center">{items.NavigationText}</a>
                            </div>
                            {/* </div> */}
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
