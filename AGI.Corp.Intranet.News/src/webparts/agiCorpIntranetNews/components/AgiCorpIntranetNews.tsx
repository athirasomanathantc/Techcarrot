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
      this.state = {
        newsData: [],
        filterData: [],
        filterValues: [],
        pageData: [],
        totalPages: 0,
        currentPage: 1,
        pageSize:0
      }
  }

  public async componentDidMount(): Promise<void> {
    this.fetch()
  }


  private handleFilter(e: any) {
    const value = parseInt(e.target.value);
    if (value == 0) {
      const result: INewsData[] = this.state.newsData;
      this.setState({
        filterData: result
      },()=>{
        this.paging();
      });

    } else {
      const result = this.state.newsData.filter((obj) => {
        return obj.Business.ID == value;
      })
      
      this.setState({
        filterData: result
      },()=>{
        this.paging();
      });
      
      
    }
    
    

  }

  private async fetch() {
    await this.getBusinessItems();
    await this.getNewsItems();
  }

  private async getNewsItems(): Promise<void> {
    const url = `${this.props.siteUrl}/_api/web/lists/getbytitle('News')/items?$select=ID,Title,Category,PublishedDate,Description,NewsThumbnail,NewsImage,Business/ID,Business/Title&$expand=Business`;
    this.props.context.spHttpClient.get(url, SPHttpClient.configurations.v1)
      .then((response: SPHttpClientResponse) => {
        return response.json();
      })
      .then((response) => {
        const items: INewsData[] = response.value;
        console.log('Data',items);
        const pageCount: number = Math.ceil(items.length / this.state.pageSize);

        this.setState({
          newsData: items,
          filterData: items,
          pageData: items.slice(0, this.state.pageSize),
          totalPages: pageCount
        });
      })
      .catch((error) => {
        console.log('Error:', error);
      })
    this.paging();


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
        filterValues:items
       });
       
    })
    .catch((error) => {
      console.log('Error:', error);
    })
    if (window.innerWidth<=767){
      this.setState({
        pageSize:6
      });

    }else{
      this.setState({
        pageSize:12
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
      totalPages: pageCount
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
    },()=>{
      this.scrollToTop();

    });
  }


  public render(): React.ReactElement<IAgiCorpIntranetNewsProps> {


    console.log('page count',  this.state.totalPages);
    return (
      <div>
        <div className={'main-content' } id='newsTop'>
          <div className={'content-wrapper'}>
            <div className={'container'}>
              <div className={'main-header-section' }>
                <div className={'row'} >
                  <div className={'col-12 col-md-6 heading-section'} >
                    <h3>Latest News</h3>
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
                <section className={'col-lg-12'}>
                  <div className={'row'}>
                    {

                      this.state.pageData.map((item) => {
                        let imageJSON = { serverRelativeUrl: "" };
                        if (item.NewsThumbnail != null) {
                          imageJSON = JSON.parse(item.NewsThumbnail);
                        }

                        return (
                          <div className={'col-lg-3 mb-4 d-flex align-items-stretch'}>
                            <div className='card news-card'>
                              <img src={imageJSON.serverRelativeUrl} className={'card-img-top'} alt="Image" />
                              <div className="card-body d-flex flex-column">
                                <div className={'mb-3 card-content-header'}>
                                  <h5 className="card-title">{item.Title}</h5>
                                </div>
                                <div className={'news-details'}>
                                  <span><i><img src={`${this.props.siteUrl}/Assets/icons/Tag.svg`} alt="" /></i>{item.Business.Title}</span>
                                  <span><i><img src={`${this.props.siteUrl}/Assets/icons/Date.png`} alt="" /></i>{moment(item.PublishedDate).format('DD-MMM-YYYY')}</span>
                                </div>
                                <p className={'card-text'}>{item.Description}</p>
                                <a href={`${this.props.siteUrl}/SitePages/News/News Detail.aspx?newsID=${item.ID}`} className={'btn news-read-more  align-self-start'} data-interception="off">Read more</a>
                              </div>
                            </div>
                          </div>
                        )
                      })
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
