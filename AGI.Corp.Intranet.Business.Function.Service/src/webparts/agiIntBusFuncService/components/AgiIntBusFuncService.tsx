import * as React from 'react';
import styles from './AgiIntBusFuncService.module.scss';
import { IAgiIntBusFuncServiceProps } from './IAgiIntBusFuncServiceProps';
import { escape } from '@microsoft/sp-lodash-subset';
import { sp } from '@pnp/sp/presets/all';
import { IAgiIntBusFuncServiceState } from './IAgiIntBusFuncServiceState';
import { IContentItem } from '../models/IContentItem';
import { LIST_CONTENT, NULL_CONTENT_ITEM } from '../common/constants';

//require('../css/business.css');

export default class AgiIntBusFuncService extends React.Component<IAgiIntBusFuncServiceProps, IAgiIntBusFuncServiceState> {



  constructor(props: IAgiIntBusFuncServiceProps) {
    super(props);
    sp.setup({
      spfxContext: this.props.context
    });
    this.state = {
      contentItems: [],
      lastNavItem: '',
      programID: ''
    }
  }

  public async componentDidMount(): Promise<void> {
    await this.getCurrentNavInfo();
    await this.getCarouselItem();
  }

  private getCurrentNavInfo() {
    try {
      const currentWindowUrl = window.location.href;
      const currentSitePages = currentWindowUrl.split("SitePages");
      const currentSitePagesNav: any = currentSitePages[1].split("/");

      const currentArray: any = [];
      let i: any;
      for (i = 0; i < currentSitePagesNav.length; i++) {
        const isLastPage = currentSitePagesNav[i].includes(".aspx");
        if (isLastPage == true) {
          var newItem = currentSitePagesNav[i].split(".aspx")[0];
          var re = /%20/gi
          const tempItem = newItem.replace(re, " ");
          this.setState({
            lastNavItem: tempItem
          })
        }
      }
    }
    catch (e) {
      console.log(e);
    }
  }


  private async getCarouselItem(): Promise<void> {
    const catVal = this.getQueryStringValue('categoryId');
    const tempProgramme = `${this.state.lastNavItem}Id eq ${catVal}`;
    sp.web.lists.getByTitle(LIST_CONTENT).items.select('*').filter(tempProgramme).get().then((items: IContentItem[]) => {
      this.setState({
        contentItems: items,
        programID: catVal
      });
    });
  }

  private getImageUrl(imageContent: string): string {
    if (!imageContent) {
      return;
    }

    const imageObj: any = JSON.parse(imageContent);
    return imageObj.serverUrl + imageObj.serverRelativeUrl;
  }

  private getQueryStringValue(param: string): string {
    const params = new URLSearchParams(window.location.search);
    let value = params.get(param) || '';
    return value;
  }

  private renderCarouselSection(): JSX.Element {

    const carouselItem = this.state.contentItems;
    if (!carouselItem) {
      return;
    }

    return (
      <section className="section txt-img-section">
        <div className="container">
          <div className="business-txt-img">
            {
              this.state.contentItems.map((items, i) => {
                const imgVal = this.getImageUrl(items.ContentImage);
                if (i % 2 == 0) {
                  return(
                    <div className="side-by-side">
                    <img src={imgVal} />
                    <h2 dangerouslySetInnerHTML={{ __html: items.PrimaryDescription }}></h2>
                    <p dangerouslySetInnerHTML={{ __html: items.SecondaryDescription }}></p>
                  </div>
                    )
                }
                else {
                  return(
                    <div className="side-by-side reverse">
                    <h2 dangerouslySetInnerHTML={{ __html: items.PrimaryDescription }}></h2>
                    <p dangerouslySetInnerHTML={{ __html: items.SecondaryDescription }}></p>
                    <img src={imgVal} />
                  </div>
                  )
                }
              })
            }
          </div>
        </div>
      </section>
    );
  }
 
  public render(): React.ReactElement<IAgiIntBusFuncServiceProps> {
    return (
      <div className={styles.agiIntBusFuncService}>
        {this.renderCarouselSection()}
      </div>
    );
  }
}
