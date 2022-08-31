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
      filterValues: [],
      pageData: [],
      totalPages: 0,
      currentPage: 1,
      pageSize: 0


    }
  }

  public async componentDidMount(): Promise<void> {
    this.fetch()
  }
  private async fetch() {
    await this.getBusinessItems();

    await this.getOffer();

  }
  private async getBusinessItems(): Promise<void> {
    const listName = "Business";
    sp.web.lists.getByTitle(listName).items.select('ID,Title').get()

      .then((response: []) => {
        console.log(response);

        this.setState({
          filterValues: response
        }, () => {
          console.log("filter", this.state.filterValues);
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


  private handleFilter(e: any) {
    const value = parseInt(e.target.value);
    if (value == 0) {
      const result: IOfferData[] = this.state.offerData;
      this.setState({
        filterData: result
      }, () => {
        this.paging();
      });

    } else {
      const result = this.state.offerData.filter((obj) => {
        return obj.Business.ID == value;
      })

      this.setState({
        filterData: result
      }, () => {
        this.paging();
      });


    }



  }

  private async getOffer(): Promise<void> {
    const listName = "Offers";
    sp.web.lists.getByTitle(listName).items.select('ID,Title,Description,OfferThumbnail,OfferImage,Business/ID,Business/Title')
      .expand('Business').getAll().then((resp: IOfferData[]) => {
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


  public render(): React.ReactElement<IAgiCorpIntranetOffersProps> {

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
                  <div className={'form-select custom-select '}>
                    <select onChange={(e) => this.handleFilter(e)}>

                      <option value="0">Filter By</option>
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
                              <a href={`${this.props.siteURL}/SitePages/Reward Details.aspx?rewardID=${item.ID}`}>
                              <img src={imageJSON.serverRelativeUrl} className={'card-img-top'} alt="Card Image" />
                              </a>
                              
                              <div className={'card-body d-flex flex-column'}>
                                <div className={'mb-3 card-content-header'}>
                                <a href={`${this.props.siteURL}/SitePages/Reward Details.aspx?rewardID=${item.ID}`}>
                                  <h5 className={'card-title'}>{item.Title}</h5>
                                  </a>
                                </div>
                                <a href={`${this.props.siteURL}/SitePages/Reward Details.aspx?rewardID=${item.ID}`}>

                                <p className={'card-text'}>{item.Description}</p>
                                </a>
                                
                                <a href={`${this.props.siteURL}/SitePages/Reward Details.aspx?rewardID=${item.ID}`} className={'btn read-more  align-self-start'}>Read more</a>
                                {/* <!--<a href='{'} className={'btn read-more mt-auto align-self-start'}>View Full Article</a>--> */}
                              </div>
                            </div>
                          </div>
                        )
                      })
                      :
                      <div>
                        <p>
                          NO Rewards
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
