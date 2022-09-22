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
      contentItems: []
    }
  }

  public async componentDidMount(): Promise<void> {
    this.getCarouselItem();
  }

  private async getCarouselItem(): Promise<void> {
    debugger;
    const catVal = this.getQueryStringValue('category');
    sp.web.lists.getByTitle(LIST_CONTENT).items.filter('FSObjType eq 0').get().then((items: IContentItem[]) => {
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
      <section className="section intro-section ">
        <div className="container">
          {
            this.state.contentItems.map((items, i) => {
              return(
                <div className="intro-wrapper text-center">
                  <h2>{items.Title}</h2>
                  <p className="primary-txt" dangerouslySetInnerHTML={{ __html: items.PrimaryDescription }}></p>
                  <p className="secondary-txt" dangerouslySetInnerHTML={{ __html: items.PrimaryDescription }}></p>
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
