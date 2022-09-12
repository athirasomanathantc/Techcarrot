import * as React from "react";
import styles from './IntranetHeader.module.scss';
import { IIntranetHeaderProps } from "./IntranetHeaderProps";
import { IIntranetHeaderState } from "./IntranetHeaderState";
import { INavigationItem } from "../../models/INavigationItem";
import SPService from "../../services/spservice";
import { ASSET_LIBRARY, CONFIG_LIST, NAVIGATION_LIST, SOCIALLINK_LIST, TEXT_BUSINESS, TEXT_COMPANY, TEXT_GALLERY, TEXT_NEWSMISC, TEXT_OTHER } from "../../common/constants";
import { FontIcon, Icon, Modal, IconButton, IIconProps } from 'office-ui-fabric-react';
import { sp } from '@pnp/sp/presets/all';
import { IConfigItem } from "../../models/IConfigItem";
import { ISocialLink } from "../../models/ISocialLinkItem";
import { OrgModal } from "../OrganizationChart/OrgModal/OrgModal";

const menuIcon: IIconProps = { iconName: 'GlobalNavButton' };
const closeIcon: IIconProps = { iconName: 'Cancel' };

export default class IntranetHeader extends React.Component<IIntranetHeaderProps, IIntranetHeaderState> {
  constructor(props: IIntranetHeaderProps) {
    super(props);
    sp.setup({
      spfxContext: this.props.context
    });

    this.state = {
      navigationItems: [],
      socialLinks: [],
      selectedSearchVal: '',
      userId: null,
      firstName: '',
      lastName: '',
      userName: '',
      emailID: '',
      domainName: '',
      profileName: '',
      profilePicture: '',
      showMobileMenu: false,
      logoURL: '',
      notificationsURL: '',
      displayOrgChart: false
    }
  }

  public async componentDidMount(): Promise<void> {
    this.getUserDetails();
    await this.getNavigationItems();
    await this.getSocialLinkItems();
    await this.getConfigItems();
  }

  private async getNavigationItems(): Promise<void> {
    const url = `${this.props.siteUrl}/_api/web/lists/getbytitle('${NAVIGATION_LIST}')/items?$filter=(IsActive eq 1 and AvailableInHeader eq 1)&$orderby= NavigationOrder asc`
    SPService.getItemsByRestApi(url, this.props.spHttpClient).then((data) => {
      const navigationItems: INavigationItem[] = data;
      this.setState({
        navigationItems
      });
    })
  }

  private async getConfigItems(): Promise<void> {
    sp.web.lists.getByTitle(CONFIG_LIST).items.get().then((items: IConfigItem[]) => {
      const _logoItem = items.filter((item) => item.Title == 'Logo');
      const _notificationItem: any = items.filter((item) => item.Title == 'Notification')[0];
      const logoURL = _logoItem && _logoItem.length > 0 ? this.getImageUrl(_logoItem[0].Image) : '';
      this.setState({
        logoURL,
        notificationsURL: _notificationItem.Link
      });
    })
  }

  private async getUserDetails(): Promise<void> {
    //debugger;
    const userId = this.props.context.pageContext.legacyPageContext.userId;
    const userEmail = this.props.context.pageContext.legacyPageContext.userEmail;
    const userName = this.props.context.pageContext.legacyPageContext.userDisplayName;
    const domainName = userEmail.split('@')[1];
    const loginName = `i:0#.f|membership|${userEmail}`; //`i:0#.f|membership|${'Jennifer.Alimon@al-ghurair.com'}`; 
    let f = '';
    let l = '';

    //const { userEmail, profileName } = this.state;
    const profileUrl = `${this.props.siteUrl}/_layouts/15/userphoto.aspx?size=L&username=${userEmail}`

    sp.profiles.getPropertiesFor(loginName).then((profile) => {
      if (profile && profile.UserProfileProperties) {
        console.log('profile', profile);
        for (let i: number = 0; i < profile.UserProfileProperties.length; i++) {
          if (profile.UserProfileProperties[i].Key == "FirstName") {
            profile.FirstName = profile.UserProfileProperties[i].Value;
          }

          if (profile.UserProfileProperties[i].Key == "LastName") {
            profile.LastName = profile.UserProfileProperties[i].Value;
          }

          if (profile.UserProfileProperties[i].Key == "WorkPhone") {
            profile.WorkPhone = profile.UserProfileProperties[i].Value;
          }

          if (profile.UserProfileProperties[i].Key == "Department") {
            profile.Department = profile.UserProfileProperties[i].Value;
          }

          if (profile.UserProfileProperties[i].Key == "PictureURL") {
            profile.PictureURL = profile.UserProfileProperties[i].Value;
          }
        }
        console.log('profile', profile); debugger;
        const firstName: string = profile.FirstName ? profile.FirstName.toString() : '';
        const lastName: string = profile.LastName ? profile.LastName.toString() : '';
        f = firstName.substring(0, 1);
        l = lastName.substring(0, 1);
        this.setState({
          userId: userId,
          //firstName: profile.FirstName,
          //lastName: profile.LastName,
          userName: userName,
          emailID: userEmail,
          domainName: domainName,
          profileName: `${f} ${l}`,
          profilePicture: profileUrl//profile.PictureURL
        });
      }
      else {
        const names = userEmail.split('.');
        f = names && names.length > 0 ? names[0].substring(0, 1) : '';
        l = names && names.length > 1 ? names[1].substring(0, 1) : '';
        this.setState({
          userId: userId,
          //firstName: profile.FirstName,
          //lastName: profile.LastName,
          userName: userName,
          emailID: userEmail,
          domainName: domainName,
          profileName: `${f} ${l}`,
          profilePicture: profileUrl//profile.PictureURL
        });
      }
    });

  }

  private async getSocialLinkItems(): Promise<void> {
    const url = `${this.props.siteUrl}/_api/web/lists/getbytitle('${SOCIALLINK_LIST}')/items`
    SPService.getItemsByRestApi(url, this.props.spHttpClient).then((data) => {
      const socialLinks: ISocialLink[] = data;
      this.setState({
        socialLinks
      });
      console.log("social " + socialLinks);
    })

  }

  private getImageUrl(imageContent: string) {
    if (!imageContent) {
      return '';
    }
    const imageObj: any = JSON.parse(imageContent);
    return imageObj.serverUrl + imageObj.serverRelativeUrl;
  }

  private fnInitiate() {
    const element: any = document.getElementById("demo");
    element.remove();
  }

  private handleSearchChange(e: any) {
    const txtVal = e.target.value;
    this.setState({
      selectedSearchVal: txtVal
    });
  }

  private handleSearchResults(e: any) {
    try {
      const navUrl = `${this.props.siteUrl}/_layouts/15/search.aspx/siteall?q=${this.state.selectedSearchVal}`;
      window.open(navUrl, '_blank').focus();
    }
    catch (e) {
      console.log(e);
    }
  }

  private displayOrgChart(e: any) {
    this.setState({
      displayOrgChart: true
    })
  }

  private gotoNotifications() {
    window.location.href = `${this.props.siteUrl}${this.state.notificationsURL}`;
  }

  private closeModal() {
    this.setState({
      displayOrgChart: false
    })
  }

  private renderHeader(): JSX.Element {

    const companyContentItems = this.state.navigationItems.filter(item => item.Parent == TEXT_COMPANY);
    const businessContentItems = this.state.navigationItems.filter(item => item.Parent == TEXT_BUSINESS);
    const newsMiscContentItems = this.state.navigationItems.filter(item => item.Parent == TEXT_NEWSMISC);
    const galleryContentItems = this.state.navigationItems.filter(item => item.Parent == TEXT_GALLERY);
    const otherContentItems = this.state.navigationItems.filter(item => item.Parent == TEXT_OTHER);

    return (
      <header className="header-wrapper">
        <div className="top-nav">
          <nav className="navbar navbar-expand-lg navbar-light">
            <div className="container">
              <div className="align-items-center d-flex">
                <button className="navbar-toggler collapsed" type="button" data-bs-toggle="collapse"
                  data-bs-target="#navbarCollapse" aria-controls="navbarCollapse" aria-expanded="false"
                  aria-label="Toggle navigation">
                  <span className="navbar-toggler-icon"></span>
                </button>
                <a href="" className="topnav-logo">
                  <span className="topnav-logo-lg">
                    <img src={this.state.logoURL} alt="" />{/*  {`${this.props.siteUrl}/Assets/images/logo.svg`} */}
                  </span>
                </a>
              </div>

              <form action="" className="d-block d-md-flex mt-3 mt-lg-0 order-4 order-md-1 search-bar">
                <div className="input-group">
                  <input type="text" className="form-control form-control-lg" placeholder="Search Here" id="txtSeachText" onChange={(e) => this.handleSearchChange(e)} />
                  <button type="submit" className="input-group-text btn-serach" onClick={(e) => this.handleSearchResults(e)}><i className="bi bi-search">
                    <img src={`${this.props.siteUrl}/Assets/images/icon-search.svg`} alt="" /></i></button>
                </div>
              </form>
              <ul className="logged-in-user order-2">
                <li style={{ position: "relative" }}>
                  <div id="notificationDropdown" className="notification-dropdown dropdown">
                    <button className="btn btn-ghost dropdown-toggle" type="button" id="dropdownMenuButton1"
                      data-bs-toggle="dropdown" aria-expanded="false" onClick={() => this.gotoNotifications()}>
                      <img src={`${this.props.siteUrl}/Assets/images/icon-bell.svg`} alt="" height="32" />
                    </button>
                  </div>
                </li>
                <li style={{ position: "relative" }}>
                  <div className="user-dropdown dropdown">
                    <a href="#"
                      className="d-flex align-items-center link-dark text-decoration-none dropdown-toggle"
                      id="dropdownUser2" data-bs-toggle="dropdown" aria-expanded="false">
                      {
                        this.state.profilePicture ?

                          <div className='profilePicture'>
                            <img src={this.state.profilePicture} alt="" width="42" height="42" />
                          </div>

                          :

                          <div className='profileName'>
                            {this.state.profileName}
                          </div>
                      }
                      <div className="dropdown-username">
                        <p>Welcome</p>
                        <h5>{this.state.userName}</h5>
                      </div>
                    </a>
                    <ul className="dropdown-menu dropdown-menu-lg-end shadow user-dropdown" aria-labelledby="dropdownUser2">
                      <li>
                        <div className="navbar-user-login">
                          <div className="row">
                            <div className="top-user-section d-flex justify-content-between align-items-center">
                              <div className="org-email">{this.state.domainName}</div>
                              <div className="signout-btn">sign out</div>
                            </div>
                          </div>
                          <div className="row mt-4">
                            <div className="col-4">
                              <p className="text-center">
                                {
                                  this.state.profilePicture ?

                                    <div className='profilePicture'>
                                      <img src={this.state.profilePicture} className="w-100" />
                                    </div>

                                    :

                                    <div className='profileName'>
                                      {this.state.profileName}
                                    </div>
                                }
                              </p>
                            </div>
                            <div className="col-8 user-details">
                              <p className="text-left user-name"><strong>{this.state.userName}</strong></p>
                              <p className="text-left small user-email">{this.state.emailID}</p>
                              <p className="text-left">
                                <a href="#viewOrganizationChart" className="organizational-chart-link" data-bs-toggle="modal" onClick={(e) => this.displayOrgChart(e)}>Organizational Chart</a>

                              </p>
                            </div>
                          </div>
                        </div>
                      </li>
                    </ul>
                  </div>
                </li>
              </ul>
            </div>
          </nav>
        </div>
        <div className="main-nav">
          <div className="container">
            <nav className="navbar navbar-light navbar-expand-lg topnav-menu">
              <div className="collapse navbar-collapse" id="navbarCollapse">
                <ul className="navbar-nav">
                  <li className="nav-item">
                    <a href={`${this.props.siteUrl}`} className="nav-link home-nav active" data-interception="off">
                      <span className="home-text">Home</span>
                      <span className="home-icon">
                        <svg xmlns="http://www.w3.org/2000/svg" width="22.454" height="23.687" viewBox="0 0 22.454 23.687">
                          <g id="Home" transform="translate(0.5 0.661)">
                            <g id="Group_9662" data-name="Group 9662">
                              <path id="Path_81257" data-name="Path 81257" d="M18.645,22.026H2.809A2.309,2.309,0,0,1,.5,19.717V10.16a2.307,2.307,0,0,1,.738-1.692L9.156,1.117a2.308,2.308,0,0,1,3.142,0l7.917,7.351a2.312,2.312,0,0,1,.739,1.692v9.557A2.309,2.309,0,0,1,18.645,22.026Z" fill="none" stroke="#fff" stroke-width="2" />
                              <path id="Path_81258" data-name="Path 81258" d="M6.79,22.026V14.444a2.777,2.777,0,0,1,2.777-2.777h2.32a2.777,2.777,0,0,1,2.777,2.777v7.582" fill="none" stroke="#fff" stroke-width="2" />
                            </g>
                          </g>
                        </svg>
                      </span>
                    </a>
                  </li>
                  {
                    companyContentItems.map((comp, i) => {
                      if (i == 0) {
                        const link = comp.Link && comp.Link.Url ? comp.Link.Url : '';
                        return (
                          <li className="nav-item">
                            <a className="nav-link" href={link} data-interception="off">{comp.Title}</a>
                          </li>
                        )
                      }
                    })
                  }
                  <li className="nav-item dropdown">
                    <a href="#" className="nav-link dropdown-toggle" data-bs-toggle="dropdown">{TEXT_BUSINESS}</a>
                    <div className="dropdown-menu">
                      {
                        businessContentItems.map((bus) => {
                          const link = bus.Link && bus.Link.Url ? bus.Link.Url : '';
                          return (
                            <li>
                              <a className="dropdown-item" href={link} data-interception="off">{bus.Title}</a>
                            </li>
                          )
                        })
                      }
                    </div>
                  </li>
                  <li className="nav-item dropdown">
                    <a href="#" className="nav-link dropdown-toggle" data-bs-toggle="dropdown">{TEXT_NEWSMISC}</a>
                    <div className="dropdown-menu">
                      {
                        newsMiscContentItems.map((news) => {
                          const link = news.Link && news.Link.Url ? news.Link.Url : '';
                          return (
                            <li>
                              <a className="dropdown-item" href={link} data-interception="off">{news.Title}</a>
                            </li>
                          )
                        })
                      }
                    </div>
                  </li>
                  <li className="nav-item dropdown">
                    <a href="#" className="nav-link dropdown-toggle" data-bs-toggle="dropdown">{TEXT_GALLERY}</a>
                    <div className="dropdown-menu">
                      {
                        galleryContentItems.map((gallery) => {
                          const link = gallery.Link && gallery.Link.Url ? gallery.Link.Url : '';
                          return (
                            <li>
                              <a className="dropdown-item" href={link} data-interception="off">{gallery.Title}</a>
                            </li>
                          )
                        })
                      }
                    </div>
                  </li>
                  {
                    companyContentItems.map((comp, i) => {
                      if (i != 0) {
                        const link = comp.Link && comp.Link.Url ? comp.Link.Url : '';
                        return (
                          <li className="nav-item">
                            <a className="nav-link" href={link} data-interception="off">{comp.Title}</a>
                          </li>
                        )
                      }
                    })
                  }
                </ul>
                <ul className="navbar-nav social-media-nav ms-auto">
                  <li className="nav-item">
                    <a href="#" className="nav-link disabled">
                      Follow us
                    </a>
                  </li>
                  {
                    this.state.socialLinks.map((sl) => {
                      const link = sl.Link && sl.Link.Url ? sl.Link.Url : '';
                      const iconUrl = this.getImageUrl(sl.Icon);
                      return (
                        <li className="nav-item"><a href={link} className="nav-link" target="_blank" data-interception="off">
                          <img src={iconUrl} alt="" />
                        </a>
                        </li>
                      )
                    })
                  }
                </ul>
              </div>
            </nav>
          </div>
        </div>
        {this.state.displayOrgChart && <OrgModal
          {...this.props}
          closeModal={() => this.closeModal()}
        ></OrgModal>}
      </header>
    );
  }

  public render(): React.ReactElement<IIntranetHeaderProps> {
    return (
      <div className={styles.intranetHeader}>
        {this.renderHeader()}
      </div>
    );
  }
}