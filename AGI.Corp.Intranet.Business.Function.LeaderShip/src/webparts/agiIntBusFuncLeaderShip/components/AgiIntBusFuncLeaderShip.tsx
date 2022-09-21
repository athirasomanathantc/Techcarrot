import * as React from 'react';
import styles from './AgiIntBusFuncLeaderShip.module.scss';
import { IAgiIntBusFuncLeaderShipProps } from './IAgiIntBusFuncLeaderShipProps';
import { escape } from '@microsoft/sp-lodash-subset';
import { sp } from '@pnp/sp/presets/all';
import { IAgiIntBusFuncLeaderShipState } from './IAgiIntBusFuncLeaderShipState';
import { IContentItem } from '../models/IContentItem';
import { LIST_CONTENT, NULL_CONTENT_ITEM } from '../common/constants';

//require('../css/business.css');

export default class AgiIntBusFuncLeaderShip extends React.Component<IAgiIntBusFuncLeaderShipProps, IAgiIntBusFuncLeaderShipState> {



  constructor(props: IAgiIntBusFuncLeaderShipProps) {
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
      <section className="section business-leadership-section">
        <div className="container">
          <div className="row">
            <div className="col-8 col-lg-11 text-let text-lg-center">
              <h3 className="leadership-team-heading">Leadership Team</h3>

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
                    <div className="carousel-item js-carousel-item active">
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

  public render(): React.ReactElement<IAgiIntBusFuncLeaderShipProps> {
    return (
      <div className={styles.agiIntBusFuncLeaderShip}>
        {this.renderCarouselSection()}
      </div>
    );
  }
}
