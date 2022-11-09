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
import { IFunctionData } from '../models/IFunctionData';
import AnnouncementCard from './AnnouncementCard/AnnouncementCard';
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
      filteredAnnouncementData: [],
      featuredAnnouncements: [],
      exceptionOccured: false,
      currentPage: 1,
      totalPage: 0,
      currentPageAnnouncementData: [],
      filterValues: [],
      businessData: [],
      functionData: [],
      itemsPerPage: 0,
      showBusinessData: true,
      selectedOption: {
        ID: 0
      },
      featuredTitle: '',
      announcementsTitle:''
    }
  }
  async componentDidMount(): Promise<void> {
    try {
      const announcements: IAnnouncementData[] = await this._spServices.getAnnouncements();
      const business: IBusinessData[] = await this._spServices.getBussiness();
      const functions: IFunctionData[] = await this._spServices.getFunctionData();
      await this.getTitle();
      //console.log(announcements);
      const featuredTitle: string = await this._spServices.getConfigItems();
      this.setState({
        totalAnnouncementData: announcements,
        featuredAnnouncements: this.getFeaturedAnnouncements(announcements),
        filteredAnnouncementData: announcements,
        businessData: business,
        functionData: functions,
        featuredTitle: featuredTitle
      });
      this.getFirstPageAnnouncements();

      if (window.innerWidth <= 767) {
        this.setState({
          itemsPerPage: 6
        });

      } else {
        this.setState({
          itemsPerPage: 12
        });
      }

      this.setDefaultFilter();
    }
    catch (exception) {
      this.setState({
        exceptionOccured: true
      });
    }
  }
  private async getTitle():Promise<void>{
    sp.web.lists.getByTitle('TitleConfig').items.select('Header').filter("Title eq 'Announcements Title'").get()
    .then((data)=>{
      console.log("Title",data)
      this.setState({
        announcementsTitle:data[0].Header
      
      });

    })
  }

  private getFeaturedAnnouncements(items: IAnnouncementData[]) {
    let dateA;
    let dateB;
    return items.filter((item) => item.Featured).sort((a, b) => {
      dateA = a.PublishedDate || a.Modified;
      dateB = b.PublishedDate || b.Modified;
      return (new Date(dateB).getTime() - new Date(dateA).getTime())
    }).slice(0, 4)
  }

  private setDefaultFilter() {
    const params = new URLSearchParams(window.location.search);
    const programId = parseInt(params.get('programId')) || 0;
    const program = params.get('program');
    this.setState({
      showBusinessData: !(program?.toLowerCase() === "functions"),
      selectedOption: {
        ID: programId
      }
    }, () => {
      this.handleFilter(programId);
    });
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
    var element = document.getElementById("announcementContent");
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
  private paging() {

    const pageCount: number = Math.ceil(this.state.filteredAnnouncementData.length / this.state.itemsPerPage);
    const totalPages = (this.state.filteredAnnouncementData.length / this.state.itemsPerPage) - 1;
    //console.log('totalPages', pageCount);l
    // this.setState({
    //   images
    // });
    this.setState({
      currentPageAnnouncementData: this.state.filteredAnnouncementData.slice(0, this.state.itemsPerPage),
      totalPage: pageCount,
      currentPage: 1
    }, () => {
      console.log("totalpage", this.state.totalPage);
    });

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

  private handleFilter(value: number) {
    if (value == 0) {
      const result: IAnnouncementData[] = this.state.totalAnnouncementData.filter((obj) => {
        const itemId = this.state.showBusinessData ? obj.Business?.ID : obj.Functions?.ID;
        return typeof itemId !== "undefined";
      });
      this.setState({
        filteredAnnouncementData: result
      }, () => {
        this.paging();
        //this.getFirstPageAnnouncements();
      });

    } else {
      const result = this.state.totalAnnouncementData.filter((obj) => {
        const itemId = this.state.showBusinessData ? obj.Business?.ID : obj.Functions?.ID;
        return itemId == value;
      })
      this.setState({
        filteredAnnouncementData: result
      }, () => {
        this.paging();
        //this.getFirstPageAnnouncements();
      });
    }
    this.setState({
      selectedOption: {
        ID: value
      }
    })
  }

  private onSelectFilterBy(filterBy: string) {
    this.setState({
      showBusinessData: (filterBy === "Business"),
      selectedOption: {
        ID: 0
      }
    }, () => {
      this.handleFilter(0);
    })
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

    const options: IBusinessData[] | IFunctionData[] = this.state.showBusinessData ? this.state.businessData : this.state.functionData;

    return (
      <>
        <section className="featured-section col-lg-12 mt-5 ">
          <div className="container">
            <div className="row title-wrapper">
              <div className="main-header-section">
                <div className="col-12">
                  <h3>{this.state.featuredTitle}</h3>
                </div>

              </div>
            </div>

            <div className="row featured-carousel">
              <div id="featuredCarousel" className="carousel slide" data-bs-interval="false" data-bs-ride="carousel">
                <div className="carousel-inner" role="listbox">
                  {
                    this.state.featuredAnnouncements.map((item: IAnnouncementData, index: number) => {
                      const category = item.Business ? item.Business : item.Functions;

                      return (
                        <div className={`carousel-item ${!index ? 'active' : ''}`}>
                          <div className="col-md-3 h-100">
                            <AnnouncementCard imageUrl={this.getImageUrl(item)} siteUrl={this.props.siteUrl} isFeatured={true} announcement={item} category={category}></AnnouncementCard>
                          </div>
                        </div>
                      )
                    })
                  }
                  {
                    !this.state.featuredAnnouncements.length && <h5 className="not-found">No items found</h5>
                  }

                </div>
                {
                  this.state.featuredAnnouncements.length>0 && <>
                  <button className="carousel-control-prev" type="button" data-bs-target="#featuredCarousel"
                  data-bs-slide="prev">
                  <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                  <span className="visually-hidden">Previous</span>
                </button>
                <button className="carousel-control-next" type="button" data-bs-target="#featuredCarousel"
                  data-bs-slide="next">
                  <span className="carousel-control-next-icon" aria-hidden="true"></span>
                  <span className="visually-hidden">Next</span>
                </button>
                </>
                }
                
              </div>
            </div>
          </div>
        </section>
        <div className="main-content" id='announcementContent'>
          <div className="content-wrapper">
            <div className="container">
              <div className="main-header-section">
                <div className={'row'} >
                  <div className={'col-12 col-md-6 heading-section'} >
                    <h3>{this.state.announcementsTitle}</h3>
                  </div>
                  <div className={'col-12 col-md-6 filter-section text-end'}>
                    <div className="row">
                      <div className="col-4 d-flex align-items-center justify-content-around">
                        <div className="form-check q-box__question">
                          <input className="form-check-input" type="radio" name="flexRadioDefault" id="flexRadioDefault1" checked={this.state.showBusinessData} onClick={() => { this.onSelectFilterBy('Business') }} />
                          <label className="form-check-label" htmlFor="flexRadioDefault1">
                            Business
                          </label>
                        </div>
                        <div className="form-check q-box__question">
                          <input className="form-check-input" type="radio" name="flexRadioDefault" id="flexRadioDefault2" checked={!this.state.showBusinessData} onClick={() => { this.onSelectFilterBy('Function') }} />
                          <label className="form-check-label" htmlFor="flexRadioDefault2">
                            Functions
                          </label>
                        </div>
                      </div>
                      <div className="col-8">
                        <div className={'form-select custom-select w-100 '}>
                          <select onChange={(e) => this.handleFilter(parseInt(e.target.value))}>
                            <option value="0">Filter By</option>
                            {
                              options.map((option: IBusinessData | IFunctionData, index: number) => {
                                return (
                                  <option selected={this.state.selectedOption.ID == option.ID} key={`optionkey${index}`} value={option.ID}>{option.Title}</option>
                                )
                              })
                            }
                          </select>
                        </div>
                      </div>
                    </div>


                  </div>
                </div>
              </div>
              <article className="row gx-5 mb-5">
                <section className="col-lg-12 announcement-listing">
                  <div className="row">
                    {
                      this.state.currentPageAnnouncementData.length > 0 ?
                        this.state.currentPageAnnouncementData.map((announcement) => {
                          const category = this.state.showBusinessData ? announcement.Business : announcement.Functions;
                          return (
                            <div className="col-lg-3 mb-4 d-flex align-items-stretch">
                              <AnnouncementCard siteUrl={this.props.siteUrl} imageUrl={this.getImageUrl(announcement)} announcement={announcement} category={category} isFeatured={false}></AnnouncementCard>
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
                <div className="d-flex justify-content-center justify-content-md-end">
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
      </>
    );
  }
}
