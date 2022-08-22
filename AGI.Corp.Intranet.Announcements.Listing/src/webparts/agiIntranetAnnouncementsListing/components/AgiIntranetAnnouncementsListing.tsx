import * as React from 'react';
import styles from './AgiIntranetAnnouncementsListing.module.scss';
import { IAgiIntranetAnnouncementsListingProps } from './IAgiIntranetAnnouncementsListingProps';
import { SPService } from '../services/SPService';
import { escape } from '@microsoft/sp-lodash-subset';
import { sp } from "@pnp/sp/presets/all";
import { IAgiIntranetEventsStates } from './IAgiIntranetAnnouncementsListingStates';
import { IAnnouncementData } from '../models/IAnnouncementData';
import Paging from './Paging/Paging';
import * as moment from 'moment';
const itemsPerPage: number = 8;

export default class AgiIntranetAnnouncementsListing extends React.Component<IAgiIntranetAnnouncementsListingProps, IAgiIntranetEventsStates> {
  private _spServices: SPService;
  constructor(props: IAgiIntranetAnnouncementsListingProps) {
    super(props);
    this._spServices = new SPService(this.props.context);
    sp.setup({
      spfxContext: this.props.context
    })
    this.state = {
      totalAnnouncementData: [],
      exceptionOccured: false,
      currentPage: 1,
      totalPage: 0,
      currentPageAnnouncementData: [],
    }
  }
  async componentDidMount(): Promise<void> {
    try {
      const announcements: IAnnouncementData[] = await this._spServices.getAnnouncements();
      this.setState({
        totalAnnouncementData: announcements
      });
      this.getFirstPageAnnouncements();
    }
    catch (exception) {
      this.setState({
        exceptionOccured: true
      });
    }
  }
  private getImageUrl(announcementItem: IAnnouncementData): string {
    try {
      let imageJSON = { serverRelativeUrl: "" }
      if (announcementItem.AnnouncementThumbnail != null) {
        imageJSON = JSON.parse(announcementItem.AnnouncementThumbnail);
        return imageJSON.serverRelativeUrl;
      }
    }
    catch (exception) {
      this.setState({
        exceptionOccured: true
      });
    }
  }

  private scrollToTop(): void {
    var element = document.getElementById("spPageCanvasContent");
    element.scrollIntoView(true);
  }

  private getFirstPageAnnouncements() {
    try {
      const totalPage: number = Math.ceil(this.state.totalAnnouncementData.length / itemsPerPage);
      this.setState({
        currentPageAnnouncementData: this.state.totalAnnouncementData.slice(0, itemsPerPage),
        totalPage,
        currentPage: 1
      })
    }
    catch (exception) {
      this.setState({
        exceptionOccured: true
      });
    }
  }

  private _getSelectedPageAnnouncements(selectedPageNumber: number) {
    try {
      // round a number up to the next largest integer.
      const skipItems: number = itemsPerPage * (selectedPageNumber - 1);
      const takeItems: number = skipItems + itemsPerPage;

      //console.log('page', page);
      const roundupPage = Math.ceil(selectedPageNumber);
      const currentPageAnnouncementData = this.state.totalAnnouncementData.slice(skipItems, takeItems)
      this.setState({
        currentPageAnnouncementData,
        currentPage: selectedPageNumber
      }, () => {
        this.scrollToTop();
      });
    }
    catch (exception) {
      this.setState({
        exceptionOccured: true
      });
    }
  }

  public render(): React.ReactElement<IAgiIntranetAnnouncementsListingProps> {

    const {
      description,
      isDarkTheme,
      environmentMessage,
      hasTeamsContext,
      userDisplayName
    } = this.props;
    if (this.state.exceptionOccured) {
      throw new Error('Something went wrong');
    }
    return (
      <div className="main-content">
        <div className="content-wrapper">
          <div className="container">
            <div className="main-header-section">
              <div className="row ">
                <div className="col-12">
                  <h3>Announcements</h3>
                </div>

              </div>
            </div>
            <article className="row gx-5 mb-5">
              <section className="col-lg-12 announcement-listing">
                <div className="row">
                  {
                    this.state.currentPageAnnouncementData.map((announcement) => {
                      return (
                        <div className="col-lg-3 mb-4 d-flex align-items-stretch">
                          <div className="card news-card">
                            <img src={this.getImageUrl(announcement)} className="card-img-top" alt="Card Image" />
                            <div className="card-body d-flex flex-column">
                              <div className="mb-3 card-content-header">
                                <h5 className="card-title">{announcement.Title}</h5>
                              </div>
                              <div className="news-details">
                                <span><i><img src={`${this.props.siteUrl}/Assets/icons/Date.svg`} alt="" /></i> {moment(announcement.PublishedDate).format('DD MMM YYYY')}</span>
                                <span><i><img src={`${this.props.siteUrl}/Assets/icons/icon-tag.svg`} alt="" /></i> {announcement.Business ? announcement.Business.Title : ""}</span>
                              </div>
                              <p className="card-text">{announcement.Description}</p>
                              <a href={`${this.props.siteUrl}/SitePages/Announcements/Events/Event Details.aspx?announcementID=${announcement.ID}`} className="btn news-read-more  align-self-start">Read more</a>
                              <a href="#" className="btn news-read-more mt-auto align-self-start">View Full Article</a>
                            </div>
                          </div>
                        </div>
                      )
                    })
                  }
                </div>
              </section>
            </article>
            <div className="col-12">
              <div className="d-flex justify-content-end">
                <div className={'pagination-wrapper'} style={{ display: this.state.totalPage > 0 ? 'block' : 'none' }} >
                  <Paging currentPage={this.state.currentPage}
                    totalItems={this.state.totalAnnouncementData.length}
                    itemsCountPerPage={itemsPerPage}
                    onPageUpdate={(selectedPageNumber) => this._getSelectedPageAnnouncements(selectedPageNumber)}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
