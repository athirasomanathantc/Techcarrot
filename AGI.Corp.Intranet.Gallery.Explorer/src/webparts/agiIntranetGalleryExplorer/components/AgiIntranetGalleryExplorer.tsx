import * as React from 'react';
import styles from './AgiIntranetGalleryExplorer.module.scss';
import { IAgiIntranetGalleryExplorerProps } from './IAgiIntranetGalleryExplorerProps';
import { escape } from '@microsoft/sp-lodash-subset';
import { IAgiIntranetGalleryExplorerState } from './IAgiIntranetGalleryExplorerState';
import { sp } from '@pnp/sp/presets/all';
import { LIST_GALLERY_CONFIG } from '../common/constants';
import { IGalleryConfigItem } from '../models/IGalleryConfigItem';



export default class AgiIntranetGalleryExplorer extends React.Component<IAgiIntranetGalleryExplorerProps, IAgiIntranetGalleryExplorerState> {


  constructor(props: IAgiIntranetGalleryExplorerProps) {
    super(props);
    this.state = {
      configItems: []
    }
    sp.setup({
      spfxContext: this.props.context
    });
  }

  componentDidMount(): void {
    this.getConfigItems();
  }

  private async getConfigItems(): Promise<void> {
    sp.web.lists.getByTitle(LIST_GALLERY_CONFIG).items.filter('IsActive eq 1').get().then((items: IGalleryConfigItem[]) => {
      this.setState({
        configItems: items
      });
    })
  }

  private getImageUrl(imageContent: string): string {
    if (!imageContent) {
      return;
    }

    const imageObj: any = JSON.parse(imageContent);
    return imageObj.serverUrl + imageObj.serverRelativeUrl;
  }

  public render(): React.ReactElement<IAgiIntranetGalleryExplorerProps> {
    return (
      <section className={`${styles.agiIntranetGalleryExplorer} galleryList`}>
         <div className="container">
          <div className="tab-header">
            <div className="row">
              <div className="col-md-12">
                <ul className="nav">
                  <li className="nav-item" role="presentation">
                      {this.props.description}
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        <div className="container">
          <div className="row">
            {
              this.state.configItems.length > 0 ?
                this.state.configItems.map((item) => {
                  const targetUrl = item.GalleryPage ? item.GalleryPage.Url : '';
                  const coverImage = this.getImageUrl(item.CoverImage);
                  return (
                    <div className=" col-md-3">
                      <div className="gallery-item">
                        <a href={`${targetUrl}?env=WebView&page=Toolkit`}data-interception="off" >
                          <div className="gallery-item--img">
                            <img src={coverImage} alt="" />
                          </div>
                          <div className="gallery-item--text">
                            <p>{item.Title}</p>
                          </div>
                        </a>
                      </div>
                    </div>
                  )
                })
                :
                <div className={'invalidTxt'}>
                  NO DATA
                </div>
            }
          </div>
        </div>
      </section>
    );
  }
}
