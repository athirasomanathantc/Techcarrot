import * as React from 'react';
import styles from './AgiCorpIntranetOffers.module.scss';
import { IAgiCorpIntranetOffersProps } from './IAgiCorpIntranetOffersProps';
import { escape } from '@microsoft/sp-lodash-subset';
import { IOfferData } from '../Model/IOffers';
import { IAgiCorpIntranetOffersState } from './IAgiCorpIntranetOffersState';
import { sp } from '@pnp/sp/presets/all';
import Paging from './Paging/Paging';
export default class AgiCorpIntranetOffers extends React.Component<IAgiCorpIntranetOffersProps, IAgiCorpIntranetOffersState> {
  constructor(props) {
    super(props);
    sp.setup({
      spfxContext: this.props.context
    });
    this.state = {
      offerData: [],
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
      }

    }
  }

  public async componentDidMount(): Promise<void> {
    this.fetch()
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

  private async fetch() {
    await this.getBusinessItems();
    await this.getFunctionItems();
    await this.getOffer().then(() => {
      this.setDefaultFilter();
    });
  }
  private async getBusinessItems(): Promise<void> {
    const listName = "Business";
    sp.web.lists.getByTitle(listName).items.select('ID,Title').get()

      .then((response: []) => {
        console.log(response);

        this.setState({
          filterValuesBusiness: response
        }, () => { });

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
    const listName = "Functions";
    sp.web.lists.getByTitle(listName).items.select('ID,Title').get()
      .then((response: []) => {
        this.setState({
          filterValuesFunctions: response
        }, () => { });
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


  private handleFilter(value: number) {
    if (value == 0) {
      const result: IOfferData[] = this.state.offerData.filter((obj) => {
        const itemId = this.state.showBusinessData ? obj.Business?.ID : obj.Functions?.ID;
        return typeof itemId !== "undefined";
      });
      this.setState({
        filterData: result
      }, () => {
        this.paging();
      });

    } else {
      const result = this.state.offerData.filter((obj) => {
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

  private async getOffer(): Promise<void> {
    return new Promise<void>(async (resolve) => {
      const listName = "Offers";
      await sp.web.lists
        .getByTitle(listName).items
        .select('ID,Title,Description,OfferThumbnail,OfferImage,Business/ID,Business/Title,Functions/ID,Functions/Title')
        .expand('Business,Functions').getAll().then((resp: IOfferData[]) => {
          const pageCount: number = Math.ceil(resp.length / this.state.pageSize);
          this.setState({
            offerData: resp,
            filterData: resp,
            pageData: resp.slice(0, this.state.pageSize),
            totalPages: pageCount

          }, () => {
            //console.log(this.state.blogData)
          });
        }).catch((error) => {
          console.log('error in fetching news items', error);
        })
      this.paging();
      resolve()
    });
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
  private scrollToTop(): void {

    var element = document.getElementById("spPageCanvasContent");

    element.scrollIntoView(true);

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


  public render(): React.ReactElement<IAgiCorpIntranetOffersProps> {

    const filterValues = this.state.showBusinessData ? this.state.filterValuesBusiness : this.state.filterValuesFunctions;

    return (
      <div className={'main-content'} id="offerTop">
        <div className={'content-wrapper'}>
          <div className={'container'}>

            <div className={'main-header-section'}>
              <div className={'row'} >
                <div className={'col-12 col-md-6 heading-section'} >
                  <h3>Rewards</h3>
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
              <section className={'col-lg-12 offer-listing-section'}>
                <div className={'row'}>
                  {
                    this.state.pageData.length > 0 ?
                      this.state.pageData.map((item) => {
                        let imageJSON = { serverRelativeUrl: "" };
                        if (item.OfferThumbnail != null) {
                          imageJSON = JSON.parse(item.OfferThumbnail);
                        }
                        return (
                          <div className={'col-lg-3 mb-4 d-flex align-items-stretch'}>
                            <div className={'card news-card'}>
                              <a href={`${this.props.siteURL}/SitePages/Rewards/Reward Details.aspx?rewardID=${item.ID}`}>
                                <img src={imageJSON.serverRelativeUrl} className={'card-img-top'} alt="Card Image" />
                              </a>

                              <div className={'card-body d-flex flex-column'}>
                                <div className={'mb-3 card-content-header'}>
                                  <a href={`${this.props.siteURL}/SitePages/Rewards/Reward Details.aspx?rewardID=${item.ID}`}>
                                    <h5 className={'card-title'}>{item.Title}</h5>
                                  </a>
                                </div>
                                <a href={`${this.props.siteURL}/SitePages/Rewards/Reward Details.aspx?rewardID=${item.ID}`}>

                                  <p className={'card-text'}>{item.Description}</p>
                                </a>

                                <a href={`${this.props.siteURL}/SitePages/Rewards/Reward Details.aspx?rewardID=${item.ID}`} className={'read-more mt-auto align-self-start'}>Read more</a>
                                {/* <!--<a href='{'} className={'btn read-more mt-auto align-self-start'}>View Full Article</a>--> */}
                              </div>
                            </div>
                          </div>
                        )
                      })
                      :
                      <div>
                        <p>
                          NO REWARDS
                        </p>
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


    );
  }
}
