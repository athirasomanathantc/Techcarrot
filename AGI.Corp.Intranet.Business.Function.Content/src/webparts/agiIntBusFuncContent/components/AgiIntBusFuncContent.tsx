import * as React from 'react';
import styles from './AgiIntBusFuncContent.module.scss';
import { IAgiIntBusFuncContentProps } from './IAgiIntBusFuncContentProps';
import { escape } from '@microsoft/sp-lodash-subset';
import { sp } from '@pnp/sp/presets/all';
import { IAgiIntBusFuncContentState } from './IAgiIntBusFuncContentState';
import { IContentItem } from '../models/IContentItem';
import { LIST_CONTENT, NULL_CONTENT_ITEM } from '../common/constants';

//require('../css/business.css');

export default class AgiIntBusFuncContent extends React.Component<IAgiIntBusFuncContentProps, IAgiIntBusFuncContentState> {



  constructor(props: IAgiIntBusFuncContentProps) {
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

  private async getCarouselItem(): Promise<void> {debugger;
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
 
  public render(): React.ReactElement<IAgiIntBusFuncContentProps> {
    return (
      <div className={styles.agiIntBusFuncContent}>
        {this.renderCarouselSection()}
      </div>
    );
  }
}
