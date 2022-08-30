import * as React from 'react';
import styles from './AgiIntranetHomeMain.module.scss';
import { IAgiIntranetHomeMainProps } from './IAgiIntranetHomeMainProps';
import { escape } from '@microsoft/sp-lodash-subset';
import { Item, sp } from '@pnp/sp/presets/all';
import { IAgiIntranetHomeMainState } from './IAgiIntranetHomeMainState';
import { IContactUsTalk2UsItem } from '../models/IContactUsTalk2UsItem';
import { IContactUsGoogleMapsItem } from '../models/IContactUsGoogleMapsItem';
import { LIST_CONTACTUS_REGISTRATION, LIST_CONTACTUS_TALK2US, NULL_CONTACTUS_TALK2US_ITEM, LIST_CONTACTUS_GOOGLEMAPS, NULL_CONTACTUS_GOOGLEMAPS_ITEM, TEXT_REGISTRATION_SUCCESS, LIST_TALK2US_RIGHT, LIST_TALK2US_LEFT, TEXT_IFRAME_URL, LIST_CONTACTUS_MAIN, NULL_CONTACTUS_MAIN_ITEM } from '../common/constants';
import { IContactUsMainItem } from '../models/IContactUsMainItem';
export default class AgiIntranetHomeMain extends React.Component<IAgiIntranetHomeMainProps, IAgiIntranetHomeMainState> {

  private pestaña;

  constructor(props: IAgiIntranetHomeMainProps) {
    super(props);
    sp.setup({
      spfxContext: this.props.context
    });
    this.state = {
      contactUsMainItems: [],
      contactUsTalk2UsItems: [],
      contactUsGoogleMapsItem: NULL_CONTACTUS_GOOGLEMAPS_ITEM,
      selectedUserName: '',
      selectedUserEmail: '',
      selectedUserExtn: '',
      selectedUserPhone: '',
      selectedUserSubject: '',
      selectedUserMsg: '',
      showSuccessMsg: false,
      showErrorEmailMsg: false,
      showErrorExtnMsg: false,
      showErrorPhoneMsg: false,
      validationText: ''
    }
  }

  public async componentDidMount(): Promise<void> {
    this.getSubjectItem();
    this.getTalk2UsItem();
    this.getGoogleMapsItem();
    await this.getUserProfile();
  }

  private async getSubjectItem(): Promise<void> {

    sp.web.lists.getByTitle(LIST_CONTACTUS_MAIN).items.get().then((items: IContactUsMainItem[]) => {
      const contactUsMainItems = items && items.length > 0 ? items[0] : NULL_CONTACTUS_MAIN_ITEM;
      this.setState({
        contactUsMainItems: items
      });
    });
  }

  private async getTalk2UsItem(): Promise<void> {

    sp.web.lists.getByTitle(LIST_CONTACTUS_TALK2US).items.get().then((items: IContactUsTalk2UsItem[]) => {
      const contactUsTalk2UsItem = items && items.length > 0 ? items[0] : NULL_CONTACTUS_TALK2US_ITEM;
      this.setState({
        contactUsTalk2UsItems: items
      });
    });
  }

  private async getUserProfile(): Promise<void> {
    //let loginName="i:0#.f|membership|"+user.userPrincipalName;
    const userPrincipalName = this.props.context.pageContext.legacyPageContext.userLoginName;
    let loginName = `i:0#.f|membership|${userPrincipalName}`;
    sp.web.currentUser.get().then((userData) => {
      //console.log('userdeail', data);
      this.setState({
        selectedUserName: userData.Title,
        selectedUserEmail: userData.Email
      });
    });
  }

  private async getGoogleMapsItem(): Promise<void> {

    sp.web.lists.getByTitle(LIST_CONTACTUS_GOOGLEMAPS).items.get().then((items: IContactUsGoogleMapsItem[]) => {
      const contactUsGoogleMapsItem = items && items.length > 0 ? items[0] : NULL_CONTACTUS_GOOGLEMAPS_ITEM;
      this.setState({
        contactUsGoogleMapsItem
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

  private renderContactUsContentSection(): JSX.Element {

    return (

      <div className="main-content">
        <div className="content-wrapper">
          <div className="container">
            <div className="row home-page">
              <div className="col-xl-8 col-sm-12  ">
                <div className="row">
                  <div className="col-md-12 latest-news-section ">
                    <div className="card ">
                      <div className="card-header d-flex align-items-center justify-content-between border-bottom-0 pb-0 pt-3">
                        <h4 className="card-title mb-0">Latest News</h4>
                        <a href="#" className="viewall-link">View All</a>
                      </div>
                      <div className="card-body">
                        <div id="carouselLatestNews" className="carousel slide mb-4" data-bs-ride="carousel">
                          <div className="carousel-indicators">
                            <button type="button" data-bs-target="#carouselLatestNews"
                              data-bs-slide-to="0" className="active" aria-current="true"
                              aria-label="Slide 1"></button>
                            <button type="button" data-bs-target="#carouselLatestNews"
                              data-bs-slide-to="1" aria-label="Slide 2"></button>
                            <button type="button" data-bs-target="#carouselLatestNews"
                              data-bs-slide-to="2" aria-label="Slide 3"></button>
                          </div>
                          <div className="carousel-inner">
                            <div className="carousel-item active">
                              <img src={`${this.props.siteUrl}/Assets/images/latest-new-img-1.png`} className="d-block w-100"
                                alt="..."/>
                                <div className="carousel-caption">
                                  <span className="badge rounded-pill bg-light">Business</span>
                                  <p>Al Ghurair enroute to transforming digital landscape transforming digital landscape</p>
                                  <h5 className="date">19 May 2022, Dubai, UAE</h5>
                                </div>
                            </div>
                            <div className="carousel-item">
                              <img src={`${this.props.siteUrl}/Assets/images/latest-new-img-1.png`} className="d-block w-100"
                                alt="..."/>
                                <div className="carousel-caption ">
                                  <span className="badge rounded-pill bg-light">Business</span>
                                  <p>Al Ghurair enroute to transforming digital landscape</p>
                                  <h5 className="date">19 May 2022, Dubai, UAE</h5>
                                </div>
                            </div>
                          </div>
                          <button className="carousel-control-prev" type="button"
                            data-bs-target="#carouselLatestNews" data-bs-slide="prev">
                            <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                            <span className="visually-hidden">Previous</span>
                          </button>
                          <button className="carousel-control-next" type="button"
                            data-bs-target="#carouselLatestNews" data-bs-slide="next">
                            <span className="carousel-control-next-icon" aria-hidden="true"></span>
                            <span className="visually-hidden">Next</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="col-md-12 announcement-section ">
                    <div className="card border-radius-0">

                      <div className="card-body">
                        <div id="carouselExampleCaptions2" className="carousel slide"
                          data-bs-ride="carousel">
                          <div className="d-flex align-items-center justify-content-between flex-wrap mb-4 card-header announcement-header px-0">

                            <h4>Announcements</h4>

                            <div className="p-0 position-relative ">
                              <button className="carousel-control-prev" type="button"
                                data-bs-target="#carouselExampleCaptions2"
                                data-bs-slide="prev">
                                <span className="carousel-control-prev-icon"
                                  aria-hidden="true"></span>
                                <span className="visually-hidden">Previous</span>
                              </button>
                              <button className="carousel-control-next" type="button"
                                data-bs-target="#carouselExampleCaptions2"
                                data-bs-slide="next">
                                <span className="carousel-control-next-icon"
                                  aria-hidden="true"></span>
                                <span className="visually-hidden">Next</span>
                              </button>

                            </div>

                          </div>
                          <div className="carousel-inner pt-9">

                            <div className="carousel-item active">

                              <div className="row">
                                <div className="col-12 col-md-6 mb-4">
                                  <div className="d-flex ">
                                    <div
                                      className="icon-announcement text-dark flex-shrink-0 me-3">
                                      <img src={`${this.props.siteUrl}/Assets/images/announcement-1.png`}
                                        width="100%"/>
                                    </div>
                                    <div className="d-flex flex-column flex-wrap">
                                      <p className="announcement-date">March 23, 12.30pm
                                      </p>
                                      <p className="announcement-title">Commemorated on
                                        28th of April, The World Day for Safety and
                                        Health at Work</p>
                                      <p className="mb-2 text-break text-wrap announcement-desc d-none d-sm-block ">
                                        Lorem ipsum dolor sit amet, consectetur
                                        adipiscing elit, sed do eiusmod tempor
                                      </p>
                                    </div>
                                  </div>
                                </div>

                                <div className="col-12 col-md-6  mb-4">
                                  <div className="d-flex ">
                                    <div
                                      className="icon-announcement text-dark flex-shrink-0 me-3">
                                      <img src={`${this.props.siteUrl}/Assets/images/announcement-2.png`}
                                        width="100%"/>
                                    </div>
                                    <div className="d-flex flex-column flex-wrap">
                                      <p className="announcement-date">March 23, 12.30pm
                                      </p>
                                      <p className="announcement-title">Commemorated on
                                        28th of April, The World Day for Safety and
                                        Health at Work</p>
                                      <p
                                        className="mb-2 text-break text-wrap announcement-desc d-none d-sm-block ">
                                        Long weekend alert, the likely dates of
                                        Islamic festival Eid Al Adha have been
                                        revealed…
                                      </p>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="col-md-12 snap-share-section mt-4 mb-4 stretch-card">
                    <div className="card snap-share ">
                      <div className="card-body">

                        <div id="carouselExampleCaptions3" className="carousel slide"
                          data-bs-ride="carousel">
                          <div className="d-flex align-items-center justify-content-between flex-wrap card-header snap-share-header px-0">

                            <h4>Snap Share</h4>

                            <div className="p-0 position-relative">
                              <button className="carousel-control-prev" type="button"
                                data-bs-target="#carouselExampleCaptions3"
                                data-bs-slide="prev">
                                <span className="carousel-control-prev-icon"
                                  aria-hidden="true"></span>
                                <span className="visually-hidden">Previous</span>
                              </button>
                              <button className="carousel-control-next" type="button"
                                data-bs-target="#carouselExampleCaptions3"
                                data-bs-slide="next">
                                <span className="carousel-control-next-icon"
                                  aria-hidden="true"></span>
                                <span className="visually-hidden">Next</span>
                              </button>

                            </div>

                          </div>
                          <div className="carousel-inner pt-9 mt-3">

                            <div className="carousel-item active">
                              <div className="snap-share-wrapper-item">
                                <div className="img-with-text">
                                  <img src={`${this.props.siteUrl}/Assets/images/snap-share-img-1.png`}/>
                                    <div className="overlay">
                                      <div className="text"><i><img src={`${this.props.siteUrl}/Assets/images/icon-camera.svg`} alt=""/></i>6 K. Jacob John</div>
                                      <div className="text show-on-hover">The center of the world</div>
                                    </div>
                                </div>
                                <div className="img-with-text">
                                  <img src={`${this.props.siteUrl}/Assets/images/snap-share-img-1.png`}/>
                                    <div className="overlay">
                                      <div className="text"><i><img src={`${this.props.siteUrl}/Assets/images/icon-camera.svg`} alt=""/></i>7 K. Jacob John</div>
                                      <div className="text show-on-hover">The center of the world</div>
                                    </div>
                                </div>
                                <div className="img-with-text">
                                  <img src={`${this.props.siteUrl}/Assets/images/snap-share-img-1.png`}/>
                                    <div className="overlay">
                                      <div className="text"><i><img src={`${this.props.siteUrl}/Assets/images/icon-camera.svg`} alt=""/></i>8 K. Jacob John</div>
                                      <div className="text show-on-hover">The center of the world</div>
                                    </div>
                                </div>
                                <div className="img-with-text">
                                  <img src={`${this.props.siteUrl}/Assets/images/snap-share-img-1.png`}/>
                                    <div className="overlay">
                                      <div className="text"><i><img src={`${this.props.siteUrl}/Assets/images/icon-camera.svg`} alt=""/></i>9 K. Jacob John</div>
                                      <div className="text show-on-hover">The center of the world</div>
                                    </div>
                                </div>
                                <div className="img-with-text">
                                  <img src={`${this.props.siteUrl}/Assets/images/snap-share-img-1.png`}/>
                                    <div className="overlay">
                                      <div className="text"><i><img src={`${this.props.siteUrl}/Assets/images/icon-camera.svg`} alt=""/></i> 10 K. Jacob John</div>
                                      <div className="text show-on-hover">The center of the world</div>
                                    </div>
                                </div>
                                <div className="img-with-text">
                                  <img src={`${this.props.siteUrl}/Assets/images/snap-share-img-1.png`}/>
                                    <div className="overlay">
                                      <div className="text"><i><img src={`${this.props.siteUrl}/Assets/images/icon-camera.svg`} alt=""/></i>11 K. Jacob John</div>
                                      <div className="text show-on-hover">The center of the world</div>
                                    </div>
                                </div>
                              </div>
                            </div>

                            <div className="carousel-item ">
                              <div className="snap-share-wrapper-item">
                                <div className="img-with-text">
                                  <img src={`${this.props.siteUrl}/Assets/images/snap-share-img-1.png`}/>
                                    <div className="overlay">
                                      <div className="text"><i><img src={`${this.props.siteUrl}/Assets/images/icon-camera.svg`} alt=""/></i>1 K. Jacob John</div>
                                      <div className="text show-on-hover">The center of the world</div>
                                    </div>
                                </div>
                                <div className="img-with-text">
                                  <img src={`${this.props.siteUrl}/Assets/images/snap-share-img-1.png`}/>
                                    <div className="overlay">
                                      <div className="text"><i><img src={`${this.props.siteUrl}/Assets/images/icon-camera.svg`} alt=""/></i>2 K. Jacob John</div>
                                      <div className="text show-on-hover">The center of the world</div>
                                    </div>
                                </div>
                                <div className="img-with-text">
                                  <img src={`${this.props.siteUrl}/Assets/images/snap-share-img-1.png`}/>
                                    <div className="overlay">
                                      <div className="text"><i><img src={`${this.props.siteUrl}/Assets/images/icon-camera.svg`} alt=""/></i>3 K. Jacob John</div>
                                      <div className="text show-on-hover">The center of the world</div>
                                    </div>
                                </div>
                                <div className="img-with-text">
                                  <img src={`${this.props.siteUrl}/Assets/images/snap-share-img-1.png`}/>
                                    <div className="overlay">
                                      <div className="text"><i><img src={`${this.props.siteUrl}/Assets/images/icon-camera.svg`} alt=""/></i> K. Jacob John</div>
                                      <div className="text show-on-hover">The center of the world</div>
                                    </div>
                                </div>
                                <div className="img-with-text">
                                  <img src={`${this.props.siteUrl}/Assets/images/snap-share-img-1.png`}/>
                                    <div className="overlay">
                                      <div className="text"><i><img src={`${this.props.siteUrl}/Assets/images/icon-camera.svg`} alt=""/></i>4 K. Jacob John</div>
                                      <div className="text show-on-hover">The center of the world</div>
                                    </div>
                                </div>
                                <div className="img-with-text">
                                  <img src={`${this.props.siteUrl}/Assets/images/snap-share-img-1.png`}/>
                                    <div className="overlay">
                                      <div className="text"><i><img src={`${this.props.siteUrl}/Assets/images/icon-camera.svg`} alt=""/></i> 5 K. Jacob John</div>
                                      <div className="text show-on-hover">The center of the world</div>
                                    </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>



                      </div>
                    </div>

                  </div>

                  <div className=" row p-0 me-0 ms-0 mb-3">
                    <div className="col-sm-6 col-xl-6  social-media-section mb-4 mb-md-0">
                      <div className="card h-100">
                        <div data-bs-target="#socialOffer" data-bs-toggle="collapse">
                          <div className="card-header d-flex align-items-center justify-content-between" >
                            <h4 className="card-title mb-0">Social Media</h4>
                            <div className="d-md-none " >
                              <div className="float-right navbar-toggler d-md-none">
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18">
                                  <g id="Dropdown-Logo" transform="translate(-84 -7.544)">
                                    <path id="Path_73662" data-name="Path 73662" d="M15.739,7.87,8.525.656,7.868,0,0,7.87" transform="translate(100.366 20.883) rotate(180)" fill="none" stroke="#dccede" stroke-width="1.5" />
                                    <rect id="Rectangle_7537" data-name="Rectangle 7537" width="18" height="18" transform="translate(84 7.544)" fill="none" />
                                  </g>
                                </svg>
                              </div>
                            </div>
                            <div className="p-0 position-relative d-none d-md-block">
                              <button className="carousel-control-prev" type="button"
                                data-bs-target="#socialMediaControls"
                                data-bs-slide="prev">
                                <span className="carousel-control-prev-icon"
                                  aria-hidden="true"></span>
                                <span className="visually-hidden">Previous</span>
                              </button>
                              <button className="carousel-control-next" type="button"
                                data-bs-target="#socialMediaControls"
                                data-bs-slide="next">
                                <span className="carousel-control-next-icon"
                                  aria-hidden="true"></span>
                                <span className="visually-hidden">Next</span>
                              </button>

                            </div>
                          </div>
                        </div>

                        <div className="collapse dont-collapse-sm" id="socialOffer">
                          <div className="card-body d-flex flex-column align-items-center justify-content-center ">
                            <div id="socialMediaControls" className="carousel slide" data-bs-ride="carousel">
                              <div className="carousel-inner">
                                <div className="carousel-item active">
                                  <img src={`${this.props.siteUrl}/Assets/images/social-media-img-1.png`} className="d-block w-100" alt="..."/>
                                    <div className="carousel-caption overlay">

                                      <p>As one of the largest importers of Canadian food products in the UAE, Al Ghurair Resources International had the privilege of hosting Kyle Procyshyn, Managing Director, and Ali S. Ali, … Trade & Investment Officer from Saskatchewan’s UAE Office, at the business’ facilities in Dubai last week, 13th July. The visit speaks as a testament to the longstanding bilateral trade relationship between the UAE and Canada, and the business’ key role in contributing to the country’s economy and advancing its food security agenda. With a focus on fostering agricultural prosperity in both nations, discussions were held in relation to furthering partnerships with additional Canadian agricultural commodity suppliers, uncovering regional insights, technological advancements within the canola industry, and cost-effective solutions. At Al Ghurair Investment we recognise that we have a critical role to play in supporting the global drive for enhanced food security and are committed to continuous improvement, as we invest in innovation to bring the best quality products to consumers across the region, and beyond. #AlGhurair #AGI #AGINews #Purposeled #EnhancingLife #AlGhurairInvestment #AlGhurairResources #FoodSecurity #Partnership #Sustainability #Innovation</p>
                                      <div className="caption-bottom d-flex justify-content-between">
                                        <div className="bottom-text">
                                          <h5>Al Ghurair Investment</h5>
                                          <p>18 July</p>
                                        </div>
                                        <div className="linkedin-icon">
                                          <svg xmlns="http://www.w3.org/2000/svg" width="31.979" height="31.979" viewBox="0 0 31.979 31.979">
                                            <path id="linkedin_1_" data-name="linkedin (1)" d="M29.087,0H2.893A2.893,2.893,0,0,0,0,2.893V29.087a2.893,2.893,0,0,0,2.893,2.893H29.087a2.893,2.893,0,0,0,2.893-2.893V2.893A2.893,2.893,0,0,0,29.087,0ZM9.9,27.613a.842.842,0,0,1-.842.842H5.47a.842.842,0,0,1-.842-.842V12.591a.842.842,0,0,1,.842-.842H9.054a.842.842,0,0,1,.842.842ZM7.262,10.333a3.4,3.4,0,1,1,3.4-3.4A3.4,3.4,0,0,1,7.262,10.333ZM28.623,27.681a.774.774,0,0,1-.774.774H24a.774.774,0,0,1-.774-.774V20.635c0-1.051.308-4.606-2.747-4.606-2.37,0-2.851,2.433-2.947,3.525v8.127a.774.774,0,0,1-.774.774H13.043a.774.774,0,0,1-.774-.774V12.523a.774.774,0,0,1,.774-.774h3.719a.774.774,0,0,1,.774.774v1.311C18.414,12.515,19.72,11.5,22.5,11.5c6.157,0,6.122,5.753,6.122,8.913v7.27Z" fill="#fff" />
                                          </svg>
                                        </div>
                                      </div>


                                    </div>

                                </div>
                                <div className="carousel-item">
                                  <img src={`${this.props.siteUrl}/Assets/images/social-media-img-1.png`} className="d-block w-100" alt="..."/>
                                    <div className="carousel-caption overlay">

                                      <p>As one of the largest importers of Canadian food products in the UAE, Al Ghurair Resources International had the privilege of hosting Kyle Procyshyn, Managing Director, and Ali S. Ali, … Trade & Investment Officer from Saskatchewan’s UAE Office, at the business’ facilities in Dubai last week, 13th July. The visit speaks as a testament to the longstanding bilateral trade relationship between the UAE and Canada, and the business’ key role in contributing to the country’s economy and advancing its food security agenda. With a focus on fostering agricultural prosperity in both nations, discussions were held in relation to furthering partnerships with additional Canadian agricultural commodity suppliers, uncovering regional insights, technological advancements within the canola industry, and cost-effective solutions. At Al Ghurair Investment we recognise that we have a critical role to play in supporting the global drive for enhanced food security and are committed to continuous improvement, as we invest in innovation to bring the best quality products to consumers across the region, and beyond. #AlGhurair #AGI #AGINews #Purposeled #EnhancingLife #AlGhurairInvestment #AlGhurairResources #FoodSecurity #Partnership #Sustainability #Innovation</p>
                                      <div className="caption-bottom d-flex justify-content-between">
                                        <div className="bottom-text">
                                          <h5>Al Ghurair Investment</h5>
                                          <p>18 July</p>
                                        </div>
                                        <div className="linkedin-icon">
                                          <svg xmlns="http://www.w3.org/2000/svg" width="31.979" height="31.979" viewBox="0 0 31.979 31.979">
                                            <path id="linkedin_1_" data-name="linkedin (1)" d="M29.087,0H2.893A2.893,2.893,0,0,0,0,2.893V29.087a2.893,2.893,0,0,0,2.893,2.893H29.087a2.893,2.893,0,0,0,2.893-2.893V2.893A2.893,2.893,0,0,0,29.087,0ZM9.9,27.613a.842.842,0,0,1-.842.842H5.47a.842.842,0,0,1-.842-.842V12.591a.842.842,0,0,1,.842-.842H9.054a.842.842,0,0,1,.842.842ZM7.262,10.333a3.4,3.4,0,1,1,3.4-3.4A3.4,3.4,0,0,1,7.262,10.333ZM28.623,27.681a.774.774,0,0,1-.774.774H24a.774.774,0,0,1-.774-.774V20.635c0-1.051.308-4.606-2.747-4.606-2.37,0-2.851,2.433-2.947,3.525v8.127a.774.774,0,0,1-.774.774H13.043a.774.774,0,0,1-.774-.774V12.523a.774.774,0,0,1,.774-.774h3.719a.774.774,0,0,1,.774.774v1.311C18.414,12.515,19.72,11.5,22.5,11.5c6.157,0,6.122,5.753,6.122,8.913v7.27Z" fill="#fff" />
                                          </svg>
                                        </div>
                                      </div>


                                    </div>
                                </div>
                                <div className="carousel-item">
                                  <img src={`${this.props.siteUrl}/Assets/images/social-media-img-1.png`} className="d-block w-100" alt="..."/>
                                    <div className="carousel-caption overlay">

                                      <p>As one of the largest importers of Canadian food products in the UAE, Al Ghurair Resources International had the privilege of hosting Kyle Procyshyn, Managing Director, and Ali S. Ali, … Trade & Investment Officer from Saskatchewan’s UAE Office, at the business’ facilities in Dubai last week, 13th July. The visit speaks as a testament to the longstanding bilateral trade relationship between the UAE and Canada, and the business’ key role in contributing to the country’s economy and advancing its food security agenda. With a focus on fostering agricultural prosperity in both nations, discussions were held in relation to furthering partnerships with additional Canadian agricultural commodity suppliers, uncovering regional insights, technological advancements within the canola industry, and cost-effective solutions. At Al Ghurair Investment we recognise that we have a critical role to play in supporting the global drive for enhanced food security and are committed to continuous improvement, as we invest in innovation to bring the best quality products to consumers across the region, and beyond. #AlGhurair #AGI #AGINews #Purposeled #EnhancingLife #AlGhurairInvestment #AlGhurairResources #FoodSecurity #Partnership #Sustainability #Innovation</p>
                                      <div className="caption-bottom d-flex justify-content-between">
                                        <div className="bottom-text">
                                          <h5>Al Ghurair Investment</h5>
                                          <p>18 July</p>
                                        </div>
                                        <div className="linkedin-icon">
                                          <svg xmlns="http://www.w3.org/2000/svg" width="31.979" height="31.979" viewBox="0 0 31.979 31.979">
                                            <path id="linkedin_1_" data-name="linkedin (1)" d="M29.087,0H2.893A2.893,2.893,0,0,0,0,2.893V29.087a2.893,2.893,0,0,0,2.893,2.893H29.087a2.893,2.893,0,0,0,2.893-2.893V2.893A2.893,2.893,0,0,0,29.087,0ZM9.9,27.613a.842.842,0,0,1-.842.842H5.47a.842.842,0,0,1-.842-.842V12.591a.842.842,0,0,1,.842-.842H9.054a.842.842,0,0,1,.842.842ZM7.262,10.333a3.4,3.4,0,1,1,3.4-3.4A3.4,3.4,0,0,1,7.262,10.333ZM28.623,27.681a.774.774,0,0,1-.774.774H24a.774.774,0,0,1-.774-.774V20.635c0-1.051.308-4.606-2.747-4.606-2.37,0-2.851,2.433-2.947,3.525v8.127a.774.774,0,0,1-.774.774H13.043a.774.774,0,0,1-.774-.774V12.523a.774.774,0,0,1,.774-.774h3.719a.774.774,0,0,1,.774.774v1.311C18.414,12.515,19.72,11.5,22.5,11.5c6.157,0,6.122,5.753,6.122,8.913v7.27Z" fill="#fff" />
                                          </svg>
                                        </div>
                                      </div>


                                    </div>
                                </div>
                              </div>
                              <div className="button-bottom d-md-none">
                                <button className="carousel-control-prev" type="button" data-bs-target="#socialMediaControls" data-bs-slide="prev">
                                  <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                                  <span className="visually-hidden">Previous</span>
                                </button>
                                <button className="carousel-control-next" type="button" data-bs-target="#socialMediaControls" data-bs-slide="next">
                                  <span className="carousel-control-next-icon" aria-hidden="true"></span>
                                  <span className="visually-hidden">Next</span>
                                </button>
                              </div>


                            </div>
                          </div>
                        </div>
                      </div>
                    </div>


                    <div className="col-xs-12 col-sm-6 col-xl-6   employee-offer-section mb-4 mb-md-0">

                      <div className="card h-100">
                        <div data-bs-target="#employeeOffer" data-bs-toggle="collapse">
                          <div className="card-header d-flex align-items-center justify-content-between" >
                            <h4 className="card-title mb-0">Employee Offers</h4>
                            <a href="#" className="viewall-link d-none d-md-block">View All</a>
                            <div className="d-md-none " >
                              <div className="float-right navbar-toggler d-md-none">
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18">
                                  <g id="Dropdown-Logo" transform="translate(-84 -7.544)">
                                    <path id="Path_73662" data-name="Path 73662" d="M15.739,7.87,8.525.656,7.868,0,0,7.87" transform="translate(100.366 20.883) rotate(180)" fill="none" stroke="#dccede" stroke-width="1.5" />
                                    <rect id="Rectangle_7537" data-name="Rectangle 7537" width="18" height="18" transform="translate(84 7.544)" fill="none" />
                                  </g>
                                </svg>
                              </div>
                            </div>
                            <div className="p-0 position-relative d-none d-md-block">
                              <button className="carousel-control-prev" type="button"
                                data-bs-target="#employeeOffersControls"
                                data-bs-slide="prev">
                                <span className="carousel-control-prev-icon"
                                  aria-hidden="true"></span>
                                <span className="visually-hidden">Previous</span>
                              </button>
                              <button className="carousel-control-next" type="button"
                                data-bs-target="#employeeOffersControls"
                                data-bs-slide="next">
                                <span className="carousel-control-next-icon"
                                  aria-hidden="true"></span>
                                <span className="visually-hidden">Next</span>
                              </button>

                            </div>
                          </div>

                        </div>


                        <div className="collapse dont-collapse-sm" id="employeeOffer">
                          <div className="card-body">

                            <div id="employeeOffersControls" className="carousel slide" data-bs-ride="carousel">
                              <div className="carousel-inner">
                                <div className="carousel-item active">
                                  <img src={`${this.props.siteUrl}/Assets/images/Employee-offer-img-1.png`} className="d-block w-100" alt="..."/>
                                    <div className="carousel-caption overlay">
                                      <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.</p>
                                      <div className="offer-btn-container"><a href="" className="btn btn-lg btn-view-offer">View Offer</a></div>
                                    </div>
                                </div>
                                <div className="carousel-item">
                                  <img src={`${this.props.siteUrl}/Assets/images/Employee-offer-img-1.png`} className="d-block w-100" alt="..."/>
                                    <div className="carousel-caption overlay">
                                      <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.</p>
                                      <div className="offer-btn-container"><a href="" className="btn btn-lg btn-view-offer">View Offer</a></div>
                                    </div>
                                </div>
                                <div className="carousel-item">
                                  <img src={`${this.props.siteUrl}/Assets/images/Employee-offer-img-1.png`} className="d-block w-100" alt="..."/>
                                    <div className="carousel-caption overlay">
                                      <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.</p>
                                      <div className="offer-btn-container"><a href="" className="btn btn-lg btn-view-offer">View Offer</a></div>
                                    </div>
                                </div>
                              </div>
                              <div className="d-md-none button-bottom">
                                <button className="carousel-control-prev" type="button" data-bs-target="#employeeOffersControls" data-bs-slide="prev">
                                  <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                                  <span className="visually-hidden">Previous</span>
                                </button>
                                <button className="carousel-control-next" type="button" data-bs-target="#employeeOffersControls" data-bs-slide="next">
                                  <span className="carousel-control-next-icon" aria-hidden="true"></span>
                                  <span className="visually-hidden">Next</span>
                                </button>
                              </div>
                            </div>



                          </div>
                          <div className="text-center mt-0 mb-3"><a href="#" className="viewall-link  d-md-none">View All</a></div>
                        </div>
                      </div>
                    </div>

                  </div>


                </div>


              </div>
              <div className="col-xl-4 col-sm-12">
                <div className="row">
                  <div className="icon-links-wrapper">
                    <div className="icon-links">
                      <ul>
                        <li>
                          <a href="#"><img src={`${this.props.siteUrl}/Assets/images/human-reources.svg`}/><b>Human
                            Resources</b></a>
                        </li>
                        <li>
                          <a href="#"><img src={`${this.props.siteUrl}/Assets/images/group-it.svg`}/><b>Group IT
                            Portal</b></a>
                        </li>
                        <li>
                          <a href="#"><img src={`${this.props.siteUrl}/Assets/images/competition.svg`}/><b>Games &
                            Competition</b></a>
                        </li>
                        <li>
                          <a href="#"><img src={`${this.props.siteUrl}/Assets/images/snap-share.svg`}/><b>Snap & Share</b></a>
                        </li>
                        <li>
                          <a href="#"><img src={`${this.props.siteUrl}/Assets/images/faq.svg`}/><b>FAQ</b></a>
                        </li>
                      </ul>
                    </div>
                  </div>

                  <div className="col-md-12 my-app ">
                    <div className="card ">
                      <div className="card-header d-flex align-items-center justify-content-between border-bottom-0">
                        <h4 className="card-title m-2 me-2">My Apps</h4>
                        <a href="#" className="viewall-link">View All</a>
                      </div>
                      <div className="card-body">

                        <div className="row app-wrapper">
                          <div className="col col-lg-6 col-sm-4">

                            <div className="d-flex app-item">
                              <div className="app-item-icon"><img src={`${this.props.siteUrl}/Assets/images/process1.svg`}/></div>
                              <div className="d-flex flex-column justify-content-around">
                                <h5 className="me-2 mb-0">Employee Services</h5>
                              </div>
                            </div>
                          </div>

                          <div className="col col-lg-6 col-sm-4">

                            <div className="d-flex app-item ">
                              <div className="app-item-icon"><img src={`${this.props.siteUrl}/Assets/images/browser.svg`}/></div>
                              <div className="d-flex flex-column justify-content-around">
                                <h5 className="me-2 mb-0">Webmail</h5>
                              </div>
                            </div>
                          </div>


                          <div className="col col-lg-6 col-sm-4">

                            <div className="d-flex app-item ">
                              <div className="app-item-icon"><img src={`${this.props.siteUrl}/Assets/images/online-learning1.svg`}/></div>
                              <div className="d-flex flex-column justify-content-around">
                                <h5 className="me-2 mb-0">Training</h5>
                              </div>
                            </div>
                          </div>

                          <div className="col col-lg-6 col-sm-4">

                            <div className="d-flex app-item ">
                              <div className="app-item-icon"><img src={`${this.props.siteUrl}/Assets/images/technical-support1.svg`}/></div>
                              <div className="d-flex flex-column justify-content-around">
                                <h5 className="me-2 mb-0">IT Services</h5>
                              </div>
                            </div>
                          </div>

                          <div className="col col-lg-6 col-sm-4">

                            <div className="d-flex app-item ">
                              <div className="app-item-icon"><img src={`${this.props.siteUrl}/Assets/images/document1.svg`}/></div>
                              <div className="d-flex flex-column justify-content-around">
                                <h5 className="me-2 mb-0">My Documents</h5>
                              </div>
                            </div>
                          </div>






                          <div className="col col-lg-6 col-sm-4">

                            <div className="d-flex app-item ">
                              <div className="app-item-icon"><img src={`${this.props.siteUrl}/Assets/images/gift.svg`}/></div>
                              <div className="d-flex flex-column justify-content-around">
                                <h5 className="me-2 mb-0">Employee Offers</h5>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="col-md-12 mt-4 ">
                    <div className="card calendar rounded-0">

                      <div className="card-body rounded-0">

                        <div className="app">
                          <div className="app__main">
                            <div className="calendar">
                              <div id="calendar"></div>
                              <div><span>Holiday</span></div>
                            </div>
                          </div>
                        </div>



                      </div>
                    </div>
                  </div>


                  <div className="col-md-12 mt-4  ">
                    <div className="card  company-event">
                      <div className="card-header d-flex align-items-center justify-content-between">
                        <h4 className="card-title m-2 me-2">Company Events</h4>
                        <a href="#" className="viewall-link">View All</a>
                      </div>
                      <div className="card-body">
                        <ul className="p-0 m-0 list-group">
                          <li className="list-group-item">
                            <div className="d-flex align-items-center">
                              <div className="event-date flex-shrink-0 me-3">
                                <p className="notification-date">12</p>
                                <p className="notification-month">May</p>
                              </div>
                              <div className="d-flex flex-column flex-wrap">

                                <p className="mb-2 text-break text-wrap">
                                  Changing Your Business Mindset From Operational To
                                  Aspirational
                                </p>
                              </div>
                            </div>
                          </li>
                          <li className="list-group-item">
                            <div className="d-flex align-items-center">
                              <div className="event-date  flex-shrink-0 me-3">
                                <p className="notification-date">12</p>
                                <p className="notification-month">May</p>
                              </div>
                              <div className="d-flex flex-column flex-wrap">

                                <p className="mb-2 text-break text-wrap">
                                  Changing Your Business Mindset From Operational To
                                  Aspirational
                                </p>
                              </div>
                            </div>
                          </li>
                          <li className="list-group-item">
                            <div className="d-flex align-items-center">
                              <div className="event-date  flex-shrink-0 me-3">
                                <p className="notification-date">12</p>
                                <p className="notification-month">May</p>
                              </div>
                              <div className="d-flex flex-column flex-wrap">

                                <p className="mb-2 text-break text-wrap">
                                  Changing Your Business Mindset From Operational To
                                  Aspirational
                                </p>
                              </div>
                            </div>
                          </li>
                        </ul>


                      </div>
                    </div>
                  </div>


                  <div className="col-md-12 mt-4 mb-4 mb-md-0">
                    <div className="card h-100">
                      <div className="card-header d-flex align-items-center justify-content-between" data-bs-target="#survey" data-bs-toggle="collapse">
                        <h4 className="card-title mb-0">Employee Survey</h4>
                        <div className="d-md-none " >
                          <div className="float-right navbar-toggler d-md-none">
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18">
                              <g id="Dropdown-Logo" transform="translate(-84 -7.544)">
                                <path id="Path_73662" data-name="Path 73662" d="M15.739,7.87,8.525.656,7.868,0,0,7.87" transform="translate(100.366 20.883) rotate(180)" fill="none" stroke="#dccede" stroke-width="1.5" />
                                <rect id="Rectangle_7537" data-name="Rectangle 7537" width="18" height="18" transform="translate(84 7.544)" fill="none" />
                              </g>
                            </svg>
                          </div>
                        </div>
                      </div>

                      <div className="collapse dont-collapse-sm" id="survey">
                        <div className="card-body">

                          <div id="qbox-container">
                            <form className="needs-validation" id="form-wrapper" method="post" name="form-wrapper">
                              <div id="steps-container">
                                <div className="step d-block">
                                  <h4>How long have you been working with Al Ghurair?</h4>
                                  <div className="form-check ps-0 q-box">

                                    <div className="q-box__question">
                                      <input type="radio" checked id="q_1" name="survey-questions" />
                                      <label>1 - 3 years</label>
                                    </div>

                                    <div className="q-box__question">
                                      <input type="radio" id="q_2" name="survey-questions" />
                                      <label>3 - 6 years</label>
                                    </div>

                                    <div className="q-box__question">
                                      <input type="radio" id="q_3" name="survey-questions" />
                                      <label>6 - 9 years</label>
                                    </div>

                                    <div className="q-box__question">
                                      <input type="radio" id="q_4" name="survey-questions" />
                                      <label>More than 10 years</label>
                                    </div>
                                  </div>
                                </div>

                                <div className="step">
                                  <h4>2.How long have you been working with Al Ghurair?</h4>
                                  <div className="form-check ps-0 q-box">
                                    <div className="q-box__question">
                                      <input type="radio" id="q_5" name="survey-questions" />
                                      <label>1 - 3 years</label>
                                    </div>

                                    <div className="q-box__question">
                                      <input type="radio" id="q_6" name="survey-questions" />
                                      <label>3 - 6 years</label>
                                    </div>

                                    <div className="q-box__question">
                                      <input type="radio" id="q_7" name="survey-questions" />
                                      <label>6 - 9 years</label>
                                    </div>

                                    <div className="q-box__question">
                                      <input type="radio" id="q_8" name="survey-questions" />
                                      <label>More than 10 years</label>
                                    </div>
                                  </div>
                                </div>

                                <div className="step">
                                  <h4>3.How long have you been working with Al Ghurair?</h4>
                                  <div className="form-check ps-0 q-box">
                                    <div className="q-box__question">
                                      <input type="radio" id="q_9" name="survey-questions" />
                                      <label>1 - 3 years</label>
                                    </div>

                                    <div className="q-box__question">
                                      <input type="radio" id="q_10" name="survey-questions" />
                                      <label>3 - 6 years</label>
                                    </div>

                                    <div className="q-box__question">
                                      <input type="radio" id="q_11" name="survey-questions" />
                                      <label>6 - 9 years</label>
                                    </div>

                                    <div className="q-box__question">
                                      <input type="radio" id="q_12" name="survey-questions" />
                                      <label>More than 10 years</label>
                                    </div>
                                  </div>
                                </div>
                                {/* <div id="success">
                                  <div className="mt-5">
                                    <h4>Success! We'll get back to you ASAP!</h4>
                                    <p>Meanwhile, clean your hands often, use soap and water, or an alcohol-based hand rub, maintain a safe distance from anyone who is coughing or sneezing and always wear a mask when physical distancing is not possible.</p>
                                    <a className="back-link" href="">Go back from the beginning ➜</a>
                                  </div>
                                </div> */}

                              </div>
                              <div id="q-box__buttons">
                                <button id="prev-btn" type="button" className="d-none">
                                  <i><svg id="Group_8057" data-name="Group 8057" xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 30 30">
                                    <g id="Ellipse_76" data-name="Ellipse 76" fill="rgba(157,14,113,0.05)" stroke="rgba(112,112,112,0.04)" stroke-width="1">
                                      <circle cx="15" cy="15" r="15" stroke="none" />
                                      <circle cx="15" cy="15" r="14.5" fill="none" />
                                    </g>
                                    <path id="Path_73923" data-name="Path 73923" d="M30.211,13.153a.56.56,0,1,1,.768.814l-4.605,4.35,4.605,4.35a.56.56,0,1,1-.768.814l-5.036-4.756a.56.56,0,0,1,0-.814l5.036-4.756Z" transform="translate(-13.155 -3)" fill="#9d0e71" />
                                  </svg>
                                  </i>
                                  Previous

                                </button>
                                <button id="next-btn" type="button" className="d-inline-block">Next
                                  <i><svg id="Group_8056" data-name="Group 8056" xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 30 30">
                                    <g id="Ellipse_76" data-name="Ellipse 76" fill="rgba(157,14,113,0.05)" stroke="rgba(112,112,112,0.04)" stroke-width="1">
                                      <circle cx="15" cy="15" r="15" stroke="none" />
                                      <circle cx="15" cy="15" r="14.5" fill="none" />
                                    </g>
                                    <path id="Path_73923" data-name="Path 73923" d="M25.944,13.153a.56.56,0,1,0-.768.814l4.605,4.35-4.605,4.35a.56.56,0,1,0,.768.814l5.036-4.756a.56.56,0,0,0,0-.814l-5.036-4.756Z" transform="translate(-13 -3)" fill="#9d0e71" />
                                  </svg></i>
                                </button>
                                <button id="submit-btn" type="submit" className="d-none">Submit</button>
                              </div>
                            </form>
                          </div>


                        </div>
                      </div>
                    </div>
                  </div>

                </div>
              </div>
            </div>
          </div>
        </div>
      </div>


    );
  }


  public render(): React.ReactElement<IAgiIntranetHomeMainProps> {
    return (
      <div className={styles.agiIntranetHomeMain}>
        {this.renderContactUsContentSection()}
      </div>
    );
  }
}


