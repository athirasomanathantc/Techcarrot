import * as React from 'react';
import styles from './AgiIntranetGalleryListing.module.scss';
import { IAgiIntranetGalleryListingProps } from './IAgiIntranetGalleryListingProps';
import { escape } from '@microsoft/sp-lodash-subset';
import { sp } from '@pnp/sp/presets/all';
import { IAgiIntranetGalleryListingState } from './IAgiIntranetGalleryListingState';
import { LIBRARY_PHOTO_GALLERY, LIBRARY_VIDEO_GALLERY, LIST_GALLERY_TITLE, NULL_SELECTED_ITEM, PATH_PHOTO_GALLERY, PROP_DEFAULT_ORDERBY } from '../common/constants';
import {
  SPHttpClient,
  SPHttpClientResponse,
  IHttpClientOptions
} from '@microsoft/sp-http';
import { IFolderItem } from '../models/IFolderItem';
import { IImageItem } from '../models/IImageItem';
import { Icon } from 'office-ui-fabric-react';
import { Pagination } from '@pnp/spfx-controls-react/lib/pagination';
import Paging from './Paging/Paging';
import { IGalleryTitle } from '../models/IGalleryTitle';

export default class AgiIntranetGalleryListing extends React.Component<IAgiIntranetGalleryListingProps, IAgiIntranetGalleryListingState> {

  constructor(props: IAgiIntranetGalleryListingProps) {
    super(props);
    sp.setup({
      spfxContext: this.props.context
    });
    this.state = {
      folders: [],
      files: [],
      videoItems: [],
      imageItems: [],
      selectedImageFolder:'',
      selectedItem: NULL_SELECTED_ITEM,
      selectedVideoUrl: '',
      imageTitle: '',
      videoTitle: '',
      showVideo: false,
      // filterData: [],
      // filterValues: [],
      // pageData: [],
      // totalPages: 0,
      // currentPage: 1,
      // pageSize:0
    }

  }

  public async componentDidMount(): Promise<void> {
    this.getGalleryItems();
    this.getVideoItems();
  }

  // private handleFilter(e: any) {
  //   const value = parseInt(e.target.value);
  //   if (value == 0) {
  //     const result: IFolderItem[] = this.state.imageItems;
  //     this.setState({
  //       filterData: result
  //     },()=>{
  //       this.paging();
  //     });

  //   } else {
  //     const result = this.state.imageItems.filter((obj) => {
  //       return obj..ID == value;
  //     })
      
  //     this.setState({
  //       filterData: result
  //     },()=>{
  //       this.paging();
  //     });
      
      
  //   }
  // }

  private async getGalleryItems(): Promise<void> {
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
          console.log(folders);
          const _folders = [];
          folders.map((folder) => {
            const path = `${this.props.context.pageContext.web.serverRelativeUrl}/${libraryPath}/${folder.Name}`;
            console.log('path', path);
            const _files = files.filter((file) => {
              const folderPath = file.FileRef.replace(`/${file.FileLeafRef}`, '');
              return folderPath == path;
            });
            //console.log(folder.Name, _files);
            const count = _files.length;
            _folders.push({ ID: folder.ListItemAllFields.ID, Name: folder.Name, Count: count })
          });
          this.setState({
            folders: _folders
          });
        })
      })
      .catch((error) => {
        console.log(error);
      });

  }

  private getImageUrl(imageContent: string): string {
    if (!imageContent) {
      return;
    }

    const imageObj: any = JSON.parse(imageContent);
    return imageObj.serverUrl + imageObj.serverRelativeUrl;
  }

  private async getImageGalleryItems(subFolderName): Promise<void> {
    sp.web.folders.getByName(LIBRARY_PHOTO_GALLERY).folders.getByName(subFolderName).files.get().then((allItems) => {
      this.setState({
        imageItems: allItems,
        selectedImageFolder: subFolderName
      });
    });
  }
  private async getTitleImage(): Promise<void> {
    sp.web.lists.getByTitle('TitleConfig').items.filter("Title eq 'Image Gallery Title'")
      .get().then((items: any) => {
        this.setState({
          imageTitle: items[0]?.Header
        });
      });
  }
  private async getTitleVideo(): Promise<void> {
    sp.web.lists.getByTitle('TitleConfig').items.filter("Title eq 'Video Gallery Title'")
      .get().then((items: any) => {
        this.setState({
          videoTitle: items[0]?.Header
        });
      });
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
    //debugger;
    const selectedItem = this.state.videoItems.filter(item => item.ID == id)[0];
    this.setState({
      selectedItem
    });
    this.setState({
      showVideo: true
    });
  }


  private closePreview() {
    this.setState({
      showVideo: false,
      selectedVideoUrl: ''
    });
  }
  private getQueryStringValue(param: string):string{
    const params =new URLSearchParams(window.location.search);
    let value=params.get(param)|| '';
    return value;
  }


  public render(): React.ReactElement<IAgiIntranetGalleryListingProps> {
    const libraryPath = this.props.libraryPath;
    const tab=this.getQueryStringValue('tab');
    return (
      <div className={styles.agiIntranetGalleryListing}>
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
                            <button className={tab=="image"? 'nav-link active':'nav-link'} id="image-gallery-tab" data-bs-toggle="tab" data-bs-target="#image-gallery" type="button" role="tab" aria-controls="image-gallery" aria-selected="true"><img src={`${this.props.siteUrl}/Assets/icons/icon-location.png`}>
                            </img>{this.state.imageTitle}
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
                            </button>
                          </li>
                          <li className="nav-item" role="presentation">
                            <button className={tab=="video"? 'nav-link active':'nav-link'} id="video-gallery-tab" data-bs-toggle="tab" data-bs-target="#video-gallery" type="button" role="tab" aria-controls="video-gallery" aria-selected="false">{this.state.videoTitle}
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
                            </button>
                          </li>
                        </ul>
                      </div>
                      <div className="col-md-6">
                        <form action="" className="search-bar d-md-flex d-none search-bar mt-3 mt-md-0">
                          <div className="input-group">
                            <input type="text" className="form-control form-control-lg" placeholder="Search Here" />
                            <button type="submit" className="input-group-text btn-serach"><i className="bi bi-search"><img
                              src="images/icon-search.svg" alt="" /></i></button>
                          </div>
                        </form>
                      </div>
                    </div>
                  </div>
                  <div className="tab-content">
                    <div className="tab-pane fade show active" id="image-gallery" role="tabpanel" aria-labelledby="image-gallery-tab">
                      <div className="row">
                        {
                          this.state.folders.map((folder) => {
                            const targetUrl = `${this.props.siteUrl}/SitePages/Photos.aspx?folderName=${folder.Name}&libraryPath=${libraryPath}`
                            return (
                              <div className="col-md-3">
                                <div className="gallery-item">
                                  <a href="javascript:void(0)" onClick={(e)=>this.getImageGalleryItems(folder.Name)}>
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
                        }
                      </div>
                      <div className="row">
                        <nav className="mt-3" aria-label="Page navigation example">
                          <ul className="pagination justify-content-center justify-content-md-end align-items-center">
                            <li className="page-item">
                              <a className="page-link" href="#" aria-label="Previous">
                                <span aria-hidden="true">&laquo;</span>
                              </a>
                            </li>
                            <li className="page-item active"><a className="page-link" href="#">1</a></li>
                            <li className="page-item"><a className="page-link" href="#">2</a></li>
                            <li className="page-item"><a className="page-link" href="#">3</a></li>
                            <li className="page-item"><a className="page-link" href="#">...</a></li>
                            <li className="page-item">
                              <a className="page-link" href="#" aria-label="Next">
                                <span aria-hidden="true">&raquo;</span>
                              </a>
                            </li>
                          </ul>
                        </nav>
                      </div>
                    </div>
                    <div className="tab-pane fade" id="video-gallery" role="tabpanel" aria-labelledby="video-gallery-tab">
                      <div className="row">
                        {
                          this.state.videoItems.map((item, i) => {
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
                        }

                      </div>
                      <div className="row">
                        <nav className="mt-3" aria-label="Page navigation example">
                          <ul className="pagination justify-content-center justify-content-md-end align-items-center">
                            <li className="page-item">
                              <a className="page-link" href="#" aria-label="Previous">
                                <span aria-hidden="true">&laquo;</span>
                              </a>
                            </li>
                            <li className="page-item active"><a className="page-link" href="#">1</a></li>
                            <li className="page-item"><a className="page-link" href="#">2</a></li>
                            <li className="page-item"><a className="page-link" href="#">3</a></li>
                            <li className="page-item"><a className="page-link" href="#">...</a></li>
                            <li className="page-item">
                              <a className="page-link" href="#" aria-label="Next">
                                <span aria-hidden="true">&raquo;</span>
                              </a>
                            </li>
                          </ul>
                        </nav>
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
                          <a href="javascript:void(0)" onClick={(e) =>this.closeImageFolder()} className="nav-link">
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
                    this.state.imageItems.map((items) => {
                      return (
                        <a href="images/gallery-folder-img-large.png" data-toggle="lightbox" data-gallery="image-gallery" className="col-md-3 gallery-item gallery-folder-item" data-caption="<h2>Lorem ipsum dolor sit amet, consectetur adipiscing elit</h2><p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p><ul><li><i class='icon user-icon'><img src='images/icon-avatar.svg'></i> Debra Teles</li></ul>">
                          <img src={`${this.props.siteUrl}/Assets/images/gallery-folder-img.png`} alt="" className="gallery-item--img" />
                        </a>
                      )
                    })
                  }
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="imgOverlay" style={{ display: this.state.showVideo ? 'block' : 'none' }}>
          <div className="header">
            <Icon iconName="Cancel" onClick={() => this.closePreview()} />
          </div>
          <div className="videoPreview">
            <div className="video-wrapper">
              <div className="video-container">
                <video controls src={this.state.selectedItem.FileRef} autoPlay>
                  Your browser does not support the video tag.
                </video>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
