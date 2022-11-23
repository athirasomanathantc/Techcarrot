import * as React from 'react';
import styles from './AgiCorpIntranetImageVideoGallery.module.scss';
import { IAgiCorpIntranetImageVideoGalleryProps } from './IAgiCorpIntranetImageVideoGalleryProps';
import { sp } from '@pnp/sp/presets/all';
import { IAgiCorpIntranetImageVideoGalleryState } from './IAgiCorpIntranetImageVideoGalleryState';
import { LIBRARY_VIDEO_GALLERY, MEDIA_PER_PAGE, NULL_IMAGE_ITEM, NULL_SELECTED_ITEM, PROP_DEFAULT_ORDERBY } from '../common/constants';
import {
  SPHttpClient,
  SPHttpClientResponse
} from '@microsoft/sp-http';
import { IImageItem } from '../models/IImageItem';
import { Icon } from 'office-ui-fabric-react';
import * as $ from 'jquery';
//import { Icon } from 'office-ui-fabric-react/lib/components/Icon/Icon';
//import { Pagination } from '@pnp/spfx-controls-react/lib/pagination';
//import Paging from './Paging/Paging';
import Paging from './Paging/Paging';
import { IFileItem } from '../models/IFileItem';
import FeaturedGallery from './FeaturedGallery/FeaturedGallery';
const CAROUSEL_HEIGHT = '240px';
export default class AgiCorpIntranetImageVideoGallery extends React.Component<IAgiCorpIntranetImageVideoGalleryProps, IAgiCorpIntranetImageVideoGalleryState> {

  constructor(props: IAgiCorpIntranetImageVideoGalleryProps) {
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
      currentImageTitle: '',
      currentImageDescription: '',
      currentImageAuthorName: '',
      currentTabName: '',
      folderData: [],
      filterData: [],
      filterVideoData: [],
      pageData: [],
      videoData: [],
      totalPages: 0,
      currentPageImage: 1,
      currentPageVideo: 1,
      pageSize: 0,
      totalPage: 1,
      pageVideoSize: 0,
      totalVideoPage: 1,
      curFilterValue: 0,
      imageTitle: '',
      videoTitle: '',
      filterValuesBusiness: [],
      filterValuesFunctions: [],
      showBusinessData: true,
      selectedOption: {
        ID: 0
      },
      isDataLoaded: false,

      pagedImages: [],
      imagesPerPage: MEDIA_PER_PAGE,
      totalImages: 0,
      imagesCurrentPage: 1,
      fileData: [],
      isFeatured: false,
      featured: {
        fileData: [],
        imageItems: [],
        pagedImages: [],
        totalImages: 0,
        imagesPerPage: MEDIA_PER_PAGE,
        selectedImageFolder: '',
        imagesCurrentPage: 1,
        pageData: [],
        videoData: [],
        totalPage: 1,
        currentPage: 1,
        filterVideoData: [],
        pageVideoSize: 0,
        imageGalleryTitle: '',
        videoGalleryTitle: '',
      }
    }
    // this.getImages = this.getImages.bind(this);
  }

  public async componentDidMount(): Promise<void> {
    await this.getBusinessItems();
    await this.getFunctionItems();
    await this.getCoverPhotos();
    await this.getTitleImage();
    await this.getTitleVideo();
    await this.getConfigItems();
    Promise.all([this.getGalleryItems(), this.getVideoItems()]).then(() => {
      this.setDefaultFilter();
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

  private getConfigItems() {
    const url = `${this.props.siteUrl}/_api/web/lists/getbytitle('IntranetConfig')/items?$filter=(Title eq 'FeaturedGallery')&$top=1`;
    this.props.context.spHttpClient.get(url, SPHttpClient.configurations.v1)
      .then((response: SPHttpClientResponse) => {
        return response.json();
      })
      .then((response) => {
        const items = response.value;

        this.setState({
          featured: {
            ...this.state.featured,
            imageGalleryTitle: items[0]?.Detail?.split(';')[0]?.trim(),
            videoGalleryTitle: items[0]?.Detail?.split(';')[1]?.trim()
          }
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

    const url1 = `${this.props.siteUrl}/_api/web/lists/getbytitle('Business')/items`;
    this.props.context.spHttpClient.get(url1, SPHttpClient.configurations.v1)
      .then((response: SPHttpClientResponse) => {
        return response.json();
      })
      .then((response) => {
        const items = response.value;
        //console.log('choices', items);
        this.setState({
          filterValuesBusiness: items
        });

      })
      .catch((error) => {
        console.log('Error:', error);
      })
    if (window.innerWidth <= 767) {
      this.setState({
        pageSize: 6,
        pageVideoSize: 6
      });

    } else {
      this.setState({
        pageSize: 12,
        pageVideoSize: 12
      });

    }

  }

  private async getFunctionItems(): Promise<void> {

    const url1 = `${this.props.siteUrl}/_api/web/lists/getbytitle('Functions')/items`;
    this.props.context.spHttpClient.get(url1, SPHttpClient.configurations.v1)
      .then((response: SPHttpClientResponse) => {
        return response.json();
      })
      .then((response) => {
        const items = response.value;
        //console.log('choices', items);
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

  private handleFilter(value: number) {
    this.setState({
      curFilterValue: value,
      selectedOption: {
        ID: value
      },
      isDataLoaded: true
    }, () => {
      this.setData();
    });

  }

  private setData() {
    const value = this.state.curFilterValue;
    if (this.state.currentTabName == "image") {

      if (value == 0) {
        const result: IImageItem[] = this.state.folders.filter((obj) => {
          const itemId = this.state.showBusinessData ? obj.BusinessId : obj.FunctionsId;
          return itemId !== null;
        });
        this.setState({
          filterData: result
        }, () => {
          //console.log("filter data", this.state.filterData);
          this.paging();
        });

      } else {
        const result = this.state.folders.filter((obj) => {
          const itemId = this.state.showBusinessData ? obj.BusinessId : obj.FunctionsId;
          return itemId == value;
        })
        //console.log(result);
        this.setState({
          filterData: result
        }, () => {
          this.paging();
        });

      }
    }
    else if (this.state.currentTabName == "video") {

      if (value == 0) {
        const result: IImageItem[] = this.state.videoItems.filter((obj) => {
          const itemId = this.state.showBusinessData ? obj.BusinessId : obj.FunctionsId;
          return itemId !== null;
        });
        console.log('result', result);
        this.setState({
          filterVideoData: result
        }, () => {
          this.paging();
        });

      } else {
        const result = this.state.videoItems.filter((obj) => {
          const itemId = this.state.showBusinessData ? obj.BusinessId : obj.FunctionsId;
          return itemId == value;
        })
        //console.log(result);
        this.setState({
          filterVideoData: result
        }, () => {
          this.paging();
        });

      }
    }
    else {
      const tab = this.getQueryStringValue('tab');

      if (tab == "image") {
        if (value == 0) {
          const result: IImageItem[] = this.state.folders.filter((obj) => {
            const itemId = this.state.showBusinessData ? obj.BusinessId : obj.FunctionsId;
            return itemId !== null;
          });
          this.setState({
            filterData: result
          }, () => {
            this.paging();
          });

        } else {
          const result = this.state.folders.filter((obj) => {
            const itemId = this.state.showBusinessData ? obj.BusinessId : obj.FunctionsId;
            return itemId == value;
          })
          //console.log(result);
          this.setState({
            filterData: result
          }, () => {
            this.paging();
          });

        }
      }
      else if (tab == "video") {
        if (value == 0) {
          const result: IImageItem[] = this.state.videoItems.filter((obj) => {
            const itemId = this.state.showBusinessData ? obj.BusinessId : obj.FunctionsId;
            return itemId !== null;
          });
          this.setState({
            filterVideoData: result
          }, () => {
            this.paging();
          });

        } else {
          const result = this.state.videoItems.filter((obj) => {
            const itemId = this.state.showBusinessData ? obj.BusinessId : obj.FunctionsId;
            return itemId == value;
          })
          //console.log(result);
          this.setState({
            filterVideoData: result
          }, () => {
            this.paging();
          });

        }
      }
    }
  }

  private getFeaturedData(items) {
    let dateA;
    let dateB;
    return items.filter((item) => item.Featured).sort((a, b) => {
      dateA = a.Modified;
      dateB = b.Modified;
      return (new Date(dateB).getTime() - new Date(dateA).getTime())
    }).slice(0, 4)
  }

  private paging() {
    if (this.state.currentTabName == "image") {
      const pageCount: number = Math.ceil(this.state.filterData.length / this.state.pageSize);
      const totalPages = (this.state.filterData.length / this.state.pageSize) - 1;
      this.setState({
        pageData: this.state.filterData.slice(0, this.state.pageSize),
        featured: {
          ...this.state.featured,
          pageData: this.getFeaturedData(this.state.folders),
        },
        totalPages: pageCount,
        totalPage: pageCount,
        currentPageImage: 1
      }, () => {
        //console.log("imagedata", this.state.pageData);
      });
    }
    else if (this.state.currentTabName == "video") {
      const pageCount: number = Math.ceil(this.state.filterVideoData.length / this.state.pageSize);
      const totalPages = (this.state.filterVideoData.length / this.state.pageSize) - 1;
      console.log("video pagecount", pageCount);
      this.setState({
        videoData: this.state.filterVideoData.slice(0, this.state.pageSize),
        totalPages: pageCount,
        totalPage: pageCount,
        currentPageVideo: 1,
        featured: {
          ...this.state.featured,
          videoData: this.getFeaturedData(this.state.videoItems),
        },
      }, () => {
        console.log("videodata", this.state.videoData);
      });
    }
    else {
      const tab = this.getQueryStringValue('tab');
      if (tab == "image") {
        const pageCount: number = Math.ceil(this.state.filterData.length / this.state.pageSize);
        const totalPages = (this.state.filterData.length / this.state.pageSize) - 1;
        this.setState({
          pageData: this.state.filterData.slice(0, this.state.pageSize),
          featured: {
            ...this.state.featured,
            pageData: this.getFeaturedData(this.state.folders),
          },
          totalPages: pageCount,
          totalPage: pageCount,
          currentPageImage: 1
        });
      }
      else if (tab == "video") {
        const pageCount: number = Math.ceil(this.state.filterVideoData.length / this.state.pageSize);
        const totalPages = (this.state.filterVideoData.length / this.state.pageSize) - 1;
        this.setState({
          videoData: this.state.filterVideoData.slice(0, this.state.pageSize),
          totalPages: pageCount,
          totalPage: pageCount,
          currentPageVideo: 1,
          featured: {
            ...this.state.featured,
            videoData: this.getFeaturedData(this.state.videoItems),
          },
        });
      }
    }
  }

  private _getPage(page: number) {

    if (this.state.currentTabName == "image") {
      const skipItems: number = this.state.pageSize * (page - 1);
      const takeItems: number = skipItems + this.state.pageSize;
      const roundupPage = Math.ceil(page);
      const pageData = this.state.filterData.slice(skipItems, takeItems)
      this.setState({
        pageData,
        currentPageImage: page
      }, () => {
        this.scrollToTop(false);

      });
    }
    else if (this.state.currentTabName == "video") {
      const skipItems: number = this.state.pageVideoSize * (page - 1);
      const takeItems: number = skipItems + this.state.pageVideoSize;
      const roundupPage = Math.ceil(page);
      const videoData = this.state.filterVideoData.slice(skipItems, takeItems)
      this.setState({
        videoData,
        currentPageVideo: page
      }, () => {
        this.scrollToTop(false);

      });
    }
    else {
      const tab = this.getQueryStringValue('tab');
      if (tab == "image") {
        const skipItems: number = this.state.pageSize * (page - 1);
        const takeItems: number = skipItems + this.state.pageSize;
        const roundupPage = Math.ceil(page);
        const pageData = this.state.filterData.slice(skipItems, takeItems)
        this.setState({
          pageData,
          currentPageImage: page
        }, () => {
          this.scrollToTop(this.state.isFeatured);

        });
      }
      else if (tab == "video") {
        const skipItems: number = this.state.pageVideoSize * (page - 1);
        const takeItems: number = skipItems + this.state.pageVideoSize;
        const roundupPage = Math.ceil(page);
        const videoData = this.state.filterVideoData.slice(skipItems, takeItems)
        this.setState({
          videoData,
          currentPageVideo: page
        }, () => {
          this.scrollToTop(false);

        });
      }
    }
  }

  private onPageUpdateImages(page: number, isFeatured) {
    const skipItems: number = this.state.imagesPerPage * (page - 1);
    const takeItems: number = skipItems + this.state.imagesPerPage;
    const roundupPage = Math.ceil(page);
    const imageItems = isFeatured ? this.state.featured.imageItems : this.state.imageItems;
    const pagedImages = imageItems.slice(skipItems, takeItems)
    if (isFeatured) {
      this.setState({
        featured: {
          ...this.state.featured,
          pagedImages,
          imagesCurrentPage: page
        }
      }, () => {
        //console.log('currentpage',this.state.currentPage);
        this.scrollToTop(isFeatured);

      });
    }
    else {
      this.setState({
        pagedImages,
        imagesCurrentPage: page
      }, () => {
        this.scrollToTop(false);

      });
    }

  }

  private scrollToTop(isFeatured: boolean): void {

    var element = document.getElementById(isFeatured ? "galleryRoot" : "gallerySection");
    // var element = document.getElementById("galleryRoot");

    element.scrollIntoView(true);

  }

  private async getGalleryItems(): Promise<void> {
    return new Promise<void>(async (resolve) => {
      const libraryName = this.props.libraryName;
      const libraryPath = this.props.libraryPath;
      const library = sp.web.lists.getByTitle(libraryName);
      // get folders
      const orderByField = this.props.orderBy || PROP_DEFAULT_ORDERBY;
      await library.rootFolder.folders
        .filter('ListItemAllFields/Id ne null')
        .expand('ListItemAllFields')
        .orderBy(orderByField, true)
        .get()
        .then(async (folders: any) => {
          // get files
          await library.items
            .select('*, FileRef, FileLeafRef, Featured')
            .filter('FSObjType eq 0')
            .get()
            .then((files: IImageItem[]) => {
              //console.log("test", folders);
              const _folders = [];
              folders.map((folder) => {
                const path = `${this.props.context.pageContext.web.serverRelativeUrl}/${libraryPath}/${folder.Name}`;
                const _files = files.filter((file) => {
                  const folderPath = file.FileRef.replace(`/${file.FileLeafRef}`, '');
                  return folderPath == path;
                });
                const count = _files.length;
                _folders.push({
                  ID: folder.ListItemAllFields.ID,
                  Name: folder.Name,
                  Count: count,
                  BusinessId: folder.ListItemAllFields.BusinessId,
                  FunctionsId: folder.ListItemAllFields.FunctionsId,
                  Featured: folder.ListItemAllFields.Featured,
                  Modified: folder.ListItemAllFields.Modified
                })
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
      resolve();
    });
  }

  private getImageUrl(imageContent: string): string {
    if (!imageContent) {
      return;
    }

    const imageObj: any = JSON.parse(imageContent);
    return imageObj.serverUrl + imageObj.serverRelativeUrl;
  }

  /** get images from folder */

  private async getImageGalleryItems(subFolderName, isFeatured): Promise<void> {
    // sp.web.folders.getByName(LIBRARY_PHOTO_GALLERY).folders.getByName(subFolderName).files.select('*, FileRef, FileLeafRef').get().then((allItems) => {
    const libraryPath = `${this.props.context.pageContext.web.serverRelativeUrl}/Image Gallery/${subFolderName}`;
    sp.web.getFolderByServerRelativePath(libraryPath).files.select('*, FileRef, FileLeafRef, ID, Author/Title').expand("ListItemAllFields,Author").get().then((allItems) => {
      // sp.web.lists.getByTitle("Image Gallery").items
      // .select("*, FileRef, FileLeafRef, Created, File, ID, Title, Author/Title")
      // .expand("File, Author").get().then((allItems) => {
      const totalImages = allItems.length;
      const imagesPerPage = MEDIA_PER_PAGE;
      const pagedImages = allItems.slice(0, imagesPerPage);
      if (isFeatured) {
        this.setState({
          isFeatured,
          featured: {
            ...this.state.featured,
            imageItems: allItems,
            pagedImages,
            totalImages,
            imagesPerPage,
            selectedImageFolder: subFolderName,
            imagesCurrentPage: 1
          }
        });
      }
      else {
        this.setState({
          isFeatured,
          imageItems: allItems,
          pagedImages,
          totalImages,
          imagesPerPage,
          selectedImageFolder: subFolderName,
          imagesCurrentPage: 1
        });
      }
      this.scrollToTop(true);
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

  /** Get cover photos */
  private async getCoverPhotos(): Promise<void> {
    const fileData = [];
    const libraryPath = `${this.props.context.pageContext.web.serverRelativeUrl}/Image Gallery`;
    sp.web.lists.getByTitle('Image Gallery').items
      .select('*, File')
      .expand("File")
      .filter('FSObjType eq 0 and isCoverPhoto eq 1')
      .get().then((files: IFileItem[]) => {
        console.log('getCoverPhotos');
        files.map((file) => {
          const fileName = file.File.Name;
          const fileRelativePath = file.File.ServerRelativeUrl;
          const filePath = fileRelativePath.replace(fileName, '');
          const paths = filePath.split('/').filter(e => e);
          const folderPath = paths.pop();
          fileData.push({ ID: file.ID, FilePath: fileRelativePath, FolderName: folderPath });
        });
        this.setState({
          fileData,
          featured: {
            ...this.state.featured,
            fileData
          }
        });
      });
  }

  private closeImageFolder(isFeatured) {
    if (isFeatured) {
      this.setState({
        featured: {
          ...this.state.featured,
          imageItems: [],
          selectedImageFolder: ''
        }
      });
    }
    else {
      this.setState({
        imageItems: [],
        selectedImageFolder: ''
      });
    }

  }

  private async getVideoItems(): Promise<void> {
    return new Promise<void>(async (resolve) => {
      await sp.web.lists.getByTitle(LIBRARY_VIDEO_GALLERY).items
        .select('*, FileRef, FileLeafRef,Author/Title, Featured, Modified')
        .expand("Author")
        .filter('FSObjType eq 0')
        .orderBy('DisplayOrder')
        .get().then((items: IImageItem[]) => {
          this.setState({
            videoItems: items,
            videoData: items,
            filterVideoData: items
          }, () => {
            //',this.state.filterVideoData);
            this.paging();
          });
        });
      resolve();
    });
  }

  private openVideo(id, isFeatured) {
    this.scrollToTop(isFeatured);
    const selectedItem = this.state.videoItems.filter(item => item.ID == id)[0];
    this.setState({
      selectedItem
    }, () => {
      //console.log("videoitem", this.state.selectedItem.Author.Title);
    });
    this.setState({
      showVideo: true
    });
  }


  private closePreview(): void {
    this.setState({
      showVideo: false,
      selectedItem: NULL_SELECTED_ITEM,
      selectedVideoUrl: '',
      preview: false
    });
  }

  private closeVideoPreview(): void {
    this.setState({
      showVideo: false,
      selectedVideoUrl: '',
      selectedItem: NULL_SELECTED_ITEM
    });
  }

  private previewImage(e: any, isFeatured: boolean): void {
    const src = e.target.attributes["data-src"].value;
    const id = e.target.attributes["data-id"].value;
    const index = id ? parseInt(id) : -1;
    const imageItems = isFeatured ? this.state.featured.imageItems : this.state.imageItems;
    const _imageItem = imageItems.filter((image) => image.ListItemAllFields.ID == id);
    //console.log("imageitem", _imageItem);
    const imageItem = _imageItem && _imageItem.length > 0 ? _imageItem[0] : NULL_IMAGE_ITEM;
    this.setState({
      preview: true,
      currentImageUrl: src,
      currentImageTitle: imageItem.Name,
      currentImageDescription: imageItem.ImageDescription,
      currentImageAuthorName: imageItem.Author.Title,
      currentIndex: index
    }, () => {
      console.log("image title", this.state.currentImageTitle);
    })
  }

  private prevImage(isFeatured) {
    const index = this.state.currentIndex;
    const images = isFeatured ? this.state.featured.imageItems : this.state.imageItems;
    const arrayIndex = images.map(e => e.ListItemAllFields.ID).indexOf(index);
    const prevIndex = arrayIndex == 0 ? (images.length - 1) : arrayIndex - 1;
    const prevImage = images[prevIndex];
    this.setState({
      currentIndex: prevImage.ListItemAllFields.ID,
      currentImageUrl: prevImage.ServerRelativeUrl,
      currentImageTitle: prevImage.Name,
      currentImageDescription: prevImage.ImageDescription,
      currentImageAuthorName: prevImage.Author.Title
    });
  }

  private nextImage(isFeatured) {
    const index = this.state.currentIndex;
    const images = isFeatured ? this.state.featured.imageItems : this.state.imageItems;
    const arrayIndex = images.map(e => e.ListItemAllFields.ID).indexOf(index);
    const nextIndex = arrayIndex == (images.length - 1) ? 0 : arrayIndex + 1;
    const nextImage = images[nextIndex];
    this.setState({
      currentIndex: nextImage.ListItemAllFields.ID,
      currentImageUrl: nextImage.ServerRelativeUrl,
      currentImageTitle: nextImage.Name,
      currentImageDescription: nextImage.ImageDescription,
      currentImageAuthorName: nextImage.Author.Title
    });
  }

  private fnCurTab(tabName) {
    try {
      this.setState(
        {
          currentTabName: tabName
        },
        () => {
          this.setData();
          this.paging();
        }
      )
    }
    catch (e) {
      alert(e);
    }
  }

  private getWidgetHeight() {
    return CAROUSEL_HEIGHT;
  }
  private setWidgetHeight(className: string) {
    $('.' + className).css('height', this.getWidgetHeight());
    setTimeout(function () {
      //console.log('widGetHeightOverride'+ $('.'+className).find('img').height());
      $('.' + className).css('height', $('.' + className).find('img').height());
    }, 1500);
  }

  private getQueryStringValue(param: string): string {
    const params = new URLSearchParams(window.location.search);
    let value = params.get(param) || '';
    return value;
  }


  private renderImagePreviewModal(isFeatured): JSX.Element {

    return (
      <div className="imgOverlay" style={{ display: this.state.preview ? 'block' : 'none' }}>
        <div className="header">
          <Icon iconName="Cancel" onClick={() => this.closePreview()} />
        </div>
        <div className="imagePreview">
          <div className='arrowContainer'>
            <Icon iconName="ChevronLeft" onClick={() => this.prevImage(isFeatured)} />
          </div>
          <div className="img-wrapper" >
            <div className="img-container">
              <img src={this.state.currentImageUrl} />
            </div>
            <div className="imagePreviewCaption">
              <h2>{this.state.currentImageTitle}</h2>
              <p>{this.state.currentImageDescription}</p>
              <ul>
                <li>
                  <i className="icon user-icon"><img src={`${this.props.siteUrl}/Assets/icons/icon-avatar.svg`} /></i>
                  <span className='userName'>
                    {this.state.currentImageAuthorName}
                  </span>
                </li>
              </ul>
            </div>
          </div>
          <div className='arrowContainer'>
            <Icon iconName="ChevronRight" onClick={() => this.nextImage(isFeatured)} />
          </div>
        </div>
      </div>
    )
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

  public render(): React.ReactElement<IAgiCorpIntranetImageVideoGalleryProps> {
    const tab = this.getQueryStringValue('tab');
    const libraryPath = this.props.libraryPath;
    const imageUrl = this.state.currentImageUrl;
    const filterValues = this.state.showBusinessData ? this.state.filterValuesBusiness : this.state.filterValuesFunctions;

    const { featured } = this.state;
    return (
      <div className={styles.agiCorpIntranetImageVideoGallery} id="galleryRoot">
        {this.props.libraryName && this.props.libraryPath ?
          <>
            {!this.state.selectedImageFolder && <FeaturedGallery
              siteUrl={this.props.siteUrl}
              tab={tab}
              pageData={featured.pageData}
              getImageGalleryItems={(subFolderName) => this.getImageGalleryItems(subFolderName, true)}
              fileData={featured.fileData}
              selectedImageFolder={featured.selectedImageFolder}
              closeImageFolder={() => this.closeImageFolder(true)}
              pagedImages={featured.pagedImages}
              imageItems={featured.imageItems}
              previewImage={(e) => this.previewImage(e, true)}
              imagesCurrentPage={featured.imagesCurrentPage}
              totalImages={featured.totalImages}
              imagesPerPage={featured.imagesPerPage}
              onPageUpdateImages={(page) => this.onPageUpdateImages(page, this.state.featured)}
              fnCurTab={(tabName) => this.fnCurTab(tabName)}
              videoData={featured.videoData}
              getImageUrl={(imageContent) => this.getImageUrl(imageContent)}
              openVideo={(id) => this.openVideo(id, true)}
              imageGalleryTitle={featured.imageGalleryTitle}
              videoGalleryTitle={featured.videoGalleryTitle}
            ></FeaturedGallery>}
            {!featured.selectedImageFolder && <div id="gallerySection" className="main-content" style={{ display: this.state.selectedImageFolder ? 'none' : 'block' }}>
              <div className="content-wrapper" style={{ display: this.state.isDataLoaded ? 'block' : 'none' }}>
                <div className="container">
                  <div className="tabs">
                    <div className="tab-header">
                      <div className="row">
                        <div className="col-md-6">
                          <ul className="nav nav-tabs" id="myTab" role="tablist">
                            <li className="nav-item" role="presentation">
                              <button className={tab == "image" ? `nav-link active` : `nav-link`} id="image-gallery-tab" data-bs-toggle="tab" data-bs-target="#image-gallery" type="button" role="tab" aria-controls="image-gallery" aria-selected="true" onClick={(e) => this.fnCurTab("image")}>{this.state.imageTitle}
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
                              </button>
                            </li>
                            <li className="nav-item" role="presentation">
                              <button className={tab == "video" ? `nav-link active` : `nav-link`} id="video-gallery-tab" data-bs-toggle="tab" data-bs-target="#video-gallery" type="button" role="tab" aria-controls="video-gallery" aria-selected="false" onClick={(e) => this.fnCurTab("video")}>{this.state.videoTitle}
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
                              </button>
                            </li>
                          </ul>
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
                                <select id="ddlFilterValues" onChange={(e) => this.handleFilter(parseInt(e.target.value))}>

                                  <option value="0">Filter By</option>currentPage
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
                    <div className="tab-content">
                      <div className={tab == "image" ? `tab-pane fade show active` : `tab-pane fade `} id="image-gallery" role="tabpanel" aria-labelledby="image-gallery-tab">
                        <div className="row">
                          {
                            this.state.pageData.length > 0 ?
                              this.state.pageData.map((folder) => {
                                const folderName = folder.Name;
                                const targetUrl = `${this.props.siteUrl}/SitePages/Photos.aspx?folderName=${folder.Name}&libraryPath=${libraryPath}`;
                                const _folder = this.state.fileData.filter((f) => f.FolderName == folderName);
                                const coverImage = _folder && _folder.length > 0 ? _folder[0].FilePath : `${this.props.siteUrl}/Assets/images/gallery-item-img.png`;
                                return (
                                  <div className=" col-md-3">
                                    <div className="gallery-item">
                                      <a href="javascript:void(0)" onClick={(e) => this.getImageGalleryItems(folder.Name, this.state.isFeatured)}>
                                        <div className="gallery-item--img">
                                          <img src={coverImage} alt="" />
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
                              <div className={'invalidTxt'}>
                                NO IMAGES
                              </div>
                          }
                        </div>
                        <div className={'pagination-wrapper'} style={{ display: this.state.totalPage > 0 ? 'block' : 'none' }} >
                          <Paging currentPage={this.state.currentPageImage}
                            totalItems={this.state.filterData.length}
                            itemsCountPerPage={this.state.pageSize}
                            onPageUpdate={(page) => this._getPage(page)}
                          />
                        </div>
                      </div>
                      <div className={tab == "video" ? `tab-pane fade show active` : `tab-pane fade `} id="video-gallery" role="tabpanel" aria-labelledby="video-gallery-tab">
                        <div className="row">
                          {
                            //this.state.videoItems.map((item, i) => {
                            this.state.videoData.length > 0 ?
                              this.state.videoData.map((item, i) => {
                                const imageUrl = this.getImageUrl(item.VideoThumbnail);
                                //  const navUrl = item.NavigationUrl ? item.NavigationUrl.Url : '';
                                return (
                                  <div className="col-md-3">
                                    <div className="gallery-item video-gallery-item">
                                      <a href="javascript:void(0);" onClick={() => this.openVideo(item.ID, false)} data-toggle="lightbox" data-gallery="image-gallery" data-video-caption="asdsad">
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
                              <div className={'invalidTxt'}>
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
                          <Paging currentPage={this.state.currentPageVideo}
                            totalItems={this.state.filterVideoData.length}
                            itemsCountPerPage={this.state.pageVideoSize}
                            onPageUpdate={(page) => this._getPage(page)}
                          />
                        </div>

                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className='loaderContainer' style={{ display: this.state.isDataLoaded ? 'none' : 'flex' }}>
                <div className="loader">
                </div>
              </div>
            </div>}
          </>
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
                          <a href="javascript:void(0)" onClick={(e) => this.closeImageFolder(false)} className="nav-link">
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
                    this.state.pagedImages.map((items) => {
                      const test = items.ServerRelativeUrl;
                      return (
                        // <a href="images/gallery-folder-img-large.png" data-toggle="lightbox" data-gallery="image-gallery" className="col-md-3 gallery-item gallery-folder-item" data-caption="<h2>Lorem ipsum dolor sit amet, consectetur adipiscing elit</h2><p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p><ul><li><i class='icon user-icon'><img src='images/icon-avatar.svg'></i> Debra Teles</li></ul>">
                        //   <img src={`${this.props.siteUrl}/Assets/images/gallery-folder-img.png`} alt="" className="gallery-item--img" />
                        // </a>
                        <a href={'javascript:void(0);'} onClick={(e) => this.previewImage(e, false)} data-src={items.ServerRelativeUrl} data-id={items.ListItemAllFields.ID} data-toggle="lightbox" data-gallery="image-gallery"
                          className=" col-6 col-md-3 gallery-item gallery-folder-item" data-caption="<h2>Lorem ipsum dolor sit amet, consectetur adipiscing elit</h2><p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p><ul><li><i class='icon user-icon'><img src='images/icon-avatar.svg'></i> Debra Teles</li></ul>">
                          <img src={items.ServerRelativeUrl} alt={items.Title} style={{ width: '100%' }} data-src={items.ServerRelativeUrl} data-id={items.ListItemAllFields.ID} className="gallery-item--img" />
                        </a>
                      )
                    })
                  }
                </div>
                <div className={'pagination-wrapper'} style={{ display: this.state.filterVideoData.length > 0 ? 'block' : 'none' }} >
                  <Paging currentPage={this.state.imagesCurrentPage}
                    totalItems={this.state.imageItems.length}
                    itemsCountPerPage={this.state.imagesPerPage}
                    onPageUpdate={(page) => this.onPageUpdateImages(page, false)}
                  />
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
              <div className="imagePreviewCaption">
                <h2>{this.state.selectedItem.FileLeafRef}</h2>

                <ul>
                  <li>
                    <i className="icon user-icon"><img src={`${this.props.siteUrl}/Assets/icons/icon-avatar.svg`} /></i>
                    <span className='userName'>
                      {this.state.selectedItem.Author.Title}
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        {this.renderImagePreviewModal(this.state.isFeatured)}
        {/* <div className="imgOverlay" style={{ display: this.state.preview ? 'block' : 'none' }}>
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
        </div> */}

      </div>
    );
  }
}
