import * as React from 'react';
import styles from './AgiCorpIntranetNews.module.scss';
import { IAgiCorpIntranetNewsProps } from './IAgiCorpIntranetNewsProps';
import { IAgiCorpIntranetNewsState } from './IAgiCorpIntranetNewsState';
import { escape } from '@microsoft/sp-lodash-subset';
//require('../CSS/Styles.css');
import {
  SPHttpClient,
  SPHttpClientResponse,
  IHttpClientOptions
} from '@microsoft/sp-http'
import { INewsData } from '../Model/INewsData';
import * as moment from 'moment';
import { sp } from "@pnp/sp/presets/all";
import { Pagination } from '@pnp/spfx-controls-react/lib/pagination';
import Paging from './Paging/Paging';


//const pageSize: number = 12;

export default class AgiCorpIntranetNews extends React.Component<IAgiCorpIntranetNewsProps, IAgiCorpIntranetNewsState> {

  constructor(props) {
    super(props),
      sp.setup({
        spfxContext: this.props.context
      });
    this.state = {
      newsData: [],
      featuredNews: [],
      filterData: [],
      filterValuesBusiness: [],
      filterValuesFunctions: [],
      pageData: [],
      totalPages: 0,
      currentPage: 1,
      pageSize: 0,
      showBusinessData: true,
      selectedOption: {
        ID: 0
      },
      featuredTitle: ''
    }
  }

  public async componentDidMount(): Promise<void> {
    this.fetch()
  }


  private handleFilter(value: number) {
    if (value == 0) {
      let result: INewsData[] = this.state.newsData.filter((obj) => {
        const itemId = this.state.showBusinessData ? obj.Business?.ID : obj.Functions?.ID;
        return typeof itemId !== "undefined";
      });

      this.setState({
        filterData: result
      }, () => {
        this.paging();
      });

    } else {
      const result = this.state.newsData.filter((obj) => {
        const itemId = this.state.showBusinessData ? obj.Business?.ID : obj.Functions?.ID;
        return itemId == value;
      })

      this.setState({
        filterData: result
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

  private async fetch() {
    await this.getBusinessItems();
    await this.getFunctionItems();
    await this.getConfigItems();
    await this.getNewsItems().then(() => {
      this.setDefaultFilter();
    });
  }

  private getConfigItems() {
    const url = `${this.props.siteUrl}/_api/web/lists/getbytitle('IntranetConfig')/items?$filter=(Title eq 'FeaturedNews')&$top=1`;
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

  private getFeaturedNews(items) {
    let dateA;
    let dateB;
    return items.filter((item) => item.Featured).sort((a, b) => {
      dateA = a.PublishedDate || a.Modified;
      dateB = b.PublishedDate || b.Modified;
      return (new Date(dateB).getTime() - new Date(dateA).getTime())
    }).slice(0, 4)
  }

  private async getNewsItems(): Promise<void> {
    return new Promise<void>(async (resolve) => {
      const list = 'News';
      const counturl = `${this.props.siteUrl}/_api/web/lists/getbytitle('${list}')/ItemCount`;
      const count = await this.props.context.spHttpClient.get(counturl, SPHttpClient.configurations.v1)
        .then((resp: SPHttpClientResponse) => {
          return resp.json();
        }).then((resp) => {
          return resp.value;
        });

      await sp.web.lists
        .getByTitle(list).items
        .select("ID,Title,PublishedDate,Description,NewsThumbnail,NewsImage,Business/ID,Business/Title,Functions/ID,Functions/Title,Featured")
        .orderBy("PublishedDate", false)
        .expand("Business,Functions").top(count)()
        //this.props.context.spHttpClient.get(url, SPHttpClient.configurations.v1)
        .then((response: INewsData[]) => {
          const items: INewsData[] = response;
          console.log('Data', items);
          const pageCount: number = Math.ceil(items.length / this.state.pageSize);

          this.setState({
            newsData: items,
            featuredNews: this.getFeaturedNews(items),
            filterData: items,
            pageData: items.slice(0, this.state.pageSize),
            totalPages: pageCount
          });
        })
        .catch((error) => {
          console.log('Error:', error);
        })
      this.paging();
      resolve();
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
          filterValuesBusiness: items
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
        console.log('choices', items);
        this.setState({
          filterValuesFunctions: items
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

  private paging() {

    const pageCount: number = Math.ceil(this.state.filterData.length / this.state.pageSize);
    const totalPages = (this.state.filterData.length / this.state.pageSize) - 1;
    //console.log('totalPages', pageCount);l
    // this.setState({
    //   images
    // });
    this.setState({
      pageData: this.state.filterData.slice(0, this.state.pageSize),
      totalPages: pageCount,
      currentPage: 1
    });

  }
  private scrollToTop(): void {

    var element = document.getElementById("spPageCanvasContent");

    element.scrollIntoView(true);

  }
  private _getPage(page: number) {
    // round a number up to the next largest integer.
    const skipItems: number = this.state.pageSize * (page - 1);
    const takeItems: number = skipItems + this.state.pageSize;

    console.log('page', page);
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


  public render(): React.ReactElement<IAgiCorpIntranetNewsProps> {

    const filterValues = this.state.showBusinessData ? this.state.filterValuesBusiness : this.state.filterValuesFunctions;

    return (
      <div>
        <section className="featured-section col-lg-12 bg-light bg-gradient mt-5 ">
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
                    this.state.featuredNews.map((item: INewsData, index: number) => {
                      const imageUrl = JSON.parse(item.NewsThumbnail)?.serverRelativeUrl;
                      const category = item.Business ? item.Business?.Title : item.Functions?.Title;

                      return (
                        <div className={`carousel-item ${!index ? 'active' : ''}`}>
                          <div className="col-md-3 h-100">
                            <div className="card h-100">
                              <div className="badge-label"><span><i><img src={`${this.props.siteUrl}/Assets/images/star.svg`} /></i></span><span
                                className="badge-txt">Featured</span></div>
                              <div className="card-img">
                                <img src={imageUrl} className="img-fluid" />
                              </div>
                              <div className="card-body d-flex flex-column">
                                <div className={'category'}>
                                  <span><i><img src={`${this.props.siteUrl}/Assets/icons/Tag.svg`} alt="" /></i>{category}</span>
                                </div>

                                <div className={'mb-2 mt-2 card-content-header'}>
                                  <h5 className="card-title">{item.Title}</h5>
                                </div>
                                <div className={'date'}>
                                  <span><i><img src={`${this.props.siteUrl}/Assets/icons/Date-blue.svg`} alt="" /></i>{moment(item.PublishedDate).format('DD-MMM-YYYY')}</span>
                                </div>
                                <p className={'card-text mt-2'}>{item.Description}</p>
                                <a href={`${this.props.siteUrl}/SitePages/News/News Detail.aspx?newsID=${item.ID}&env=WebView`} className={'news-read-more  align-self-start'}>Read more</a>
                              </div>
                            </div>
                          </div>
                        </div>
                      )
                    })
                  }

                </div>
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
              </div>
            </div>
          </div>
        </section>
        <div className={'main-content'} id='newsTop'>
          <div className={'content-wrapper'}>
            <div className={'container'}>
              <div className={'main-header-section'}>
                <div className={'row'} >
                  <div className={'col-12 col-md-6 heading-section'} >
                    <h3>Latest News</h3>
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
              <article className={'row gx-5 mb-5'}>
                <section className={'col-lg-12'}>
                  <div className={'row'}>
                    {
                      this.state.pageData.length > 0 ?

                        this.state.pageData.map((item) => {
                          let imageJSON = { serverRelativeUrl: "" };
                          if (item.NewsThumbnail != null) {
                            imageJSON = JSON.parse(item.NewsThumbnail);
                          }

                          const category = this.state.showBusinessData ? item.Business?.Title : item.Functions?.Title;
                          return (
                            <div className={'col-lg-3 mb-4 d-flex align-items-stretch'}>
                              <div className='card news-card'>
                                <img src={imageJSON.serverRelativeUrl} className={'card-img-top'} alt="Image" />
                                <div className="card-body d-flex flex-column">
                                  <div className={'category'}>
                                    <span><i><img src={`${this.props.siteUrl}/Assets/icons/Tag.svg`} alt="" /></i>{category}</span>
                                  </div>

                                  <div className={'mb-2 mt-2 card-content-header'}>
                                    <h5 className="card-title">{item.Title}</h5>
                                  </div>
                                  <div className={'date'}>
                                    <span><i><img src={`${this.props.siteUrl}/Assets/icons/Date-blue.svg`} alt="" /></i>{moment(item.PublishedDate).format('DD-MMM-YYYY')}</span>
                                  </div>
                                  <p className={'card-text mt-2'}>{item.Description}</p>
                                  <a href={`${this.props.siteUrl}/SitePages/News/News Detail.aspx?newsID=${item.ID}&env=WebView`} className={'news-read-more  align-self-start'}>Read more</a>
                                </div>
                              </div>
                            </div>
                          )
                        })
                        :
                        <div className={'invalidTxt'}>

                          NO NEWS

                        </div>
                    }


                  </div>

                </section>

              </article>
              <div className={'pagination-wrapper'} style={{ display: this.state.totalPages > 0 ? 'block' : 'none' }} >
                {/* <Pagination
                  currentPage={this.state.currentPage}
                  totalPages={this.state.totalPages}
                  onChange={(page) => this._getPage(page)}
                  limiter={5}
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
      </div>
    )

  }

}
