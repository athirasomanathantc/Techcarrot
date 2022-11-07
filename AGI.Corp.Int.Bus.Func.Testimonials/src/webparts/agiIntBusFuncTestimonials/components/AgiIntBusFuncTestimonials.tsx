import * as React from 'react';
import styles from './AgiIntBusFuncTestimonials.module.scss';
import { IAgiIntBusFuncTestimonialsProps } from './IAgiIntBusFuncTestimonialsProps';
import { escape } from '@microsoft/sp-lodash-subset';
import { sp } from '@pnp/sp/presets/all';
import { IAgiIntBusFuncTestimonialsState } from './IAgiIntBusFuncTestimonialsState';
import { IContentItem } from '../models/IContentItem';
import { LIST_CONTENT, NULL_CONTENT_ITEM } from '../common/constants';

//require('../css/business.css');

export default class AgiIntBusFuncTestimonials extends React.Component<IAgiIntBusFuncTestimonialsProps, IAgiIntBusFuncTestimonialsState> {



  constructor(props: IAgiIntBusFuncTestimonialsProps) {
    super(props);
    sp.setup({
      spfxContext: this.props.context
    });
    this.state = {
      contentItems: [],
      lastNavItem: '',
      testimonialsTitle: ''
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
      .filter(`(${this.state.lastNavItem}Id eq ${categoryId}) and (Title eq 'Testimonials Title')`)
      .get().then((items: any) => {
        this.setState({
          testimonialsTitle: items[0]?.Header
        });
      });
  }

  private async getCarouselItem(): Promise<void> {
    const catVal = this.getQueryStringValue('categoryId');
    const tempProgramme = `${this.state.lastNavItem}Id eq ${catVal}`;
    const currentListName = this.props.listName;
    sp.web.lists.getByTitle(currentListName).items.filter(tempProgramme).get().then((items: IContentItem[]) => {
      this.setState({
        contentItems: items
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

  private getCurrentNavInfo() {
    try {
      const currentWindowUrl = window.location.href;
      const currentSitePages = currentWindowUrl.split("SitePages");
      const currentSitePagesNav: any = currentSitePages[1].split("/");

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

  private getQueryStringValue(param: string): string {//debugger;
    const params = new URLSearchParams(window.location.search);
    let value = params.get(param) || '';
    return value;
  }


  public render(): React.ReactElement<IAgiIntBusFuncTestimonialsProps> {
    return (
      <div className={styles.agiIntBusFuncTestimonials} >
        {
          this.props.listName && this.props.listName.length > 0
            ?
            <section id="testimonial-slider" className="section testimonial-slider pb-5" style={{ display: this.state.contentItems.length > 0 ? 'block' : 'none' }}>
              <div className="container">
                <div id="carouselTestimonial" className="carousel  slide" data-bs-ride="carousel">
                  <div className="col-12 text-left text-lg-center">
                    <h2 className="section-title">{this.state.testimonialsTitle}</h2>
                  </div>
                  <div className="col-sm-8 mx-auto">
                    <div className="carousel-inner text-center  py-5">
                      {
                        this.state.contentItems.map((items, i) => {
                          const imgVal = this.getImageUrl(items.UserImage);
                          return (
                            <div className={i == 0 ? "carousel-item active" : "carousel-item"} data-bs-interval="10000">
                              <div className="user-photo ">
                                <img src={imgVal} className="img-fluid" alt="testimonial slider" />
                              </div>
                              <div className="slider-caption mt-3">
                                <h3>{items.Title}</h3>
                                <h4>{items.Designation}, {items.Company}</h4>
                                <blockquote>
                                  <p dangerouslySetInnerHTML={{ __html: items.Quotes }}></p>
                                </blockquote>
                              </div>
                            </div>
                          )
                        })
                      }
                    </div>
                  </div>
                  <div className="button-container">
                    <button className="carousel-control-prev" type="button" data-bs-target="#carouselTestimonial"
                      data-bs-slide="prev">
                      <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                      <span className="visually-hidden">Previous</span>
                    </button>
                    <button className="carousel-control-next" type="button" data-bs-target="#carouselTestimonial"
                      data-bs-slide="next">
                      <span className="carousel-control-next-icon" aria-hidden="true"></span>
                      <span className="visually-hidden">Next</span>
                    </button>
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
