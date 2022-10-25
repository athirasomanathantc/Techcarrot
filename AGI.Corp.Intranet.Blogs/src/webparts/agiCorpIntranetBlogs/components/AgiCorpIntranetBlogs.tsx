import * as React from 'react';
import styles from './AgiCorpIntranetBlogs.module.scss';
import { IAgiCorpIntranetBlogsProps } from './IAgiCorpIntranetBlogsProps';
import { escape } from '@microsoft/sp-lodash-subset';
import { IBlogData } from '../Model/IBlogData'
import { IAgiCorpIntranetBlogsState } from './IAgiCorpIntranetBlogsState'
import { sp } from '@pnp/sp/presets/all';
import * as moment from 'moment';
import Paging from './Paging/Paging';
import {
  SPHttpClient,
  SPHttpClientResponse
} from '@microsoft/sp-http'
import BlogCard from './BlogCard/BlogCard';
//const pageSize: number = 12;
export default class AgiCorpIntranetBlogs extends React.Component<IAgiCorpIntranetBlogsProps, IAgiCorpIntranetBlogsState> {
  constructor(props) {
    super(props);
    sp.setup({
      spfxContext: this.props.context
    });
    this.state = {
      blogData: [],
      featuredBlogs: [],
      filterData: [],
      filterValuesBusiness: [],
      filterValuesFunctions: [],
      pageData: [],
      totalPages: 0,
      currentPage: 1,
      pageSize: 0,
      isDataLoaded: false,
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
  private async fetch() {
    await this.getBusinessItems();
    await this.getFunctionItems();
    await this.getConfigItems();
    await this.getblog().then(() => {
      this.setDefaultFilter();
    });
  }

  private getConfigItems() {
    const listName = "IntranetConfig";
    sp.web.lists.getByTitle(listName).items.select('ID,Title,Detail').filter("Title eq 'FeaturedBlogs'").get()
      .then((response: any[]) => {
        this.setState({
          featuredTitle: response[0]?.Detail
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

  private async getBusinessItems(): Promise<void> {
    const listName = "Business";
    sp.web.lists.getByTitle(listName).items.select('ID,Title').get()

      .then((response: []) => {
        this.setState({
          filterValuesBusiness: response
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
      const result: IBlogData[] = this.state.blogData.filter((obj) => {
        const itemId = this.state.showBusinessData ? obj.Business?.ID : obj.Functions?.ID;
        return typeof itemId !== "undefined";
      });;
      this.setState({
        filterData: result
      }, () => {
        this.paging();
      });

    } else {
      const result = this.state.blogData.filter((obj) => {
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

  private getFeaturedBlogs(items: IBlogData[]) {
    let dateA;
    let dateB;
    return items.filter((item) => item.Featured).sort((a, b) => {
      dateA = a.PublishedDate || a.Modified;
      dateB = b.PublishedDate || b.Modified;
      return (new Date(dateB).getTime() - new Date(dateA).getTime())
    }).slice(0, 4)
  }

  private async getblog(): Promise<void> {
    return new Promise(async resolve => {
      const listName = "Blogs";
      await sp.web.lists
        .getByTitle(listName).items
        .select('ID,Title,PublishedDate,BlogThumbnail,BlogImage,Author/ID,Author/Title,Business/ID,Business/Title,Functions/ID,Functions/Title,Featured')
        .orderBy('PublishedDate', false)
        .expand('Author,Business,Functions')
        .top(5000)().then((resp: IBlogData[]) => {
          const pageCount: number = Math.ceil(resp.length / this.state.pageSize);
          console.log(resp.length);
          this.setState({
            blogData: resp,
            featuredBlogs: this.getFeaturedBlogs(resp),
            filterData: resp,
            pageData: resp.slice(0, this.state.pageSize),
            totalPages: pageCount,
            isDataLoaded: true
          });

        }).catch((error) => {
          console.log('error in fetching news items', error);
        })
      this.paging();
      resolve();
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

  public render(): React.ReactElement<IAgiCorpIntranetBlogsProps> {

    const filterValues = this.state.showBusinessData ? this.state.filterValuesBusiness : this.state.filterValuesFunctions;

    return (
      <>
        <section className="featured-section blog-featured-section col-lg-12 bg-light bg-gradient mt-5 ">
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
                    this.state.featuredBlogs.map((item: IBlogData, index: number) => {
                      const category = item.Business ? item.Business : item.Functions;
                      let imageJSON = { serverRelativeUrl: "" };
                      if (item.BlogThumbnail != null) {
                        imageJSON = JSON.parse(item.BlogThumbnail);
                      }
                      return (
                        <div className={`carousel-item ${!index ? 'active' : ''}`}>
                          <div className="col-md-3 h-100">
                            <BlogCard imageUrl={imageJSON.serverRelativeUrl} siteUrl={this.props.siteUrl} isFeatured={true} item={item} category={category.Title}></BlogCard>
                          </div>
                        </div>
                      )
                    })
                  }
                  {
                    !this.state.featuredBlogs.length && <h5>No items found</h5>
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
        <div className={'main-content'} id='blogTop'>
          <div className={'content-wrapper'}>
            <div className={'container'} style={{ display: this.state.isDataLoaded ? 'block' : 'none' }}>

              <div className={'main-header-section'}>
                <div className={'row'} >
                  <div className={'col-12 col-md-6 heading-section'} >
                    <h3>Blogs</h3>
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

                <section className={'col-lg-12 blog-section'}>
                  <div className={'row'}>
                    {
                      this.state.pageData.length > 0 ?
                        this.state.pageData.map((item) => {
                          let imageJSON = { serverRelativeUrl: "" };
                          if (item.BlogThumbnail != null) {
                            imageJSON = JSON.parse(item.BlogThumbnail);
                          }

                          const category = this.state.showBusinessData ? item.Business?.Title : item.Functions?.Title;

                          return (

                            <div className={'col-lg-3 mb-4 d-flex align-items-stretch'}>
                              <BlogCard imageUrl={imageJSON.serverRelativeUrl} item={item} category={category} siteUrl={this.props.siteUrl} isFeatured={false}></BlogCard>
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
          <div className='loaderContainer' style={{ display: this.state.isDataLoaded ? 'none' : 'flex' }}>
            <div className="loader">
            </div>
          </div>
        </div>
      </>
    );
  }

}
