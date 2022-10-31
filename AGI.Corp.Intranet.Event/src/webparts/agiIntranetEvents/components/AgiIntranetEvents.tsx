import * as React from 'react';
import { IAgiIntranetEventsProps } from './IAgiIntranetEventsProps';
//require('../CSS/Styles.css');
import { IEventData } from '../Model/IEventData';
import { IAgiIntranetEventsStates } from './IAgiIntranetEventsStates';
import {
  SPHttpClient,
  SPHttpClientResponse
} from '@microsoft/sp-http';
import * as moment from 'moment';
import Paging from './Paging/Paging';
import { EVENTS, TABS } from '../common/constants';
import EventCard from './EventCard/EventCard';


export default class AgiIntranetEvents extends React.Component<IAgiIntranetEventsProps, IAgiIntranetEventsStates> {
  constructor(props) {
    super(props);
    this.state = {
      eventsData: [],
      featuredEvents: [],
      currentPage: 1,
      totalPage: 0,
      pageData: [],
      filterValuesBusiness: [],
      filterValuesFunctions: [],
      selectedTab: "",
      filterData: [],
      upcomingEvents: [],
      pastEvents: [],
      selectedTabValues: [],
      selectedFilter: 0,
      pageSize: 0,
      showBusinessData: true,
      selectedOption: {
        ID: 0
      },
      guid: "",
      featuredTitle: ''
    }
  }

  public async componentDidMount(): Promise<void> {
    this.fetch();
  }

  private getConfigItems() {
    const url = `${this.props.siteUrl}/_api/web/lists/getbytitle('IntranetConfig')/items?$filter=(Title eq 'FeaturedEvents')&$top=1`;
    this.props.context.spHttpClient.get(url, SPHttpClient.configurations.v1)
      .then((response: SPHttpClientResponse) => {
        return response.json();
      })
      .then((response) => {
        const items = response.value;

        this.setState({
          featuredTitle: items[0]?.Detail
        });

      })
      .catch((error) => {
        console.log('Error:', error);
      })
  }

  private async fetch() {
    await this.getBusinessItems();
    await this.getFunctionItems();
    await this.getConfigItems();
    await this.getListGuid('EventDetails').then(async (guid: string): Promise<void> => {
      this.setState({
        guid
      });
      await this.getNewsItems().then(() => {
        this.setDefaultFilter();
      })
    })
  }

  private async getListGuid(listname: string): Promise<string> {
    const url = `${this.props.siteUrl}/_api/web/lists/getbytitle('${listname}')`;
    return await this.props.context.spHttpClient.get(url, SPHttpClient.configurations.v1)
      .then((response: SPHttpClientResponse) => {
        return response.json();
      })
      .then((response) => {
        return response.Id;
      })
      .catch((error) => {
        console.log('Error:', error);
      })
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

  private async getBusinessItems(): Promise<void> {
    const url = `${this.props.siteUrl}/_api/web/lists/getbytitle('Business')/items`;
    this.props.context.spHttpClient.get(url, SPHttpClient.configurations.v1)
      .then((response: SPHttpClientResponse) => {
        return response.json();
      })
      .then((response) => {
        const items = response.value;

        console.log('choices', items);
        this.setState({
          filterValuesBusiness: items,
          selectedFilter: 0
        });

      })
      .catch((error) => {
        console.log('Error:', error);
      })
    //console.log('screen width',window.innerWidth);
    if (window.innerWidth <= 767) {
      this.setState({
        pageSize: 6
      });

    } else {
      this.setState({
        pageSize: 12
      });

    }

    /*if(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)){
      //document.write("mobile");
      this.setState({
        pageSize:6
      });
    }else{
      //document.write("not mobile");
      this.setState({
        pageSize:12
      });
    }*/
    // const select= this.getQueryStringValue('tab');
    //     console.log('current tab', select);
    //     //const selectedTab = select || this.state.selectedTab;
    //   if(select){
    //     this.setState({
    //       selectedTab:select
    //     })
    //   }

  }

  private async getFunctionItems(): Promise<void> {
    const url = `${this.props.siteUrl}/_api/web/lists/getbytitle('Functions')/items`;
    this.props.context.spHttpClient.get(url, SPHttpClient.configurations.v1)
      .then((response: SPHttpClientResponse) => {
        return response.json();
      })
      .then((response) => {
        const items = response.value;

        this.setState({
          filterValuesFunctions: items,
          selectedFilter: 0
        });

      })
      .catch((error) => {
        console.log('Error:', error);
      })

    if (window.innerWidth <= 767) {
      this.setState({
        pageSize: 6
      });

    } else {
      this.setState({
        pageSize: 12
      });

    }

  }

  private getFeaturedEvents(items) {
    let dateA;
    let dateB;
    return items.filter((item) => item.Featured).sort((a, b) => {
      dateA = a.StartDate || a.Modified;
      dateB = b.StartDate || b.Modified;
      return (new Date(dateA).getTime() - new Date(dateB).getTime())
    }).slice(0, 4)
  }

  private async getNewsItems(): Promise<void> {
    return new Promise<void>(async (resolve) => {
      const list = 'EventDetails';
      const counturl = `${this.props.siteUrl}/_api/web/lists/getbytitle('${list}')/ItemCount`;
      const count = await this.props.context.spHttpClient.get(counturl, SPHttpClient.configurations.v1)
        .then((resp: SPHttpClientResponse) => {
          return resp.json();
        }).then((resp) => {
          return resp.value;
        });

      const url = `${this.props.siteUrl}/_api/web/lists/getbytitle('${list}')/items?$select=ID,Title,Description,StartDate,EndDate,EventThumbnail,Country,City,Business/ID,Business/Title,Functions/ID,Functions/Title,Featured&$expand=Business,Functions&$orderby=StartDate asc&$top=${count}`;
      await this.props.context.spHttpClient.get(url, SPHttpClient.configurations.v1)
        .then((response: SPHttpClientResponse) => {
          return response.json();
        })
        .then((response) => {
          const items: IEventData[] = response.value;
          // console.log("data",this.state.eventsData);
          //const select= this.getQueryStringValue('tab');
          //const categories = this.state.filterValues;
          //const selectedTab = select || this.state.selectedTab;
          console.log("data", items);

          const upcoming: IEventData[] = items.filter((item) => {
            if (moment().isBefore(item.StartDate)) {
              return (item);
            }
          })
          const past: IEventData[] = items.filter((item) => {

            if (moment().isAfter(item.StartDate) && item.EndDate == null || moment().isAfter(item.EndDate)) {
              console.log('entering past');
              return (item);
            }
          })

          this.setState({
            eventsData: items,
            featuredEvents: this.getFeaturedEvents(upcoming),
            filterData: upcoming,
            selectedTab: "Upcoming Events",
            upcomingEvents: upcoming,
            pastEvents: past,
            selectedTabValues: upcoming

          })

          this.paging();


        })
        .catch((error) => {
          console.log('Error:', error);
        })

      resolve();
    });
  }
  private handleFilter(value: number) {
    if (value == 0) {
      const result: IEventData[] = this.state.selectedTabValues.filter((obj) => {
        const itemId = this.state.showBusinessData ? obj.Business?.ID : obj.Functions?.ID;
        return typeof itemId !== "undefined";
      });

      console.log('filter', result);
      this.setState({
        filterData: result,
        selectedFilter: value
      }, () => {
        this.paging();
      });

    } else {
      const result = this.state.selectedTabValues.filter((obj) => {
        const itemId = this.state.showBusinessData ? obj.Business?.ID : obj.Functions?.ID;
        return itemId == value;
      })

      this.setState({
        filterData: result,
        selectedFilter: value
      }, () => {
        this.paging();
      });


    }

    this.setState({
      selectedOption: {
        ID: value
      }
    })
  }

  private handleTab(e: any) {
    const value = e.target.value;

    //  const result = this.state.eventsData.filter((obj) => {
    //     if(value==)
    //     return obj.Category === value;
    //   })

    this.setTabData(value);


  }


  private selectTab(e: any) {

    const collection = document.getElementsByClassName("event-tabs");
    for (let i = 0; i < collection.length; i++) {
      (collection[i] as any).classList.remove('active');
    }
    const element = e.target;
    element.classList.add('active');
    const id = e.target.id;
    this.setTabData(id);

    // const result: IEventData[] = this.state.eventsData.filter((obj) => {
    //   return obj.Category === id;

    // })
    // this.setState({
    //   filterData: result,
    //   selectedTab: id

    // }, () => {
    //   this.paging();
    // });

    /*
       const collection1 = document.getElementsByClassName("nav-link");
    for (let i = 0; i < collection1.length; i++) {
      const container = collection1[i] as any;
      container.classList.remove('selected');
      const dataId=container.attributes['data-id'].value;
      if(dataId==id){
        container.classList.add('selected');
      }
    
    }*/
  }

  private setTabData(tabName: string) {
    let selectedTabValues = [];

    if (tabName == EVENTS.UPCOMING) {
      selectedTabValues = this.state.upcomingEvents
    }
    else if (tabName == EVENTS.PAST) {
      selectedTabValues = this.state.pastEvents
    }
    console.log("selectedtab", selectedTabValues);

    if (this.state.selectedFilter == 0) {
      this.setState({
        selectedTabValues,
        filterData: selectedTabValues
      }, () => {
        this.onSelectFilterBy(this.state.showBusinessData ? 'Business' : 'Functions');
        // this.paging();
      });

    } else {
      const result = selectedTabValues.filter((obj) => {
        const itemId = this.state.showBusinessData ? obj.Business?.ID : obj.Functions?.ID;
        return itemId == this.state.selectedFilter;
      })
      this.setState({
        selectedTabValues,
        filterData: result
      }, () => {
        this.paging();
      });
    }

  }

  private paging() {
    const pageCount: number = Math.ceil(this.state.filterData.length / this.state.pageSize);
    const totalPages = (this.state.filterData.length / this.state.pageSize) - 1;
    //console.log('totalPages', pageCount);
    // this.setState({
    //   images
    // });
    this.setState({
      pageData: this.state.filterData.slice(0, this.state.pageSize),
      totalPage: pageCount,
      currentPage: 1
    }, () => {
      console.log('filterData', this.state.filterData);
      console.log('pageData', this.state.pageData);
    });

  }
  private _getPage(page: number) {
    // round a number up to the next largest integer.
    const skipItems: number = this.state.pageSize * (page - 1);
    const takeItems: number = skipItems + this.state.pageSize;

    //console.log('page', page);
    const roundupPage = Math.ceil(page);
    // const images = this.state.allImages.slice(roundupPage, (roundupPage * pageSize));
    const pageData = this.state.filterData.slice(skipItems, takeItems)
    this.setState({
      pageData,
      currentPage: page
    }, () => {
      this.scrollToTop();

    });
  }
  private scrollToTop(): void {

    var element = document.getElementById("spPageCanvasContent");

    element.scrollIntoView(true);

  }
  // private getQueryStringValue(param: string): string {
  //   const params = new URLSearchParams(window.location.search);
  //   let value = params.get(param) || '';
  //   return value;
  // }

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

  public render(): React.ReactElement<IAgiIntranetEventsProps> {
    const tabs = TABS;
    //console.log('selected tab', this.state.selectedTab);
    //console.log(this.state.pageData);

    const filterValues = this.state.showBusinessData ? this.state.filterValuesBusiness : this.state.filterValuesFunctions;

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
                    this.state.featuredEvents.map((item: IEventData, index: number) => {
                      const imageUrl = JSON.parse(item.EventThumbnail)?.serverRelativeUrl;
                      const category = item.Business ? item.Business?.Title : item.Functions?.Title;

                      return (
                        <div className={`carousel-item ${!index ? 'active' : ''}`}>
                          <div className="col-md-3 h-100">
                            <EventCard imageUrl={imageUrl} item={item} siteUrl={this.props.siteUrl} guid={this.state.guid} selectedTab={this.state.selectedTab} isFeatured={true}></EventCard>
                          </div>
                        </div>
                      )
                    })
                  }
                  {
                    !this.state.featuredEvents.length && <h5 className="not-found">No items found</h5>
                  }
                </div>
                {
                  this.state.featuredEvents.length>0 && <>
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
        <div className={'main-content'} id='eventsTab'>
          <div className={'content-wrapper'}>
            <div className={'container'}>
              <div className={'tabs'}>
                <div className={'tab-header'} id='eventsTab' >
                  <div className={'row '} >
                    <div className={'col-12 col-md-6 d-none d-md-block heading-section'}>

                      <ul className={'nav nav-tabs event-tabs'} id="myTab" role="tablist">
                        {
                          tabs.map((tab, i) => {
                            return (
                              <li className={'nav-item'} role="presentation">
                                <button className={this.state.selectedTab == tab ? `nav-link active` : `nav-link`}
                                  id={tab} data-bs-toggle="tab" data-bs-target="#ongoing-events"
                                  type="button" role="tab" aria-controls="ongoing-events"
                                  aria-selected="true" onClick={(e) => this.selectTab(e)}>
                                  {tab}
                                </button>
                              </li>

                            )
                          })
                        }
                      </ul>
                    </div>
                    <div className={'col-12  col-md-6 d-block d-md-none mobileTab'}>
                      <select onChange={(e) => this.handleTab(e)} className={'nav nav-tabs'} id="myTab" role="tablist" >
                        {
                          tabs.map((tab, i) => {
                            return (
                              <option value={tab}>{tab}</option>
                            )
                          })
                        }
                      </select>
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
                              <option value='0'>Filter By</option>
                              {
                                filterValues.map((option) => {
                                  return (
                                    <option selected={this.state.selectedOption.ID == option.ID} value={option.ID}>{option.Title}</option>
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
                <div className={'tab-content'}>
                  <div className={'tab-pane fade show active'}>
                    <div className={'row'}>
                      {
                        this.state.pageData.length > 0 ?
                          this.state.pageData.map((item) => {
                            let imageJSON = { serverRelativeUrl: "" }
                            if (item.EventThumbnail != null) {
                              imageJSON = JSON.parse(item.EventThumbnail);
                            }
                            //console.log("END DATE " + item.EndDate);
                            return (

                              <div className={'col-lg-3 mb-4 d-flex align-items-stretch'}>
                                <EventCard imageUrl={imageJSON.serverRelativeUrl} item={item} siteUrl={this.props.siteUrl} guid={this.state.guid} selectedTab={this.state.selectedTab} isFeatured={false}></EventCard>
                              </div>

                            )
                          })
                          :
                          <div className={'invalidTxt'}>
                            <p>NO EVENTS</p>
                          </div>

                      }
                    </div>
                  </div>
                </div>
              </div>
              <div className={'pagination-wrapper'} style={{ display: this.state.totalPage > 0 ? 'block' : 'none' }} >
                {/* <Pagination
                currentPage={this.state.currentPage}
                totalPages={this.state.totalPage}
                onChange={(page) => this._getPage(page)}
                limiter={5}
                //hideFirstPageJump={false}
              /> */}
                <Paging currentPage={this.state.currentPage}
                  totalItems={this.state.filterData.length}
                  itemsCountPerPage={this.state.pageSize}
                  onPageUpdate={(page) => this._getPage(page)}
                />
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }
}
