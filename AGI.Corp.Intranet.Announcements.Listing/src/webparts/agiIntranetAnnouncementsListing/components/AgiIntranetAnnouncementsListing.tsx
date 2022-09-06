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
import { IBusinessData } from '../models/IBusinessData';
const itemsPerPage: number = 12;

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
      filteredAnnouncementData:[],
      exceptionOccured: false,
      currentPage: 1,
      totalPage: 0,
      currentPageAnnouncementData: [],
      filterValues: [],
      businessData: []
    }
  }
  async componentDidMount(): Promise<void> {
    try {
      const announcements: IAnnouncementData[] = await this._spServices.getAnnouncements();
      const business: IBusinessData[] = await this._spServices.getBussiness();
      this.setState({
        totalAnnouncementData: announcements,
        filteredAnnouncementData:announcements,
        businessData: business
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
      const totalPage: number = Math.ceil(this.state.filteredAnnouncementData.length / itemsPerPage);
      this.setState({
        currentPageAnnouncementData: this.state.filteredAnnouncementData.slice(0, itemsPerPage),
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
      const currentPageAnnouncementData = this.state.filteredAnnouncementData.slice(skipItems, takeItems)
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

  private filterAnnouncementByBusiness(e: any) {
    const value = parseInt(e.target.value);
    if (value == 0) {
      const result: IAnnouncementData[] = this.state.totalAnnouncementData;
      this.setState({
        filteredAnnouncementData: result
      }, () => {
        this.getFirstPageAnnouncements();
      });

    } else {
      const result = this.state.totalAnnouncementData.filter((obj) => {
        return obj.Business.ID == value;
      })
      this.setState({
        filteredAnnouncementData: result
      }, () => {
        this.getFirstPageAnnouncements();
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
      <div className="main-content" id='announcementContent'>
        <div className="content-wrapper">
          <div className="container">
            <div className="main-header-section">
              <div className={'row'} >
                <div className={'col-12 col-md-6 heading-section'} >
                  <h3>Announcements</h3>
                </div>
                <div className={'col-12 col-md-6 filter-section text-end'}>
                  <div className={'form-select custom-select '}>
                    <select onChange={(e) => this.filterAnnouncementByBusiness(e)}>
                      <option value="0">Filter By</option>
                      {
                        this.state.businessData.map((business) => {
                          return (
                            <option value={business.ID}>{business.Title}</option>
                          )
                        })
                      }
                    </select>
                  </div>
                </div>
              </div>
            </div>
            <article className="row gx-5 mb-5">
              <section className="col-lg-12 announcement-listing">
                <div className="row">
                  { 
                  this.state.currentPageAnnouncementData?
                    this.state.currentPageAnnouncementData.map((announcement) => {
                      return (
                        <div className="col-lg-3 mb-4 d-flex align-items-stretch">
                          <div className="card news-card">
                            <img src={this.getImageUrl(announcement)} className="card-img-top" alt="Card Image" />
                            <div className="card-body d-flex flex-column">
                            <div className={'category'}>
                            <span><i><img src={`${this.props.siteUrl}/Assets/icons/Tag.svg`} alt="" /></i> {announcement.Business ? announcement.Business.Title : ""}</span>
                              </div>
                              <div className="mb-2 mt-2 card-content-header">
                                <h5 className="card-title">{announcement.Title}</h5>
                              </div>
                              <div className="date">
                                <span><i><img src={`${this.props.siteUrl}/Assets/icons/Date-blue.svg`} alt="" /></i> {moment(announcement.PublishedDate).format('DD-MMM-YYYY')}</span>
                                
                              </div>
                              <p className="card-text mt-2">{announcement.Description}</p>
                              <a href={`${this.props.siteUrl}/SitePages/News/Announcements/Announcement Details.aspx?announcementID=${announcement.ID}`} className="btn news-read-more  align-self-start">Read more</a>
                            </div>
                          </div>
                        </div>
                      )
                    })
                    :
                    <div className={'invalidTxt'}>
                      NO ANNOUNCEMENTS
                      </div>
                  }
                </div>
              </section>
            </article>
            <div className="col-12">
              <div className="d-flex justify-content-end">
                <div className={'pagination-wrapper'} style={{ display: this.state.totalPage > 0 ? 'block' : 'none' }} >
                  <Paging currentPage={this.state.currentPage}
                    totalItems={this.state.filteredAnnouncementData.length}
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
