import * as React from 'react';
import styles from './AgiIntBusFuncArticle.module.scss';
import { IAgiIntBusFuncArticleProps } from './IAgiIntBusFuncArticleProps';
import { escape } from '@microsoft/sp-lodash-subset';
import { sp } from '@pnp/sp/presets/all';
import { IAgiIntBusFuncArticleState } from './IAgiIntBusFuncArticleState';
import { IBannerItem } from "../models/IBannerItem";
import { ISlideItem } from "../models/ISlideItem";
import { IContentItem } from "../models/IContentItem";
import { IContent2Item } from "../models/IContent2Item";
import { IContent3Item } from "../models/IContent3Item";
import { LIST_BANNER, LIST_SLIDE, LIST_CONTENT, LIST_CONTENT2, LIST_CONTENT3, NULL_BANNER_ITEM, NULL_SLIDE_ITEM, NULL_CONTENT_ITEM, NULL_CONTENT2_ITEM, NULL_CONTENT3_ITEM } from '../common/constants';

//require('../css/business.css');

export default class AgiIntBusFuncArticle extends React.Component<IAgiIntBusFuncArticleProps, IAgiIntBusFuncArticleState> {



  constructor(props: IAgiIntBusFuncArticleProps) {
    super(props);
    sp.setup({
      spfxContext: this.props.context
    });
    this.state = {
      bannerItems: [],
      slideItems: [],
      contentItems: [],
      content2Items: [],
      content3Items: [],
      lastNavItem: '',
      programID: ''
    }
  }

  public async componentDidMount(): Promise<void> {
    await this.getCurrentNavInfo();
    await this.getBannerItems();
    await this.getSlideItems();
    await this.getContentItems();
    await this.getContent2Items();
    await this.getContent3Items();
  }

  private async getBannerItems(): Promise<void> {
   // debugger;
    //  const progVal = this.getQueryStringValue('progName');
    //  const catVal = this.getQueryStringValue('progId');
    const serviceId = this.getQueryStringValue('serviceId');
    const tempProgramme = `ServiceNameId eq ${serviceId}`;
    sp.web.lists.getByTitle(LIST_BANNER).items.filter(tempProgramme).select("*,ServiceName/Title,ServiceName/Id").expand("ServiceName").get().then((items: IBannerItem[]) => {
      this.setState({
        bannerItems: items
      });
    });
  }

  private async getSlideItems(): Promise<void> {
    //  const progVal = this.getQueryStringValue('progName');
    //  const catVal = this.getQueryStringValue('progId');
    const serviceId = this.getQueryStringValue('serviceId');
    const tempProgramme = `ServiceNameId eq ${serviceId}`;
    sp.web.lists.getByTitle(LIST_SLIDE).items.filter(tempProgramme).select("*,ServiceName/Title,ServiceName/Id").expand("ServiceName").get().then((items: ISlideItem[]) => {
      this.setState({
        slideItems: items,
        //  programID: catVal
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

  private async getContentItems(): Promise<void> {
    //  const progVal = this.getQueryStringValue('progName');
    //  const catVal = this.getQueryStringValue('progId');
    const serviceId = this.getQueryStringValue('serviceId');
    const tempProgramme = `ServiceNameId eq ${serviceId}`;
    sp.web.lists.getByTitle(LIST_CONTENT).items.filter(tempProgramme).select("*,ServiceName/Title,ServiceName/Id").expand("ServiceName").get().then((items: IContentItem[]) => {
      this.setState({
        contentItems: items,
        //  programID: catVal
      });
    });
  }


  private async getContent2Items(): Promise<void> {
    //  const progVal = this.getQueryStringValue('progName');
    //  const catVal = this.getQueryStringValue('progId');
    const serviceId = this.getQueryStringValue('serviceId');
    const tempProgramme = `ServiceNameId eq ${serviceId}`;
    sp.web.lists.getByTitle(LIST_CONTENT2).items.filter(tempProgramme).select("*,ServiceName/Title,ServiceName/Id").expand("ServiceName").get().then((items: IContent2Item[]) => {
      console.log(items);
      this.setState({
        content2Items: items,
        // programID: catVal
      });
    });
  }

  private async getContent3Items(): Promise<void> {
    //  const progVal = this.getQueryStringValue('progName');
    //  const catVal = this.getQueryStringValue('progId');
    const serviceId = this.getQueryStringValue('serviceId');
    const tempProgramme = `ServiceNameId eq ${serviceId}`;
    sp.web.lists.getByTitle(LIST_CONTENT3).items.filter(tempProgramme).select("*,ServiceName/Title,ServiceName/Id").expand("ServiceName").get().then((items: IContent3Item[]) => {
      this.setState({
        content3Items: items,
        //  programID: catVal
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

  private renderCarouselSection(): JSX.Element {

    const carouselItem = this.state.contentItems;
    if (!carouselItem) {
      return;
    }

    return (
      <div className="main-content">
        <div className="content-wrapper business-details-content-section">
          <div className="container">
            <article className="wrapper">
              <div className="title text-center mb-4">
                <h2 className="">
                  {
                    this.state.bannerItems.map((items, i) => {
                      return (
                        items.ServiceName.Title
                      )
                    })
                  }
                </h2>
              </div>
              <div className="banner-slider-section" style={{ display: this.state.bannerItems.length > 0 ? 'block' : 'none' }}>
                <div id="business-details-banner-CarouselControls" className="carousel slide"
                  data-bs-ride="carousel">
                  <div className="carousel-inner">
                    {
                      this.state.bannerItems.map((items, i) => {
                        const imgVal = this.getImageUrl(items.BannerImage);
                        return (
                          <div className={i == 0 ? "carousel-item active" : "carousel-item"}>
                            <img src={imgVal} className="d-block w-100" alt="..." />
                          </div>
                        )
                      })
                    }
                  </div>
                  { this.state.bannerItems.length>1 &&
                    <>
                  <button className="carousel-control-prev" type="button"
                    data-bs-target="#business-details-banner-CarouselControls" data-bs-slide="prev">
                    <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                    <span className="visually-hidden">Previous</span>
                  </button>
                  <button className="carousel-control-next" type="button"
                    data-bs-target="#business-details-banner-CarouselControls" data-bs-slide="next">
                    <span className="carousel-control-next-icon" aria-hidden="true"></span>
                    <span className="visually-hidden">Next</span>
                  </button>
                  </>
                  }
                </div>
              </div>
              {
                this.state.bannerItems.map((items, i) => {
                  return (
                    <div className="intro-text-section mt-3 mt-md-5 mb-3 mb-md-5">
                      <h6 dangerouslySetInnerHTML={{ __html: items.PrimaryDescription }}></h6>
                      <p dangerouslySetInnerHTML={{ __html: items.SecondaryDescription }}></p>
                    </div>
                  )
                })
              }
              <div className="txt-img-section" style={{ display: this.state.contentItems.length > 0 ? 'block' : 'none' }}>
                {
                  this.state.contentItems.map((items, i) => {
                    const imgVal = this.getImageUrl(items.ContentImage);
                    return (
                      <div className={i % 2 == 0 ? "side-by-side reverse" : "side-by-side"}>
                        <img src={imgVal} />
                        <h2 dangerouslySetInnerHTML={{ __html: items.PrimaryDescription }}></h2>
                        <p dangerouslySetInnerHTML={{ __html: items.SecondaryDescription }}></p>
                      </div>
                    )
                  })
                }
              </div>

              <div className="inner-banner-section" style={{ display: this.state.content2Items.length > 0 ? 'block' : 'none' }}>
                {
                  this.state.content2Items.map((items, i) => {
                    return (
                      <div className="container">
                        <div className="icon-quote">
                          <img src={`${this.props.siteUrl}/Assets/images/icon-quotes.svg`} alt="" />
                        </div>
                        <p dangerouslySetInnerHTML={{ __html: items.Description }}></p>
                        <div className="quote-author">
                          <p className="name">{items.Creator}</p>
                          <p className="location">{items.Location}</p>
                        </div>
                      </div>
                    )
                  })
                }
              </div>

              <div className="row gx-5 mt-5 image-grid-section carousel js-carousel slide leadership-carousel" data-bs-ride="carousel" style={{ display: this.state.slideItems.length > 0 ? 'block' : 'none' }}>
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
                  <div className="carousel-inner" role="listbox">
                    {
                      this.state.slideItems.map((items, i) => {
                        const imgVal = this.getImageUrl(items.ContentImage);
                        return (
                          <div className={i == 0 ? "carousel-item js-carousel-item active" : "carousel-item js-carousel-item"}>
                            <div className="col-md-3">
                              <div className="team-card h-100">
                                <div className="team-img">
                                  <img src={imgVal} alt="Card Design" className="w-100" />
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

              {/* <div className="row">
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
              </div> */}



              <div className="row mt-5 content-txt-section" style={{ display: this.state.content3Items.length > 0 ? 'block' : 'none' }}>
                {
                  this.state.content3Items.map((items, i) => {
                    return (
                      <p dangerouslySetInnerHTML={{ __html: items.Description }}></p>
                    )
                  })
                }
              </div>
            </article>
          </div>
        </div>
      </div >

    );
  }

  public render(): React.ReactElement<IAgiIntBusFuncArticleProps> {
    return (
      <div className={styles.agiIntBusFuncArticle}>
        {this.renderCarouselSection()}
      </div>
    );
  }
}
