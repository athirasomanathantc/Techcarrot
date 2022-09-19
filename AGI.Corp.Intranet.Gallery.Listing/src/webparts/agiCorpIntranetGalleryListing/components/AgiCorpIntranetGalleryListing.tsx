import * as React from 'react';
import styles from './AgiCorpIntranetGalleryListing.module.scss';
import { IAgiCorpIntranetGalleryListingProps } from './IAgiCorpIntranetGalleryListingProps';
import { escape } from '@microsoft/sp-lodash-subset';
import { containsInvalidFileFolderChars, sp } from '@pnp/sp/presets/all';
import { IAgiCorpIntranetGalleryListingState } from './IAgiCorpIntranetGalleryListingState';
import { LIBRARY_PHOTO_GALLERY, LIBRARY_VIDEO_GALLERY, NULL_SELECTED_ITEM, PATH_PHOTO_GALLERY, PROP_DEFAULT_ORDERBY } from '../common/constants';
import {
  SPHttpClient,
  SPHttpClientResponse,
  IHttpClientOptions
} from '@microsoft/sp-http';
import {
  Carousel,
  CarouselButtonsDisplay,
  CarouselButtonsLocation,
  CarouselIndicatorShape
} from "@pnp/spfx-controls-react/lib/Carousel";
import { IFolderItem } from '../models/IFolderItem';
import { IImageItem } from '../models/IImageItem';
import { Icon } from 'office-ui-fabric-react';
import * as $ from 'jquery';
import { resultItem } from 'office-ui-fabric-react/lib/components/FloatingPicker/PeoplePicker/PeoplePicker.scss';
//import { Icon } from 'office-ui-fabric-react/lib/components/Icon/Icon';
//import { Pagination } from '@pnp/spfx-controls-react/lib/pagination';
//import Paging from './Paging/Paging';
import Paging from './Paging/Paging';
const CAROUSEL_HEIGHT = '240px';
export default class AgiCorpIntranetGalleryListing extends React.Component<IAgiCorpIntranetGalleryListingProps, IAgiCorpIntranetGalleryListingState> {

  constructor(props: IAgiCorpIntranetGalleryListingProps) {
    super(props);
    sp.setup({
      spfxContext: this.props.context
    });
    this.state = {
      folders: [],
      files: [],
      videoItems: [],
      imageItems: [],
      selectedImageFolder: '',
      ServerRelativeUrl: '',
      selectedItem: NULL_SELECTED_ITEM,
      selectedVideoUrl: '',
      showVideo: false,
      slides: [],
      images: [],
      preview: false,
      previewImage: '',
      currentIndex: -1,
      currentImageUrl: '',
      folderData: [],
      filterData: [],
      filterValues: [],
      pageData: [],
      currentPage: 1,
      pageSize: 0,
      totalPage: 0
    }
    // this.getImages = this.getImages.bind(this);
  }

  public async componentDidMount(): Promise<void> {
    await this.getBusinessItems();
    await this.getGalleryItems();
    await this.getVideoItems();
  }

  private async getBusinessItems(): Promise<void> {

    const url1 = `${this.props.siteUrl}/_api/web/lists/getbytitle('Business')/items`;
    this.props.context.spHttpClient.get(url1, SPHttpClient.configurations.v1)
      .then((response: SPHttpClientResponse) => {
        return response.json();
      })
      .then((response) => {
        const items = response.value;
        
        this.setState({
          filterValues: items
        });

      })
      .catch((error) => {
        console.log('Error:', error);
      })
    /* const v = this.state.filterValues;
     const url2 = `${this.props.siteUrl}/_api/web/lists/getbytitle('Functions')/items`;
   this.props.context.spHttpClient.get(url2, SPHttpClient.configurations.v1)
     .then((response: SPHttpClientResponse) => {
       return response.json();
     })
     .then((response) => {
       const items = response.value;
       val=val.concat(items);
      
       this.setState({
         filterValues: items
       });

     })
     .catch((error) => {
       
     })*/
    if (window.innerWidth <= 767) {
      this.setState({//debugger;
        pageSize: 6
      });

    } else {
      this.setState({
        pageSize: 12
      });

    }

  }

  private handleFilter(e: any) {
    
    const value = parseInt(e.target.value);
    console.log("filter",value);
    debugger;
    if (value == 0) {
      //const result: IImageItem[] = this.state.folders;
      console.log("entered filter");
      this.setState({
        filterData: this.state.folders
      }, () => {
        
       // this.paging();
      });

    } else {
      const result = this.state.folders.filter((obj) => {
        return obj.BusinessId == value;
      })
      
      this.setState({
        filterData: result
      }, () => {
       // this.paging();
      });

    }
  }

  private paging() {

    const pageCount: number = Math.ceil(this.state.filterData.length / this.state.pageSize);
    const totalPages = (this.state.filterData.length / this.state.pageSize) - 1;
    
    // this.setState({
    //   images
    // });
    this.setState({
      pageData: this.state.filterData.slice(0, this.state.pageSize),
      totalPage: pageCount,
      currentPage: 1
    },()=>{
      //console.log("PageData",this.state.pageData);
    });

  }

  private _getPage(page: number) {
    // round a number up to the next largest integer.
    const skipItems: number = this.state.pageSize * (page - 1);
    const takeItems: number = skipItems + this.state.pageSize;

   
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

  private async getGalleryItems(): Promise<void> {
    debugger;
    const libraryName = this.props.libraryName;
    const libraryPath = this.props.libraryPath;
    const library = sp.web.lists.getByTitle(libraryName);
    // get folders
    const orderByField = this.props.orderBy || PROP_DEFAULT_ORDERBY;
    library.rootFolder.folders
      .filter('ListItemAllFields/Id ne null')
      .expand('ListItemAllFields')
      .orderBy(orderByField, false)
      .get()
      .then((folders: any) => {
        // get files
        library.items.select('*, FileRef, FileLeafRef').filter('FSObjType eq 0').get().then((files: IImageItem[]) => {
          console.log("test", folders);
          const _folders = [];
          folders.map((folder) => {
            const path = `${this.props.context.pageContext.web.serverRelativeUrl}/${libraryPath}/${folder.Name}`;
            
            //   const _coverPhoto = sp.web.folders.getByName(LIBRARY_PHOTO_GALLERY).folders.getByName(folder.Name).files.select('FileLeafRef').filter("isCoverPhoto eq 1").get().then((allItems) => {
            //     const test1 = allItems
            //   });;

            //  // sp.web.folders.getByName(LIBRARY_PHOTO_GALLERY).folders.getByName(folder.Name).files.select('Id').filter(`FSObjType ne 1 and isCoverPhoto eq 1`).get().then((allItems) => {
            //     // const test12 = allItems
            //     sp.web.folders.getByName(LIBRARY_PHOTO_GALLERY).folders.getByName(folder.Name).files.select('*, FileRef, FileLeafRef').get().then((allItems) => {             
            //     for (var i = 0; i < files.length; i++) {
            //       var _ServerRelativeUrl = files[i].FileRef;
            //       sp.web.getFileByServerRelativeUrl(_ServerRelativeUrl).getItem().then(item => {
            //         
            //       });
            //     }
            //   });;

            const _files = files.filter((file) => {
              const folderPath = file.FileRef.replace(`/${file.FileLeafRef}`, '');
              return folderPath == path;
            });
            
            const count = _files.length;
            _folders.push({ ID: folder.ListItemAllFields.ID, Name: folder.Name, Count: count, BusinessId: folder.ListItemAllFields.BusinessId })
          });
          this.setState({
            folders: _folders,
            filterData: _folders
          }, () => {
            this.paging();
          });
        })
      })
      .catch((error) => {
        console.log(error);
      });

  }
  /*private paging() {
    const pageCount: number = Math.ceil(this.state.filterData.length / this.state.pageSize);
    const totalPages = (this.state.filterData.length / this.state.pageSize) - 1;
    
    this.setState({
      images
    });
    this.setState({
      pageData1: this.state.filterData.slice(0, this.state.pageSize),
      totalPage: pageCount,
      currentPage: 1
    }, () => {
      
    });

  }*/

  // private _getPage(page: number) {
  //   // round a number up to the next largest integer.
  //   const skipItems: number = this.state.pageSize * (page - 1);
  //   const takeItems: number = skipItems + this.state.pageSize;

  //   
  //   const roundupPage = Math.ceil(page);
  //   // const images = this.state.allImages.slice(roundupPage, (roundupPage * pageSize));
  //   const pageData1 = this.state.filterData.slice(skipItems, takeItems)
  //   this.setState({
  //     pageData1,
  //     currentPage: page
  //   }, () => {
  //     this.scrollToTop();

  //   });
  // }
  // private scrollToTop(): void {

  //   var element = document.getElementById("spPageCanvasContent");

  //   element.scrollIntoView(true);

  // }

  private async getGalleryItems1(): Promise<void> {
    debugger;
    const select = '*, FileRef, FileLeafRef';
    let items = await sp.web.lists.getByTitle(this.props.libraryName).items.orderBy('Modified', true).select(select).get();
    const images = items.map((item) => {
      return ({ ID: item.ID, ImageUrl: item.FileRef })
    });
    const _coverPhoto = items.filter(img => img.CoverPhoto);
    const coverPhoto = _coverPhoto && _coverPhoto.length > 0 ? _coverPhoto[0] : null;
   
    //items.splice(items.findIndex(item => item.CoverPhoto == true), 1);
    items.unshift(coverPhoto);
    const slides = items.map((item) => {
      return (<div style={{ width: '100%' }}  >
        <a href={'javascript:void(0);'} onClick={(e) => this.previewImage(e)} data-src={item.FileRef} data-id={item.ID} >
          <img src={item.FileRef} alt={item.Title} style={{ width: '100%' }} data-src={item.FileRef} data-id={item.ID} />
        </a>
      </div>
      );
    });
    
    this.setState({
      slides,
      images
    },
      () => {
        //this.setWidgetHeight(styles.carouselImageContent);
      })
  }

  private getImageUrl(imageContent: string): string {
    if (!imageContent) {
      return;
    }

    const imageObj: any = JSON.parse(imageContent);
    return imageObj.serverUrl + imageObj.serverRelativeUrl;
  }

  private async getImageGalleryItems(subFolderName): Promise<void> {
    debugger;
    sp.web.folders.getByName(LIBRARY_PHOTO_GALLERY).folders.getByName(subFolderName).files.select('*, FileRef, FileLeafRef').get().then((allItems) => {
      this.setState({
        imageItems: allItems,
        selectedImageFolder: subFolderName
      });
    });

    // const select = 'Id, ID, Title, FileRef, Modified, PublishedDate, CoverPhoto';
    // let items = await sp.web.folders.getByName(LIBRARY_PHOTO_GALLERY).folders.getByName(subFolderName).files.select(select).get();
    // const images = items.map((item) => {
    //   return({ ID: item., ImageUrl: item.FileRef })
    // });
    //   this.setState({
    //     imageItems: items,
    //     selectedImageFolder: subFolderName
    //   });
  }

  private closeImageFolder() {
    this.setState({
      imageItems: [],
      selectedImageFolder: ''
    });
  }

  private async getVideoItems(): Promise<void> {

    sp.web.lists.getByTitle(LIBRARY_VIDEO_GALLERY).items.select('*, FileRef, FileLeafRef').filter('FSObjType eq 0').get().then((items: IImageItem[]) => {
      this.setState({
        videoItems: items
      });
    });
  }

  private openVideo(id) {
    debugger;
    const selectedItem = this.state.videoItems.filter(item => item.ID == id)[0];
    this.setState({
      selectedItem
    });
    this.setState({
      showVideo: true
    });
  }


  private closePreview(): void {
    this.setState({
      showVideo: false,
      selectedVideoUrl: '',
      preview: false
    });
  }

  private closeVideoPreview(): void {
    this.setState({
      showVideo: false,
      selectedVideoUrl: ''
    });
  }

  private previewImage(e: any): void {
    const src = e.target.attributes["data-src"].value;
    const id = e.target.attributes["data-id"].value;
    const index = id ? parseInt(id) : -1;
    this.setState({
      preview: true,
      currentImageUrl: src,
      currentIndex: index
    })
  }

  private prevImage() {
    const index = this.state.currentIndex;
    const images = this.state.images;
    const arrayIndex = images.map(e => e.ID).indexOf(index);
    const prevIndex = arrayIndex == 0 ? (images.length - 1) : arrayIndex - 1;
    const prevImage = images[prevIndex];
    this.setState({
      currentIndex: prevImage.ID,
      currentImageUrl: prevImage.ImageUrl
    });
  }

  private nextImage() {
    const index = this.state.currentIndex;
    const images = this.state.images;
    const arrayIndex = images.map(e => e.ID).indexOf(index);
    const nextIndex = arrayIndex == (images.length - 1) ? 0 : arrayIndex + 1;
    const nextImage = images[nextIndex];
    this.setState({
      currentIndex: nextImage.ID,
      currentImageUrl: nextImage.ImageUrl
    });
  }


  private getWidgetHeight() {
    return CAROUSEL_HEIGHT;
  }
  private setWidgetHeight(className: string) {
    $('.' + className).css('height', this.getWidgetHeight());
    setTimeout(function () {
      
      $('.' + className).css('height', $('.' + className).find('img').height());
    }, 1500);
  }

  private getQueryStringValue(param: string): string {
    const params = new URLSearchParams(window.location.search);
    let value = params.get(param) || '';
    return value;
  }

  public render(): React.ReactElement<IAgiCorpIntranetGalleryListingProps> {
    const tab = this.getQueryStringValue('tab');
    const libraryPath = this.props.libraryPath;
    const imageUrl = this.state.currentImageUrl;
    return (
      <div className={styles.agiCorpIntranetGalleryListing}>
        {this.props.libraryName && this.props.libraryPath ?

          <div className="main-content" style={{ display: this.state.selectedImageFolder ? 'none' : 'block' }}>
            <div className="content-wrapper">
              <div className="container">
                <div className="tabs">
                  <div className="tab-header">
                    <div className="row">
                      <div className="col-md-6">
                        <ul className="nav nav-tabs" id="myTab" role="tablist">
                          <li className="nav-item" role="presentation">
                            <button className={tab == "image" ? `nav-link active` : `nav-link`} id="image-gallery-tab" data-bs-toggle="tab" data-bs-target="#image-gallery" type="button" role="tab" aria-controls="image-gallery" aria-selected="true">Image Gallery
                              <i>
                                <svg xmlns="http://www.w3.org/2000/svg" width="35" height="35" viewBox="0 0 35 35">
                                  <g id="Image_Gallery_active" data-name="Image Gallery_active" transform="translate(-195 -370)">
                                    <g id="Group_9544" data-name="Group 9544" transform="translate(197 374)">
                                      <g id="Group_8147" data-name="Group 8147" transform="translate(0 0)">
                                        <path id="Path_73956" data-name="Path 73956" d="M177.107,159.668a3.118,3.118,0,1,0,3.118,3.118A3.118,3.118,0,0,0,177.107,159.668Zm0,4.752a1.633,1.633,0,0,1,0-3.267h0a1.633,1.633,0,1,1,0,3.267Z" transform="translate(-161.626 -150.211)" fill="#9d0e71" />
                                        <path id="Path_73957" data-name="Path 73957" d="M27.917,28.905,7.648,26.6a2.784,2.784,0,0,0-2.19.631,2.821,2.821,0,0,0-1.077,1.93L4.01,32.209H2.859A2.983,2.983,0,0,0,0,35.29V50.473a2.821,2.821,0,0,0,2.746,2.895H23.24a3.047,3.047,0,0,0,3.118-2.9v-.594a3.712,3.712,0,0,0,1.411-.594,3.081,3.081,0,0,0,1.077-2l1.708-15.072A3.007,3.007,0,0,0,27.917,28.905ZM24.873,50.473a1.563,1.563,0,0,1-1.633,1.411H2.859a1.336,1.336,0,0,1-1.375-1.3q0-.057,0-.114V47.726L7.24,43.494a1.782,1.782,0,0,1,2.3.111l4.046,3.564a3.49,3.49,0,0,0,2.19.817A3.378,3.378,0,0,0,17.56,47.5l7.313-4.232v7.2Zm0-8.947L16.78,46.241a1.893,1.893,0,0,1-2.19-.186l-4.083-3.6a3.3,3.3,0,0,0-4.121-.149l-4.9,3.564V35.29a1.5,1.5,0,0,1,1.374-1.6H23.24a1.708,1.708,0,0,1,1.633,1.6v6.237Zm4.2-9.518v.015L27.323,47.1a1.262,1.262,0,0,1-.483,1c-.149.149-.483.223-.483.3V35.29a3.193,3.193,0,0,0-3.118-3.081H5.5l.334-2.9a1.708,1.708,0,0,1,.557-.965,1.708,1.708,0,0,1,1.114-.3L27.732,30.39A1.485,1.485,0,0,1,29.069,32.009Z" transform="translate(0 -26.576)" fill="#9d0e71" />
                                      </g>
                                    </g>
                                    <rect id="Rectangle_8528" data-name="Rectangle 8528" width="35" height="35" transform="translate(195 370)" fill="none" />
                                  </g>
                                </svg>
                              </i>
                              Image Gallery
                            </button>
                          </li>
                          <li className="nav-item" role="presentation">
                            <button className={tab == "video" ? `nav-link active` : `nav-link`} id="video-gallery-tab" data-bs-toggle="tab" data-bs-target="#video-gallery" type="button" role="tab" aria-controls="video-gallery" aria-selected="false">Video Gallery
                              <i>
                                <svg xmlns="http://www.w3.org/2000/svg" width="35" height="35" viewBox="0 0 35 35">
                                  <g id="Video_Galley_Active" data-name="Video Galley_Active" transform="translate(-409 -370)">
                                    <g id="Page-1_26_" transform="translate(414 375)">
                                      <g id="web_export_26_">
                                        <path id="play_x2C_-gallery_x2C_-video_x2C_-copy_x2C_-list" d="M316.9,796.9v1.493a2.985,2.985,0,0,1-2.985,2.985H298.985A2.985,2.985,0,0,1,296,798.393V783.466a2.985,2.985,0,0,1,2.985-2.985h1.493v-1.493A2.985,2.985,0,0,1,303.463,776H318.39a2.985,2.985,0,0,1,2.985,2.985v14.926a2.985,2.985,0,0,1-2.985,2.985H316.9Zm-16.419-14.927h-1.493a1.493,1.493,0,0,0-1.493,1.493v14.927a1.493,1.493,0,0,0,1.493,1.493h14.926a1.493,1.493,0,0,0,1.493-1.493V796.9H303.463a2.985,2.985,0,0,1-2.985-2.985Zm2.985-4.478a1.493,1.493,0,0,0-1.493,1.493v14.926a1.493,1.493,0,0,0,1.493,1.493H318.39a1.493,1.493,0,0,0,1.493-1.493V778.989a1.493,1.493,0,0,0-1.493-1.493H303.463Zm4.1,5.224a.746.746,0,0,1,1.16-.621l5.6,3.732a.746.746,0,0,1,0,1.242l-5.6,3.732a.746.746,0,0,1-1.16-.621Zm1.493,1.395v4.674l3.506-2.337Z" transform="translate(-296 -776.003)" fill="#9d0e71" />
                                      </g>
                                    </g>
                                    <rect id="Rectangle_8529" data-name="Rectangle 8529" width="35" height="35" transform="translate(409 370)" fill="none" />
                                  </g>
                                </svg>
                              </i>
                              Video Gallery
                            </button>
                          </li>
                        </ul>
                      </div>
                      <div className={'col-12 col-md-6 filter-section text-end'}>
                    <div className={'form-select custom-select '}>
                        <select onChange={(e) => this.handleFilter(e)}>

                          <option value="0">Filter By</option>currentPage
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
                  <div className="tab-content">
                    <div className={tab == "image" ? `tab-pane fade show active` : `tab-pane fade `} id="image-gallery" role="tabpanel" aria-labelledby="image-gallery-tab">
                      <div className="row">
                        {
                          this.state.pageData.length>0?
                          this.state.pageData.map((folder) => {
                            const targetUrl = `${this.props.siteUrl}/SitePages/Photos.aspx?folderName=${folder.Name}&libraryPath=${libraryPath}`
                            return (
                              <div className=" col-md-3">
                                <div className="gallery-item">
                                  <a href="javascript:void(0)" onClick={(e) => this.getImageGalleryItems(folder.Name)}>
                                    <div className="gallery-item--img">
                                      <img src={`${this.props.siteUrl}/Assets/images/gallery-item-img.png`} alt="" />
                                    </div>
                                    <div className="gallery-item--text">
                                      <p>{folder.Name}</p>
                                    </div>
                                  </a>
                                </div>
                              </div>
                            )
                          })
                          :
                          <div  className={'invalidTxt'}>
                            NO IMAGES
                          </div>
                        }
                      </div>
                      <div className={'pagination-wrapper'} style={{ display: this.state.totalPage > 0 ? 'block' : 'none' }} >
                        <Paging currentPage={this.state.currentPage}
                          totalItems={this.state.filterData.length}
                          itemsCountPerPage={this.state.pageSize}
                          onPageUpdate={(page) => this._getPage(page)}
                        />
                      </div>
                    </div>
                    <div className={tab == "video" ? `tab-pane fade show active` : `tab-pane fade `} id="video-gallery" role="tabpanel" aria-labelledby="video-gallery-tab">
                      <div className="row">
                        {
                          this.state.pageData.length>0?
                          this.state.videoItems.map((item) => {
                            const imageUrl = this.getImageUrl(item.VideoThumbnail);
                            //  const navUrl = item.NavigationUrl ? item.NavigationUrl.Url : '';
                            return (
                              <div className="col-md-3">
                                <div className="gallery-item video-gallery-item">
                                  <a href="javascript:void(0);" onClick={() => this.openVideo(item.ID)} data-toggle="lightbox" data-gallery="image-gallery" data-video-caption="asdsad">
                                    <div className="gallery-item--img">
                                      <img src={imageUrl} alt="" />
                                    </div>
                                    <div className="gallery-item--button">
                                      <button><img src={`${this.props.siteUrl}/Assets/images/icon-play.svg`} alt="" /></button>
                                    </div>
                                  </a>
                                </div>
                              </div>
                            )
                          })
                          :
                          <div  className={'invalidTxt'}>
                            NO VIDEOS
                          </div>
                        
                        }

                      </div>

                      {/* paging */}
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
              </div>
            </div>
          </div>

          :

          <div style={{ display: this.state.selectedImageFolder ? 'none' : 'block' }}>
            <div className='propertiesWarning'>Please configure library name & path.</div>
          </div>

        }

        <div className="main-content" style={{ display: this.state.selectedImageFolder ? 'block' : 'none' }}>
          <div className="content-wrapper">
            <div className="container">
              <div className="tabs">
                <div className="tab-header">
                  <div className="row">
                    <div className="col-md-12">
                      <ul className="nav">
                        <li className="nav-item" role="presentation">
                          <a href="javascript:void(0)" onClick={(e) => this.closeImageFolder()} className="nav-link">
                            <i>
                              <svg xmlns="http://www.w3.org/2000/svg" width="23.916" height="23.916" viewBox="0 0 23.916 23.916">
                                <g id="Group_8097" data-name="Group 8097" transform="translate(23.916 0) rotate(90)">
                                  <g id="Group_7978" data-name="Group 7978" transform="translate(0)">
                                    <path id="Path_73804" data-name="Path 73804" d="M25.836,13.135a.5.5,0,1,0-.681.721l4.079,3.853-4.079,3.853a.5.5,0,1,0,.681.721L30.3,18.069a.5.5,0,0,0,0-.721l-4.461-4.213Z" transform="translate(-15.802 -6.254)" fill="#666" />
                                    <path id="Path_73805" data-name="Path 73805" d="M11.958,0A11.957,11.957,0,0,0,3.5,20.413,11.957,11.957,0,1,0,20.413,3.5,11.877,11.877,0,0,0,11.958,0Zm7.4,19.356A10.462,10.462,0,1,1,4.56,4.56a10.462,10.462,0,1,1,14.8,14.8Z" transform="translate(0 0)" fill="#666" />
                                  </g>
                                </g>
                              </svg>
                            </i>
                            {this.state.selectedImageFolder}
                          </a>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
                <div className="row">
                  {
                    this.state.imageItems.length>0?
                    this.state.imageItems.map((items) => {
                      debugger;
                      const test = items.ServerRelativeUrl;
                      return (
                        // <a href="images/gallery-folder-img-large.png" data-toggle="lightbox" data-gallery="image-gallery" className="col-md-3 gallery-item gallery-folder-item" data-caption="<h2>Lorem ipsum dolor sit amet, consectetur adipiscing elit</h2><p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p><ul><li><i class='icon user-icon'><img src='images/icon-avatar.svg'></i> Debra Teles</li></ul>">
                        //   <img src={`${this.props.siteUrl}/Assets/images/gallery-folder-img.png`} alt="" className="gallery-item--img" />
                        // </a>
                        <a href={'javascript:void(0);'} onClick={(e) => this.previewImage(e)} data-src={items.ServerRelativeUrl} data-id={1} data-toggle="lightbox" data-gallery="image-gallery"
                         className=" col-6 col-md-3 gallery-item gallery-folder-item" data-caption="<h2>Lorem ipsum dolor sit amet, consectetur adipiscing elit</h2><p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p><ul><li><i class='icon user-icon'><img src='images/icon-avatar.svg'></i> Debra Teles</li></ul>">
                          <img src={items.ServerRelativeUrl} alt={items.Title} style={{ width: '100%' }} data-src={items.ServerRelativeUrl} data-id={1} className="gallery-item--img" />
                        </a>
                      )
                    })
                    :
                          <div  className={'invalidTxt'}>
                            NO IMAGES
                          </div>
                        
                  }
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="imgOverlay" style={{ display: this.state.showVideo ? 'block' : 'none' }}>
          <div className="header">
            <Icon iconName="Cancel" onClick={() => this.closeVideoPreview()} />
          </div>
          <div className="videoPreview">
            <div className="video-wrapper">
              <div className="video-container text-center">
                <video controls src={this.state.selectedItem.FileRef} autoPlay>
                  Your browser does not support the video tag.
                </video>
              </div>
            </div>
          </div>
        </div>

        <div className="imgOverlay" style={{ display: this.state.preview ? 'block' : 'none' }}>
          <div className="header">
            <Icon iconName="Cancel" onClick={() => this.closePreview()} />
          </div>
          <div className="imagePreview">
            <div className='arrowContainer'>
              <Icon iconName="ChevronLeft" onClick={() => this.prevImage()} />
            </div>
            <div className="img-wrapper">
              <div className="img-container">
                <img src={imageUrl} />
              </div>
            </div>
            <div className='arrowContainer'>
              <Icon iconName="ChevronRight" onClick={() => this.nextImage()} />
            </div>
          </div>
        </div>

      </div>
    );
  }
}
