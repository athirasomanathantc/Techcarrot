import * as React from 'react';
import styles from './AgiIntBusFuncService.module.scss';
import { IAgiIntBusFuncServiceProps } from './IAgiIntBusFuncServiceProps';
import { escape } from '@microsoft/sp-lodash-subset';
import { sp } from '@pnp/sp/presets/all';
import { IAgiIntBusFuncServiceState } from './IAgiIntBusFuncServiceState';
import { IContentItem } from '../models/IContentItem';
import { LIST_CONTENT, NULL_CONTENT_ITEM } from '../common/constants';
import * as $ from 'jquery';

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
      programID: '',
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
    debugger;
    var ourServiceCardCarousel = document.querySelector(
      "#ourServiceCarousel"
    );
    if (window.matchMedia("(min-width: 768px)").matches) {
      // var carousel = new bootstrap.Carousel(ourServiceCardCarousel, {
      //   interval: false,
      // });
      ourServiceCardCarousel.addEventListener('slide.bs.carousel', function () {

        interval: false
      });
      var carouselWidth = $(".our-services .carousel-inner")[0].scrollWidth;
      var cardWidth = $(".our-services  .carousel-item").width();
      var scrollPosition = 0;
      $(".our-service-control-next").click(function () {

        if (scrollPosition < carouselWidth - cardWidth * 4) {
          scrollPosition += cardWidth;
          $("#ourServiceCarousel .carousel-inner").animate(
            { scrollLeft: scrollPosition },
            600
          );
        }
      });
      $(".our-service-control-prev").on("click", function () {
        if (scrollPosition > 0) {
          scrollPosition -= cardWidth;
          $("#ourServiceCarousel .carousel-inner").animate(
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

  public render(): React.ReactElement<IAgiIntBusFuncServiceProps> {
    return (
      <div className={styles.agiIntBusFuncService}>
        {this.props.listName && this.props.listName.length > 0

          ?

          <section className="section our-services" style={{ display: this.state.contentItems.length > 0 ? 'block' : 'none' }}>
            <div className="container">
              <div className="row">
                <div className='title-header'>
                  <div className="text-left text-lg-center">
                    <h3 className="section-title">{this.props.listName}</h3>

                  </div>
                  <div className="align-self-end our-service-btn-control">
                    <div className="button-container">
                      <button className="carousel-control-prev our-service-control-prev" type="button" data-bs-target="#ourServiceCarousel"
                        data-bs-slide="prev">
                        <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                        <span className="visually-hidden">Previous</span>
                      </button>
                      <button className="carousel-control-next our-service-control-next" type="button" data-bs-target="#ourServiceCarousel"
                        data-bs-slide="next">
                        <span className="carousel-control-next-icon" aria-hidden="true"></span>
                        <span className="visually-hidden">Next</span>
                      </button>
                    </div>
                  </div>
                </div>
                <div id="ourServiceCarousel" className="carousel container our-service-carousel mt-5"
                  data-bs-ride="carousel" data-bs-interval="false" data-bs-wrap="false">
                  <div className="carousel-inner w-100">

                    {
                      this.state.contentItems.map((items, i) => {
                        debugger

                        const catVal = this.getQueryStringValue('categoryId');
                        let navURL = `${this.props.siteUrl}/SitePages/Articles.aspx?serviceId=${items.ID}&env=WebView`;//items.NavigationUrl.Url;
                        const article = items.isArticle;
                        let trgt = '_self';
                        // {article == true ? 
                        // {navURL : `${this.props.siteUrl}/SitePages/Articles.aspx?serviceId=${items.ID}&env=WebView`, trgt : '_blank'} : 
                        // {navURL : items.NavigationUrl.Url , trgt : '_self'}}
                        if (article == true) {
                          navURL = `${this.props.siteUrl}/SitePages/Articles.aspx?serviceId=${items.ID}&env=WebView`;//items.NavigationUrl.Url;
                          trgt = '_self';
                        }
                        else {
                          const tempURL = items.NavigationUrl.Url;
                          navURL = tempURL;
                          trgt = '_blank'
                        }
                        const imgVal = this.getImageUrl(items.ServiceIcon);
                        return (

                          <div className={i == 0 ? "carousel-item active" : "carousel-item"}>
                            <div className="col-md-3 m-2 h-100">
                              <div className="card  our-services">
                                <a href={navURL} target={trgt} data-interception="off"  ><img className="w-100 " src={imgVal} /></a>
                                <div className="card-body">
                                <a href={navURL} target={trgt} data-interception="off" className='service-link'>
                                  <h4 className="card-title">{items.Title}</h4>
                                  <p className="card-description mb-4" dangerouslySetInnerHTML={{ __html: items.Description }}></p>
                                  </a>
                                  <a href={navURL} target={trgt} data-interception="off" className="btn news-read-more mt-auto align-self-end">{items.NavigationText}</a>
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
