import * as React from 'react';
import styles from './AgiIntranetExtraNavigation.module.scss';
import { IAgiIntranetExtraNavigationProps } from './IAgiIntranetExtraNavigationProps';
import { escape } from '@microsoft/sp-lodash-subset';
import { Item, sp } from '@pnp/sp/presets/all';
import { IAgiIntranetExtraNavigationState } from './IAgiIntranetExtraNavigationState';
import { IExtraNavigationItem } from '../models/IExtraNavigationItem';
import { LIST_EXTRA_NAVIGATION, NULL_EXTRA_NAVIGATION_ITEM, TEXT_LAST_ITEM } from '../common/constants';
import { UrlQueryParameterCollection } from '@microsoft/sp-core-library';
export default class AgiIntranetExtraNavigation extends React.Component<IAgiIntranetExtraNavigationProps, IAgiIntranetExtraNavigationState> {

  constructor(props: IAgiIntranetExtraNavigationProps) {
    super(props);
    sp.setup({
      spfxContext: this.props.context
    });
    this.state = {
      extraNavigationItems: [],
      currentSitePagesNavArr: [],
      lastNavItem: ''
    }
  }

  public async componentDidMount(): Promise<void> {
    this.getCurrentNavInfo();
    await this.getExtraNavigationItem();
  }

  private async getExtraNavigationItem(): Promise<void> {

    sp.web.lists.getByTitle(LIST_EXTRA_NAVIGATION).items.get().then((items: IExtraNavigationItem[]) => {
      this.setState({
        extraNavigationItems: items
      });
    });
  }

  private getCurrentNavInfo() {
    try {
      const currentWindowUrl = window.location.href;
      const currentSitePages = currentWindowUrl.split("SitePages");
      const currentSitePagesNav: any = currentSitePages[1].split("/");

      const currentArray: any = [];
      let i: any;
      for (i = 0; i < currentSitePagesNav.length; i++) {
       // debugger;
        const isLastPage = currentSitePagesNav[i].includes(".aspx");
        if (isLastPage == true) {
          var newItem = currentSitePagesNav[i].split(".aspx")[0];
          // if (newItem=='Gallery')
          // {
          //   const temp =currentSitePagesNav[i].split("&")[0];
          //   if(temp.includes('tab=image')){
          //     newItem="Image Gallery"
          //   }else if(temp.includes('tab=video')){
          //     newItem="Video Gallery"

          //   }
          //   console.log("arrayValue",newItem);
          // }

          var re = /%20/gi
          const tempItem = newItem.replace(re, " ");
          console.log("Tag", tempItem);
          currentArray.push(tempItem);
          this.setState({
            lastNavItem: tempItem
          })
        }
        else {
          const tempItem = currentSitePagesNav[i].replace("%20", " ");
          currentArray.push(tempItem);
        }

      }

      this.setState({
        currentSitePagesNavArr: currentArray
      }, () => {
        // console.log("arrayValue",this.state.currentSitePagesNavArr);
      })
    }
    catch (e) {
      console.log(e);
    }
  }

  private getImageUrl(imageContent: string): string {
    if (!imageContent) {
      return;
    }

    const imageObj: any = JSON.parse(imageContent);
    return imageObj.serverUrl + imageObj.serverRelativeUrl;
  }

  private renderFindOutMoreSection(): JSX.Element {


    const extraNavigationItems = this.state.extraNavigationItems;
    if (!extraNavigationItems) {
      return;
    }

    const lastNavigationVal = this.state.lastNavItem;
    const curDescriptionVal = this.props.description;
    var tempURL = `${this.props.siteUrl}/SitePages`;
    return (
      //
      <div className="extra-navs">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-md-8">
              <nav id="extraNav" aria-label="breadcrumb">
                <ol
                  className="breadcrumb justify-content-center justify-content-md-start mb-3 mt-3 mt-md-0 mb-md-0">
                  <li className="breadcrumb-item"><a href={`${this.props.siteUrl}?env=WebView`} data-interception="off">Home</a></li>
                  {

                    this.state.currentSitePagesNavArr.map((item, i) => {
                     // debugger;
                      var isLast = /aspx/.test(item);
                      if (item != '') {
                        if (item === lastNavigationVal) {
                          // const str:any = item.splice();//.substring(0, str.length - 1);

                          return (
                            <li className="breadcrumb-item active">{item}</li>
                          )
                        }
                        else {
                         // debugger;
                          tempURL = `${tempURL}/${item}`;
                          return (
                            <li className="breadcrumb-item"><a href={`${tempURL}.aspx?env=WebView`} data-interception="off">{item}</a></li>
                          )
                        }
                      }

                    })
                  }
                </ol>
              </nav>
            </div>
            <div className="col-md-4">
              <div className="icon-links-wrapper">
                <div className="icon-links">
                  <ul>
                    {
                      this.state.extraNavigationItems.map((item) => {
                        let linkVal: string;
                        let trgt: string;
                        const external = item.IsExternal;
                        if(external == true)
                        {
                          linkVal = item.NavigationUrl && item.NavigationUrl.Url ? item.NavigationUrl.Url : '';
                          trgt = '_blank';
                        }
                        else
                        {
                          linkVal = item.NavigationUrl && item.NavigationUrl.Url ? item.NavigationUrl.Url : '';
                          trgt = '_self';
                        }
                        const imgVal = this.getImageUrl(item.NavIcon);
                        return (
                          <li>
                            <a href={linkVal} target={trgt}><img src={imgVal} /><b>{item.Title}</b></a>
                          </li>
                        )
                      })
                    }
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );

  }

  private logMessageToConsole(message: string) {
    var queryParms = new UrlQueryParameterCollection(window.location.href);
    if (queryParms.getValue("debug")) {
      console.log(message);
    }
  }

  public render(): React.ReactElement<IAgiIntranetExtraNavigationProps> {
    return (
      <div className={styles.agiIntranetExtraNavigation}>
        {this.renderFindOutMoreSection()}
      </div>
    );
  }
}





