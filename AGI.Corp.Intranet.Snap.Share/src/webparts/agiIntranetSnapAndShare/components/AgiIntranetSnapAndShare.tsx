import * as React from 'react';
import styles from './AgiIntranetSnapAndShare.module.scss';
import { IAgiIntranetSnapAndShareProps } from './IAgiIntranetSnapAndShareProps';
import { IAgiIntranetSnapAndShareState } from './IAgiIntranetSnapAndShareState';
import { escape } from '@microsoft/sp-lodash-subset';
import { sp } from '@pnp/sp/presets/all';
import { IImageItem } from '../models/IImageItem';
import { Icon } from 'office-ui-fabric-react/lib/Icon';
import { LIBRARY_SNAP_SHARE, NULL_IMAGE_ITEM, PAGE_SIZE, TEXT_UPLOAD_SUCCESS, WARNING_TEXT_DESCRIPTION_LENGTH, WARNING_TEXT_DESCRIPTION_REQUIRED, WARNING_TEXT_FILE_SIZE, WARNING_TEXT_INVALID_FILETYPE } from '../common/constants';
import Paging from './Paging/Paging';
import * as moment from 'moment';

export default class AgiIntranetSnapAndShare extends React.Component<IAgiIntranetSnapAndShareProps, IAgiIntranetSnapAndShareState> {
  constructor(props: IAgiIntranetSnapAndShareProps) {
    super(props);
    sp.setup({
      spfxContext: this.props.context
    });
    this.state = {
      images: [],
      pageData: [],
      preview: false,
      currentIndex: -1,
      selectedImageUrl: '',
      selectedImageTitle: '',
      selectedImageDescription: '',
      selectedImageAuthorName: '',
      selectedImageDate:'',
      description: '',
      fileName: '',
      file: null,
      showSuccessModal: false,
      itemCount: 0,
      currentPage: -1,
      totalPages: 0,
      pageSize: PAGE_SIZE
    };
  }

  componentDidMount(): void {
    this.getImages();
  }

  private async getImages(): Promise<void> {
    const webRelativeUrl = this.props.context.pageContext.web.serverRelativeUrl;
    const libraryName = LIBRARY_SNAP_SHARE;
    const library = sp.web.lists.getByTitle(libraryName);
    library.items.getAll().then((items) => {

      const itemCount = items.length;
    
    sp.web.lists.getByTitle(libraryName).items
      .select("FileLeafRef", "Created", "File", "ID", "Title", "Author/Title", "ImageDescription")
      .expand("File, Author")
      .top(itemCount)
      .filter(`ApprovalStatus eq 'Approved'`)
      .orderBy('Created', false)
      .get().then((images: IImageItem[]) => {
        const totalPages: number = Math.ceil(images.length / this.state.pageSize);
        const pageData = images.slice(0, this.state.pageSize);
        const itemCount = images.length;
        const currentPage = 1;
        this.setState({
          images,
          pageData,
          itemCount,
          totalPages,
          currentPage
        });
      });
    })
  }

  private uploadFile = async () => {

    const description = this.state.description;
    let message = "";
    const { file, fileName } = this.state;
    // Allowing file type
    const allowedExtensions = /(\.jpg|\.jpeg|\.png|\.gif)$/i;

    if (description == "") {
      console.log('Empty');
      message = WARNING_TEXT_DESCRIPTION_REQUIRED;
    } else {
      if (description.length <= 200) {
        console.log('Less than 200');
      } else {
        console.log('Grater than 200');
        message = WARNING_TEXT_DESCRIPTION_LENGTH;
      }
    }
    if (file) {
      console.log(file.size);
      if (file.size > '8388608') {
        console.log('File size should be less than 8MB');
        message = WARNING_TEXT_FILE_SIZE;
      }
      if (!allowedExtensions.exec(fileName)) {
        console.log('Invalid file type');
        message = WARNING_TEXT_INVALID_FILETYPE;
      }

    } else {
      console.log('File is required');
      message = "File is required";
    }

    if (message) {
      alert(message);
    } else {

      //upload file to library
      const libraryName = 'SnapAndShare';
      const libraryPath = `${this.props.context.pageContext.web.serverRelativeUrl}/${libraryName}`;
      sp.web.getFolderByServerRelativePath(libraryPath).files.add(fileName, file).then((data) => {
        console.log('file uploaded successfully');
        console.log(data);
        // update file metadata
        data.file.getItem().then((item) => {
          item.update({
            ImageDescription: description
          }).then((data) => {
            console.log('file metadata updated');
            console.log(data);
          }).catch((error) => {
            console.log('error in updating metdata');
          });
        });
      }).catch((error) => {
        console.log('error in uploading file');
        console.log(error);
      }).then(() => {
        this.setState({
          description: '',
          fileName: '',
          showSuccessModal: true
        });
        //alert('File uploaded successfully');
      })

    }


  }

  private getImageUrl(imageContent: string) {
    if (!imageContent) {
      return;
    }
    const imageObj: any = JSON.parse(imageContent);
    return imageObj.serverUrl + imageObj.serverRelativeUrl;
  }


  private closePreview() {
    this.setState({
      preview: false,
      selectedImageUrl: '',
      selectedImageTitle: '',
      selectedImageDescription: '',
      selectedImageAuthorName: '',
      selectedImageDate: ''
    });
  }

  private handleFile(e: any) {
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      console.log('file', file);
      const fileName = file.name;
      this.setState({
        fileName,
        file
      });
    }
    else {
      this.setState({
        fileName: ''
      });
    }
  }

  private handleDescription(e: any) {
    const value = e.target.value;
    this.setState({
      description: value
    });
  }

  private selectImage(e: any) {
    const url = e.target.attributes["data-url"].value;
    const id = e.target.attributes["data-id"].value;
    const index = id ? parseInt(id) : -1;
    const _imageItem = this.state.pageData.filter((image) => image.ID == id);
    const imageItem = _imageItem && _imageItem.length > 0 ? _imageItem[0] : NULL_IMAGE_ITEM;
    this.setState({
      selectedImageUrl: url,
      selectedImageTitle: imageItem.File.Name,
      selectedImageDescription: imageItem.ImageDescription,
      selectedImageAuthorName: imageItem.Author.Title,
      selectedImageDate:imageItem.Created,
      currentIndex: index,
      preview: true
    });
  }

  private prevImage() {
    const index = this.state.currentIndex;
    const images = this.state.pageData;
    const arrayIndex = images.map(e => e.ID).indexOf(index);
    const prevIndex = arrayIndex == 0 ? (images.length - 1) : arrayIndex - 1;
    const prevImage = images[prevIndex];
    this.setState({
      currentIndex: prevImage.ID,
      selectedImageUrl: prevImage.File.ServerRelativeUrl,
      selectedImageTitle: prevImage.File.Name,
      selectedImageDescription: prevImage.ImageDescription,
      selectedImageAuthorName: prevImage.Author.Title,
      selectedImageDate: prevImage.Created
    });
  }

  private nextImage() {
    const index = this.state.currentIndex;
    const images = this.state.pageData;
    const arrayIndex = images.map(e => e.ID).indexOf(index);
    const nextIndex = arrayIndex == (images.length - 1) ? 0 : arrayIndex + 1;
    const nextImage = images[nextIndex];
    this.setState({
      currentIndex: nextImage.ID,
      selectedImageUrl: nextImage.File.ServerRelativeUrl,
      selectedImageTitle: nextImage.File.Name,
      selectedImageDescription: nextImage.ImageDescription,
      selectedImageAuthorName: nextImage.Author.Title,
      selectedImageDate: nextImage.Created
    });
  }

  private handleCloseSuccessModal() {
    this.setState({
      showSuccessModal: false
    });
  }

  private onPageUpdate(page: number) {
    // round a number up to the next largest integer.
    const skipItems: number = this.state.pageSize * (page - 1);
    const takeItems: number = skipItems + this.state.pageSize;

    console.log('page', page);
    const roundupPage = Math.ceil(page);
    // const images = this.state.allImages.slice(roundupPage, (roundupPage * pageSize));
    const pageData = this.state.images.slice(skipItems, takeItems)
    this.setState({
      pageData,
      currentPage: page
    }, () => {
      this.scrollToTop();

    });
  }

  private scrollToTop(): void {
    var element = document.getElementById("spPageCanvasContent");
    element.scrollIntoView({ behavior: 'smooth' });
  }

  private renderSuccessForm(): JSX.Element {
    return (
      <div className='successOverlay'>
        <div className='overlay'>
          <div className='msgContainer'>
            <div className='msgBox'>
              <div className='msgSuccess'>
                {TEXT_UPLOAD_SUCCESS}
              </div>
              <div className='btnClose'>
                <input type="button" value={'Close'} onClick={() => this.handleCloseSuccessModal()} />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  private renderSnapAndShareSection(): JSX.Element {
    return (
      <div className="content-wrapper">
        <div className="uploader-wrapper">
          <div className="container">
            <div className="uploader">
              <div className="row">
                <div className="col-md-12">
                  <h3>Share Your Images</h3>
                </div>
                <div className="col-md-3">
                  <div className="upload-container">
                    <p><i><img src={`${this.props.siteUrl}/Assets/icons/Upload-icon.svg`} alt="" /></i> Upload Images</p>
                    <input className="form-control" type="file" id="fileInput" accept="image/x-png,image/gif,image/jpeg" onChange={(e) => this.handleFile(e)} />
                  </div>
                </div>
                <div className="col-md-7">
                  <input className="form-control" type="text" placeholder="Add Description"
                    value={this.state.description}
                    aria-label="Add Description" onChange={(e) => this.handleDescription(e)} />
                </div>
                <div className="col-md-2">
                  <input type="button" className="btn btn-gradient" disabled={!this.state.description} onClick={() => this.uploadFile()} value='Upload' />
                </div>
                <div className='col-md-12' style={{ display: this.state.fileName ? 'block' : 'none' }}>
                  <label >
                    {`Filename: ${this.state.fileName}`}
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="container">
          <div className='row'>
            <div className="snap-share-gallery">
              <div className="snap-share-wrapper-item">
                {
                  this.state.pageData.map((image) => {
                    const imageSrc = image.File.ServerRelativeUrl;
                    return (
                      <div className="img-with-text">
                        <a href={'javascript: void(0)'} onClick={(e) => this.selectImage(e)} data-url={imageSrc} data-id={image.ID} >
                          <img src={imageSrc} data-url={imageSrc} data-id={image.ID} />
                          <div className="overlay" onClick={(e) => this.selectImage(e)} data-url={imageSrc} data-id={image.ID} >
                            <div className="text"><i>
                              <img src={`${this.props.siteUrl}/Assets/Icons/icon-camera.svg`} alt="" /></i> {image.Author.Title}
                            </div>
                            <div className="text show-on-hover">
                              {image.ImageDescription}
                            </div>
                          </div>
                        </a>
                      </div>
                    )
                  })
                }
              </div>
            </div>
          </div>
          <div className={'pagination-wrapper'} style={{ display: this.state.totalPages > 0 ? 'block' : 'none' }} >
            <Paging currentPage={this.state.currentPage}
              totalItems={this.state.itemCount}
              itemsCountPerPage={this.state.pageSize}
              onPageUpdate={(page) => this.onPageUpdate(page)}
            />
          </div>
        </div>
      </div>
    )
  }

  private renderImagePreviewModal(): JSX.Element {

    return (
      <div className="imgOverlay" style={{ display: this.state.preview ? 'block' : 'none' }}>
        <div className="header">
          <Icon iconName="Cancel" onClick={() => this.closePreview()} />
        </div>
        <div className="imagePreview">
          <div className='arrowContainer'>
            <Icon iconName="ChevronLeft" onClick={() => this.prevImage()} />
          </div>
          <div className="img-wrapper" >
            <div className="img-container">
              <img src={this.state.selectedImageUrl} />
            </div>
            <div className="imagePreviewCaption">
              <h2>{this.state.selectedImageTitle}</h2>
              <p>{this.state.selectedImageDescription}</p>
              <ul>
                <li>
                  <i className="icon user-icon"><img src={`${this.props.siteUrl}/Assets/icons/icon-avatar.svg`} /></i>
                  <span className='userName'>
                    {this.state.selectedImageAuthorName}
                  </span>
                  <span className='createdDate'>
                  <span> Date Taken:</span> {moment(this.state.selectedImageDate).format('DD MMMM YYYY')}
                  </span>
                </li>
              </ul>
            </div>
          </div>
          <div className='arrowContainer'>
            <Icon iconName="ChevronRight" onClick={() => this.nextImage()} />
          </div>
          {/* <div style={{ display: 'none' }}>
            <div className="ratio ratio-16x9" style={{ backgroundColor: "#000" }}>
              <img src={this.state.selectedImageUrl}
                style={{ zIndex: 1, objectFit: "contain" }} /></div>
            <div className="lightbox-caption">
              <h2>{this.state.selectedImageTitle}</h2>
              <p>{this.state.selectedImageDescription}</p>
              <ul>
                <li>
                  <i className="icon user-icon"><img src={`${this.props.siteUrl}/Assets/icons/icon-avatar.svg`} /></i>
                  <span className='userName'>
                    {this.state.selectedImageAuthorName}
                  </span>
                </li>
              </ul>
            </div>

          </div> */}
        </div>
      </div>
    )
  }

  public render(): React.ReactElement<IAgiIntranetSnapAndShareProps> {
    const { currentPage, totalPages } = this.state;
    return (
      <div className={styles.agiIntranetSnapAndShare}>
        <div className="main-content" >
          <>
            {this.renderSnapAndShareSection()}
          </>
          {/** Image Preview Modal */}
          <>
            {this.renderImagePreviewModal()}
          </>
          {/** Success Modal */}
          <>
            {this.state.showSuccessModal && this.renderSuccessForm()}
          </>
        </div>
      </div>
    );
  }
}
