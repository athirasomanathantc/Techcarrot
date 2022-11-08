import * as React from 'react';
import styles from './AgiIntBusFuncIntro.module.scss';
import { IAgiIntBusFuncIntroProps } from './IAgiIntBusFuncIntroProps';
import { escape } from '@microsoft/sp-lodash-subset';
import { sp } from '@pnp/sp/presets/all';
import { IAgiIntBusFuncIntroState } from './IAgiIntBusFuncIntroState';
import { IContentItem } from '../models/IContentItem';
import { LIST_CONTENT, NULL_CONTENT_ITEM } from '../common/constants';

//require('../css/business.css');

export default class AgiIntBusFuncIntro extends React.Component<IAgiIntBusFuncIntroProps, IAgiIntBusFuncIntroState> {



  constructor(props: IAgiIntBusFuncIntroProps) {
    super(props);
    sp.setup({
      spfxContext: this.props.context
    });
    this.state = {
      contentItems: [],
      lastNavItem: ''
    }
  }

  public async componentDidMount(): Promise<void> {
    await this.getCurrentNavInfo();
    await this.getCarouselItem();
  }

  private async getCarouselItem(): Promise<void> {
    const catVal = this.getQueryStringValue('categoryId');
    const tempProgramme = `${this.state.lastNavItem}Id eq ${catVal}`;
    sp.web.lists.getByTitle(LIST_CONTENT).items.filter(tempProgramme).get().then((items: IContentItem[]) => {
      this.setState({
        contentItems: items
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

  private getCurrentNavInfo() {
    try {
      const currentWindowUrl = window.location.href;
      const currentSitePages = currentWindowUrl.split("SitePages");
      const currentSitePagesNav: any = currentSitePages[1].split("/");
      
      const currentArray:any = [];
      let i:any;
      for(i=0;i<currentSitePagesNav.length; i++)
      {
        const isLastPage = currentSitePagesNav[i].includes(".aspx");
        if(isLastPage == true)
        {
          var newItem = currentSitePagesNav[i].split(".aspx")[0];
          var re =/%20/gi
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

  private getQueryStringValue(param: string): string {//debugger;
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
      <section className="section intro-section" style={{ display: this.state.contentItems.length > 0 ? 'block' : 'none' }}>
        <div className="container">
          {
            this.state.contentItems.map((items, i) => {
              return(
                <div className="intro-wrapper text-left">
                  <h2>{items.Title}</h2>
                  <p className="primary-txt" dangerouslySetInnerHTML={{ __html: items.PrimaryDescription }}></p>
                  <p className="secondary-txt" dangerouslySetInnerHTML={{ __html: items.SecondaryDescription }}></p>
                </div>
              )
            })
          }

        </div>
      </section>
    );
  }

  public render(): React.ReactElement<IAgiIntBusFuncIntroProps> {
    return (
      <div className={styles.agiIntBusFuncIntro}>
        {this.renderCarouselSection()}
      </div>
    );
  }
}
