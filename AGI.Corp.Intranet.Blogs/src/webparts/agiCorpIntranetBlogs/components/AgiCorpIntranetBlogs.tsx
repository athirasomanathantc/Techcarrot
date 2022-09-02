import * as React from 'react';
import styles from './AgiCorpIntranetBlogs.module.scss';
import { IAgiCorpIntranetBlogsProps } from './IAgiCorpIntranetBlogsProps';
import { escape } from '@microsoft/sp-lodash-subset';
import { IBlogData } from '../Model/IBlogData'
import { IAgiCorpIntranetBlogsState } from './IAgiCorpIntranetBlogsState'
import { sp } from '@pnp/sp/presets/all';
import * as moment from 'moment';
import Paging from './Paging/Paging';
import{
  SPHttpClient,
  SPHttpClientResponse
} from '@microsoft/sp-http'
//const pageSize: number = 12;
export default class AgiCorpIntranetBlogs extends React.Component<IAgiCorpIntranetBlogsProps, IAgiCorpIntranetBlogsState> {
  constructor(props) {
    super(props);
    sp.setup({
      spfxContext: this.props.context
    });
    this.state = {
      blogData: [],
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
  private async fetch() {
    await this.getBusinessItems();

    await this.getblog();

  }
  private async getBusinessItems(): Promise<void> {
    const listName="Business";
    sp.web.lists.getByTitle(listName).items.select('ID,Title').get()
    
      .then((response:[]) => {
        console.log(response);
        
       this.setState({
        filterValues:response
       },()=>{
        console.log("filter",this.state.filterValues);
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
      totalPages: pageCount,
      currentPage: 1
    });

  }

 
  private handleFilter(e: any) {
    const value = parseInt(e.target.value);
    if (value == 0) {
      const result: IBlogData[] = this.state.blogData;
      this.setState({
        filterData: result
      },()=>{
        this.paging();
      });

    } else {
      const result = this.state.blogData.filter((obj) => {
        return obj.Business.ID == value;
      })
      
      this.setState({
        filterData: result
      },()=>{
       this.paging();
      });
      
      
    }
    
    

  }

  private async getblog(): Promise<void> {

     const listName = "Blogs";
    sp.web.lists.getByTitle(listName).items.select('ID,Title,Category,PublishedDate,BlogThumbnail,BlogImage,Author/ID,Author/Title,Business/ID,Business/Title')
    .expand('Author,Business').getAll().then((resp: IBlogData[]) => {
      const pageCount: number = Math.ceil(resp.length / this.state.pageSize);
      console.log(resp.length);
      this.setState({
        blogData: resp,
        filterData:resp,
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
    },()=>{
      this.scrollToTop();

    });
  }
  private scrollToTop(): void {

    var element = document.getElementById("spPageCanvasContent");

    element.scrollIntoView(true);

  }

  public render(): React.ReactElement<IAgiCorpIntranetBlogsProps> {

    debugger;
    return (
      <div className={'main-content'} id='blogTop'>
        <div className={'content-wrapper'}>
          <div className={'container'}>

          <div className={'main-header-section' }>
                <div className={'row'} >
                  <div className={'col-12 col-md-6 heading-section'} >
                    <h3>Blogs</h3>
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

              <section className={'col-lg-12 blog-section'}>
                <div className={'row'}>
                  {
                    this.state.pageData.length>0?
                    this.state.pageData.map((item) => {
                      let imageJSON = { serverRelativeUrl: "" };
                      if (item .BlogThumbnail != null) {
                        imageJSON = JSON.parse(item.BlogThumbnail);
                      }
                      return (
                        
                          < div className={'col-lg-3 mb-4 d-flex align-items-stretch'}>
                            <div className={'card news-card'}>
                            <a href={`${this.props.siteUrl}/SitePages/News/Blogs/Blog Details.aspx?blogID=${item.ID}`} className={'news-read-more  align-self-start'} data-interception="off">
                              <img src={imageJSON.serverRelativeUrl} className={'card-img-top'} alt="Card Image" />
                              </a>
                              <div className={'card-body d-flex flex-column'}>
                                <a href={`${this.props.siteUrl}/SitePages/News/Blogs/Blog Details.aspx?blogID=${item.ID}`} className={'news-read-more  align-self-start'} data-interception="off">
                                  <div className={'mb-3 card-content-header'}>
                                    <h5 className={'card-title'}>{item.Title}</h5>
                                  </div>
                                  <div className={'blog-details'}>
                                    <span className={'category'}><i><img src={`${this.props.siteUrl}/Assets/icons/icon-tag.png`} alt="" /></i> {item.Business.Title}</span>
                                    <span className={'date'}><i><img src={`${this.props.siteUrl}/Assets/icons/Date.svg`} alt="" /></i> {moment(item.PublishedDate).format('DD-MMM-YYYY')}</span>
                                  </div>
                                  <p><i><img src={`${this.props.siteUrl}/Assets/icons/avatar.png`} alt="" /></i> <span>{item.Author.Title}</span></p>
                                </a>
                              </div>
                            </div>
                          </div>
                        
                      )

                    })
                    :
                    <div>
                      <p>
                        NO BLOGS
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
      </div >

    );
  }

}
