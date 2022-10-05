import * as React from 'react';
import styles from './AgiIntranetAboutMain.module.scss';
import { IAgiIntranetAboutMainProps } from './IAgiIntranetAboutMainProps';
import { escape } from '@microsoft/sp-lodash-subset';
import { sp } from '@pnp/sp/presets/all';
import { IAgiIntranetAboutMainState } from './IAgiIntranetAboutMainState';
import { IAboutUsItem } from '../models/IAboutUsItem';
import { ILeadershipMessageItem } from '../models/ILeadershipMessageItem';
import { ILeadershipTeamItem } from '../models/ILeadershipTeamItem';
import { IPurposeCultureVisionItem } from '../models/IPurposeCultureVisionItem';
import { LIST_ABOUT_LEADERSHIPMESSAGE, NULL_ABOUT_LEADERSHIPMESSAGE_ITEM, LIST_ABOUT_ABOUTUS, NULL_ABOUT_ABOUTUS_ITEM, LIST_ABOUT_PURPOSENCULTURE, NULL_ABOUT_PURPOSENCULTURE_ITEM, LIST_ABOUT_LEADERSHIPTEAM, NULL_ABOUT_LEADERSHIPTEAM_ITEM, TEXT_ABOUT_VISION_CONTENT, TEXT_ABOUT_PURPOSE_CONTENT, TEXT_ABOUT_CULTURE_NAVIGATION, TEXT_ABOUT_LEADERSHIP_TEAM_CONTENT, TEXT_ABOUT_LEADERSHIP_HEADING_CONTENT, NULL_SELECTED_ITEM } from '../common/constants';
import * as $ from 'jquery';

export default class AgiIntranetAboutMain extends React.Component<IAgiIntranetAboutMainProps, IAgiIntranetAboutMainState> {

  constructor(props: IAgiIntranetAboutMainProps) {
    super(props);
    sp.setup({
      spfxContext: this.props.context
    });
    this.state = {
      leadershipMessageItem: NULL_ABOUT_LEADERSHIPMESSAGE_ITEM,
      aboutUsItem: NULL_ABOUT_ABOUTUS_ITEM,
      leadershipTeamItems: [],
      purposeCultureVisionItems: [],
      selectedItem: NULL_SELECTED_ITEM,
      selectedVideoUrl: '',
      showVideo: false,
      readMore: {
        leadershipContent: false,
        aboutContent: false,
        ourCultureContent: false
      }
    }
  }

  public async componentDidMount(): Promise<void> {
    this.getAboutUsItem();
    this.getLeadershipMessageItem();
    this.getLeadershipTeamItem();
    this.getPurposeCultureVisionItem();
  }

  private async getAboutUsItem(): Promise<void> {

    sp.web.lists.getByTitle(LIST_ABOUT_ABOUTUS).items.get().then((items: IAboutUsItem[]) => {
      const aboutUsItem = items && items.length > 0 ? items[0] : NULL_ABOUT_ABOUTUS_ITEM;
      this.setState({
        aboutUsItem
      });
    });

  }

  private async getLeadershipMessageItem(): Promise<void> {

    sp.web.lists.getByTitle(LIST_ABOUT_LEADERSHIPMESSAGE).items.get().then((items: ILeadershipMessageItem[]) => {
      const leadershipMessageItem = items && items.length > 0 ? items[0] : NULL_ABOUT_LEADERSHIPMESSAGE_ITEM;
      this.setState({
        leadershipMessageItem
      });
    });

  }

  private async getLeadershipTeamItem(): Promise<void> {

    sp.web.lists.getByTitle(LIST_ABOUT_LEADERSHIPTEAM).items.get().then((items: ILeadershipTeamItem[]) => {
      this.setState({
        leadershipTeamItems: items
      }, () => {
        this.fnInitiate();
        this.renderScripts();
      });
    });
  }

  private async getPurposeCultureVisionItem(): Promise<void> {

    sp.web.lists.getByTitle(LIST_ABOUT_PURPOSENCULTURE).items.get().then((items: IPurposeCultureVisionItem[]) => {
      this.setState({
        purposeCultureVisionItems: items
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

  private renderFindOutMoreSection(): JSX.Element {

    const leadershipMessageImg = this.state.leadershipMessageItem.LeadershipImage && this.state.leadershipMessageItem.LeadershipImage ? this.getImageUrl(this.state.leadershipMessageItem.LeadershipImage) : '';

    const visionContentItems = this.state.purposeCultureVisionItems.filter(item => item.Title == TEXT_ABOUT_VISION_CONTENT);
    const purposeContentItems = this.state.purposeCultureVisionItems.filter(item => item.Title == TEXT_ABOUT_PURPOSE_CONTENT);
    const cultureContentItems = this.state.purposeCultureVisionItems.filter(item => item.Title == TEXT_ABOUT_CULTURE_NAVIGATION);
    const leadershipTeamHeading = this.state.leadershipTeamItems.filter(item => item.Category == TEXT_ABOUT_LEADERSHIP_HEADING_CONTENT);
    const leadershipTeamHeadingItem = leadershipTeamHeading.length > 0 ? leadershipTeamHeading[0] : null;
    const leadershipTeamItems = this.state.leadershipTeamItems.filter(item => item.Category == TEXT_ABOUT_LEADERSHIP_TEAM_CONTENT);

    return (

      //
      <div className="main-content about-us-wrapper">
        <div className="content-wrapper">
          <div className="container">
            <div className="section-wrapper">
              <div className="leadership-section">
                <div className="leadership-content">
                  <div className="leadership-content-header">
                    <h5>{this.state.leadershipMessageItem.Title}</h5>
                    <h3>{this.state.leadershipMessageItem.Name}</h3>
                    <h6>{this.state.leadershipMessageItem.Designation}</h6>
                  </div>
                  <div className="leadership-image">
                    <img src={leadershipMessageImg} className="w-100" />
                  </div>
                  <p dangerouslySetInnerHTML={{ __html: this.state.leadershipMessageItem.Description }}></p>
                  <div className={`more ${this.state.readMore.leadershipContent ? 'd-block' : ''}`}>
                    <p dangerouslySetInnerHTML={{ __html: this.state.leadershipMessageItem.MoreDescription }}></p>
                  </div>
                  {!this.state.readMore.leadershipContent && <button className="toggle" onClick={() => { this.showReadMore('leadership') }}>Read More</button>}
                </div>
              </div>
              <hr className="m-0 mx-5 divider-horizontal" />
              <div className="about-section">
                <div className="about-content">
                  <h5>{this.state.aboutUsItem.Title}</h5>
                  <h3>{this.state.aboutUsItem.Heading}</h3>
                  <p className={`${this.state.readMore.aboutContent ? 'show-more' : ''}`} dangerouslySetInnerHTML={{ __html: this.state.aboutUsItem.Description }}></p>
                  {!this.state.readMore.aboutContent && <button className="toggle1" onClick={() => { this.showReadMore('about') }}>Read More</button>}
                </div>
              </div>
            </div>
            <div className="row mx-0 vision-container">
              <div className="col-lg-4  p-0">
                {
                  visionContentItems.map((item, i) => {
                    return (
                      <div className="vision-img-wrapper">
                        <img src={`${this.props.siteUrl}/Assets/images/about/vision.png`} className="w-100" />
                        <div className="vision-content">
                          <h3>{item.Title}</h3>
                          <p dangerouslySetInnerHTML={{ __html: item.Description }}></p>
                        </div>
                      </div>
                    )
                  })
                }
              </div>
              <div className="col-lg-4  p-lg-0 our-purpose-section">
                {
                  purposeContentItems.map((item, i) => {
                    return (
                      <div className="our-purpose-wrapper">
                        <div className="our-purpose-content">
                          <h3>{item.Title}</h3>
                          <p dangerouslySetInnerHTML={{ __html: item.Description }}></p>
                        </div>
                      </div>
                    )
                  })
                }
              </div>
              <div className="col-lg-4  p-lg-0">
                {
                  cultureContentItems.map((item, i) => {
                    return (
                      <div className="our-culture-section">
                        <div className="our-culture-content">
                          <h3>{item.Title}</h3>
                          <p className={`${this.state.readMore.ourCultureContent ? 'show-more' : ''}`} dangerouslySetInnerHTML={{ __html: item.Description }}></p>
                          {!this.state.readMore.ourCultureContent && <button className="toggle2" onClick={() => { this.showReadMore('ourculture') }}>Read More</button>}
                        </div>
                      </div>
                    )
                  })
                }
              </div>
            </div>

            <div className="row mx-0 leadership-team-section">
              {
                leadershipTeamHeading.map((item, i) => {
                  return (
                    <div className="col-lg-11">
                      <h3 className="leadership-team-heading">{item.HeadingTitle}</h3>
                      <p className="leadership-team-description">{item.HeadingDescription}</p>
                    </div>
                  )
                })
              }
              <div className="align-self-end col-lg-1">
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
              <div id="leadershipCarousel" className="carousel js-carousel slide leadership-carousel"
                data-bs-ride="carousel">
                <div className="carousel-inner" role="listbox">
                  {
                    leadershipTeamItems.map((item, i) => {
                      const leadershipMessageImgVal = item.LeadershipImage && item.LeadershipImage ? this.getImageUrl(item.LeadershipImage) : '';
                      const subTitle = `${item.Designation},${item.Business}`
                        .split(',')
                        .join(', ');
                      return (
                        <div className={i == 0 ? `carousel-item js-carousel-item active` : `carousel-item js-carousel-item`} >
                          <div className="col-md-3 d-md-flex align-items-stretch">
                            <div className="team-card cardItem" key={i} data-id={item.ID}  >
                              <div className="team-img" >
                                <img src={leadershipMessageImgVal} alt="Card Design" className="w-100" />
                              </div>
                              <div className="team-content mt-3 mb-3">
                                <h2 className="team-title">{item.Name}</h2>
                                <h2 className="team-subtitle">{subTitle}</h2>
                                {/* <button type="button" className="view-profile" data-bs-toggle="modal"
                                data-bs-target="#viewProfileModal" onClick={() => this.openVideo(item.ID)}>
                                Read More
                              </button> */}
                                <input type="button" className="view-profile" onClick={() => this.showLeaderDetail(item.ID)} value='View Profile' />

                                {/* <a href="javascript:void(0)" className="view-profile" data-bs-toggle="modal" >View
                                  Profile <span><img src={`${this.props.siteUrl}/Assets/images/icon-view-more.svg`} alt="" /></span></a> */}
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
        </div>
      </div >

    );

  }

  private showReadMore(type: string) {
    if (type === 'leadership') {
      this.setState({
        readMore: {
          ...this.state.readMore,
          leadershipContent: true
        }
      });
    }
    else if (type === 'about') {
      this.setState({
        readMore: {
          ...this.state.readMore,
          aboutContent: true
        }
      });
    }
    else if (type === 'ourculture') {
      this.setState({
        readMore: {
          ...this.state.readMore,
          ourCultureContent: true
        }
      });
    }
  }


  private showLeaderDetail(id: number) {
    const selectedItem = this.state.leadershipTeamItems.filter(item => item.ID == id)[0];
    this.setState({
      selectedItem,
      showVideo: true
    });
  }

  private closeLeaderModal() {
    this.setState({
      showVideo: false
    });
  }

  private closePreview() {
    this.setState({
      showVideo: false,
      selectedVideoUrl: ''
    });
  }

  private fnInitiate() {
    let items = document.querySelectorAll("#leadershipCarousel .carousel-item");
    // console.log(items);
    items.forEach((el) => {
      const minPerSlide = 4;
      let next = el.nextElementSibling;
      for (var i = 1; i < minPerSlide; i++) {
        if (!next) {
          // wrap carousel by using first child
          next = items[0];
        }
        let cloneChild: any = next.cloneNode(true);
        el.appendChild(cloneChild.children[0]);
        next = next.nextElementSibling;
      }
    });
  }

  private renderScripts(): void {
    const reacthandler = this;
    $(document).on('click', '.cardItem', function () {
      const element = $(this);
      const id = element.attr('data-id');
      // get leader details
      const selectedItem = reacthandler.state.leadershipTeamItems.filter((item: any) => item.ID == id)[0];
      reacthandler.setState({
        selectedItem,
        showVideo: true
      });
    })
  }

  public render(): React.ReactElement<IAgiIntranetAboutMainProps> {
    const { selectedItem } = this.state;
    const leadershipImgVal = this.getImageUrl(selectedItem.LeadershipImage);
    return (
      <div className={styles.agiIntranetAboutMain}>
        {this.renderFindOutMoreSection()}
        {/* {this.fnInitiate()} */}
        <div className={this.state.showVideo ? "modal show overlay" : "modal fade overlay"} id="viewProfileModal" aria-labelledby="exampleModalLabel"
          aria-hidden="true" style={{ display: this.state.showVideo ? 'block' : 'none' }}>
          <div className={this.state.showVideo ? "modal show" : "modal fade"} id="viewProfileModal" aria-labelledby="exampleModalLabel" aria-hidden="true" style={{ display: this.state.showVideo ? 'block' : 'none' }} >
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
                        <b id="leadershipName">{selectedItem.Name}</b> <br />
                        <span id="leadershipDesignation">{selectedItem.Designation}</span> <br />
                        <span id="leadershipBusiness">{selectedItem.Business}</span>
                      </p>
                    </div>
                    <div className="view-profile-content col-lg-8" id="leadershipDetail" dangerouslySetInnerHTML={{ __html: selectedItem.About }}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}





