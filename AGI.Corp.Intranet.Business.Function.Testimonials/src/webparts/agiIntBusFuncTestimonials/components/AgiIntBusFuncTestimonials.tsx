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
      contentItems: []
    }
  }

  public async componentDidMount(): Promise<void> {
    this.getCarouselItem();
  }

  private async getCarouselItem(): Promise<void> {
    debugger;
    const catVal = this.getQueryStringValue('category');
    sp.web.lists.getByTitle(LIST_CONTENT).items.filter('FSObjType eq 0').get().then((items: IContentItem[]) => {
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

  private getQueryStringValue(param: string): string {
    const params = new URLSearchParams(window.location.search);
    let value = params.get(param) || '';
    return value;
  }

  private renderCarouselSection(): JSX.Element {

    const carouselItem = this.state.contentItems;
    if (!carouselItem) {
      return;
    }

    return (
      <section id="testimonial-slider" className="section testimonial-slider pb-5">
        <div className="container">
          <div id="carouselTestimonial" className="carousel  slide" data-bs-ride="carousel">
            <div className="col-12 text-left text-lg-center">
              <h2 className="section-title">Testimonials</h2>
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
    );
  }

  public render(): React.ReactElement<IAgiIntBusFuncTestimonialsProps> {
    return (
      <div className={styles.agiIntBusFuncTestimonials}>
        {this.renderCarouselSection()}
      </div>
    );
  }
}
