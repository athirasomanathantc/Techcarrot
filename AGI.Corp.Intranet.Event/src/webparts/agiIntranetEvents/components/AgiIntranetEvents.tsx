import * as React from 'react';
import styles from './AgiIntranetEvents.module.scss';
import { IAgiIntranetEventsProps } from './IAgiIntranetEventsProps';
import { escape } from '@microsoft/sp-lodash-subset';
//require('../CSS/Styles.css');
import { IEventData } from '../Model/IEventData';
import { IAgiIntranetEventsStates } from './IAgiIntranetEventsStates';
import {
  SPHttpClient,
  SPHttpClientResponse,
  IHttpClientOptions
} from '@microsoft/sp-http';
import * as moment from 'moment';
import { Pagination } from '@pnp/spfx-controls-react/lib/pagination';
import Paging from './Paging/Paging';
import { EVENTS, TABS } from '../common/constants';
//const pageSize: number = 12;


export default class AgiIntranetEvents extends React.Component<IAgiIntranetEventsProps, IAgiIntranetEventsStates> {
  constructor(props) {
    super(props);
    this.state = {
      eventsData: [],
      currentPage: 1,
      totalPage: 0,
      pageData: [],
      filterValues: [],
      selectedTab: "",
      filterData: [],
      ongoingEvents: [],
      upcomingEvents: [],
      pastEvents: [],
      selectedTabValues: [],
      selectedFilter: 0,
      pageSize:0
    }
  }

  public async componentDidMount(): Promise<void> {
    this.fetch();
  }

  private async fetch() {
    await this.getBusinessItems();
    await this.getNewsItems();
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
          filterValues: items,
          selectedFilter: 0
        });

      })
      .catch((error) => {
        console.log('Error:', error);
      })
      //console.log('screen width',window.innerWidth);
      if (window.innerWidth<=767){
        this.setState({
          pageSize:6
        });

      }else{
        this.setState({
          pageSize:12
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

  private async getNewsItems(): Promise<void> {
    const list='EventDetails';
    const counturl = `${this.props.siteUrl}/_api/web/lists/getbytitle('${list}')/ItemCount`;
    const count = await this.props.context.spHttpClient.get(counturl,SPHttpClient.configurations.v1)
    .then((resp:SPHttpClientResponse)=>{
      return resp.json();
    }).then((resp)=>{
      return resp.value;
    });

    const url = `${this.props.siteUrl}/_api/web/lists/getbytitle('${list}')/items?$select=ID,Title,Location,Description,StartDate,EndDate,EventThumbnail,Business/ID,Business/Title&$expand=Business&$top=${count}`;
    this.props.context.spHttpClient.get(url, SPHttpClient.configurations.v1)
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

        const ongoing: IEventData[] = items.filter((item) => {

          if (moment().isSame(item.StartDate) && item.EndDate == null || moment().isSameOrAfter(item.StartDate) && moment().isSameOrBefore(item.EndDate)) {
            return (item);
          }
        })
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
          filterData: ongoing,
          selectedTab: "Ongoing Events",
          ongoingEvents: ongoing,
          upcomingEvents: upcoming,
          pastEvents: past,
          selectedTabValues: ongoing

        })

        this.paging();


        // const pageCount: number = Math.ceil(items.length / pageSize);

        // // this.setState({
        // //   eventsData: items,
        // //   //filterData: items,
        // //   //pageData: items.slice(0, pageSize),
        // //   //totalPages: pageCount
        // // }, () => {
        // //   console.log("data",this.state.eventsData);
        // //   const result: IEventData[] = this.state.eventsData.filter((obj) => {
        // //     return obj.Category === this.state.selectedTab;

        // //   })
        // //   this.setState({
        // //     filterData: result,


        // //   }, () => {
        // //     this.paging();
        // //   });
        // // });
      })
      .catch((error) => {
        console.log('Error:', error);
      })
    //this.paging();



  }
  private handleFilter(e: any) {
    const value = parseInt(e.target.value);


    if (value == 0) {
      const result: IEventData[] = this.state.selectedTabValues;
      console.log('filter', result);
      this.setState({
        filterData: result,
        selectedFilter: value
      }, () => {
        this.paging();
      });

    } else {
      const result = this.state.selectedTabValues.filter((obj) => {
        return obj.Business && obj.Business.ID == value;
      })

      this.setState({
        filterData: result,
        selectedFilter: value
      }, () => {
        this.paging();
      });


    }
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

    if (tabName == EVENTS.ONGOING) {
      selectedTabValues = this.state.ongoingEvents
    }
    else if (tabName == EVENTS.UPCOMING) {
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

        this.paging();
      });

    } else {
      const result = selectedTabValues.filter((obj) => {
        return obj.Business && obj.Business.ID == this.state.selectedFilter;
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


  public render(): React.ReactElement<IAgiIntranetEventsProps> {
    const tabs = TABS;
    //console.log('selected tab', this.state.selectedTab);
    //console.log(this.state.pageData);
    return (
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
                    <div className={'form-select custom-select '}>
                      <select onChange={(e) => this.handleFilter(e)}>
                        <option value='0'>Filter By</option>
                        {
                          this.state.filterValues.map((business) => {
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
              <div className={'tab-content'}>
                <div className={'tab-pane fade show active'}>
                  <div className={'row'}>
                    {
                      this.state.pageData.length>0?
                      this.state.pageData.map((item) => {
                        let imageJSON = { serverRelativeUrl: "" }
                        if (item.EventThumbnail != null) {
                          imageJSON = JSON.parse(item.EventThumbnail);
                        }
                        //console.log("END DATE " + item.EndDate);
                        return (

                          <div className={'col-lg-3 mb-4 d-flex align-items-stretch'}>
                            <div className={'card news-card'}>
                              <img src={imageJSON.serverRelativeUrl} className={'card-img-top'} alt="Card Image" />
                              <div className={'card-body d-flex flex-column'}>
                                <div className={'event-date-wrapper'}>
                                  <div className={'event-date'} style={{ display: item.StartDate === null ? "none" : "display" }}>
                                    <p className={'notification-date'} >
                                      {moment(item.StartDate).format('DD')}
                                    </p>
                                    <p className={'notification-month'} >
                                      {moment(item.StartDate).format('MMM')}
                                    </p>
                                  </div>
                                  {
                                    item.EndDate &&
                                    <>
                                      <div className={'divider'} style={{ display: item.StartDate == item.EndDate ? "none" : "display" }}></div>
                                      <div className={'event-date'} style={{ display: item.StartDate == item.EndDate ? "none" : "display" }} >
                                        <p className={'notification-date'} >
                                          {moment(item.EndDate).format('DD')}
                                        </p>
                                        <p className={'notification-month'} >
                                          {moment(item.EndDate).format('MMM')}
                                        </p>
                                      </div>
                                    </>
                                  }
                                </div>

                                <div className={'mb-3 card-content-header'}>
                                  <h5 className={'card-title'}>{item.Title}</h5>
                                </div>
                                <div className={'news-details'}>
                                  <span><i><img src={`${this.props.siteUrl}/Assets/icons/icon-location.png`} alt="" /></i> {item.Location}</span>

                                </div>
                                <p className={'card-text'}>{item.Description}</p>
                                <a href={`${this.props.siteUrl}/SitePages/News/Events/Event Details.aspx?eventID=${item.ID}&tab=${this.state.selectedTab}`}
                                  className={'news-read-more  align-self-start'} data-interception="off">Read more</a>
                              </div>
                            </div>
                          </div>
                          
                        )
                      })
                      :
                          <div>
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
    );
  }
}
