import * as React from 'react';
import styles from './AgiIntranetHomeMain.module.scss';
import { IAgiIntranetHomeMainProps } from './IAgiIntranetHomeMainProps';
import { sp } from '@pnp/sp/presets/all';
import { IAgiIntranetHomeMainState } from './IAgiIntranetHomeMainState';
import { LatestNews } from './LatestNews/LatestNews';
import { Announcements } from './Announcements/Announcements';
import { SnapShare } from './SnapShare/SnapShare';
import { SocialMedia } from './SocialMedia/SocialMedia';
import { Rewards } from './Rewards/Rewards';
import { PortalNavigation } from './PortalNavigation/PortalNavigation';
import { MyApps } from './MyApps/MyApps';
import { CompanyEvents } from './CompanyEvents/CompanyEvents';
import { EmployeeSurvey } from './EmployeeSurvey/EmployeeSurvey';
import ErrorBoundary from './ErrorBoundary/ErrorBoundary';
import Calender from './Calendar/Calendar';

export default class AgiIntranetHomeMain extends React.Component<IAgiIntranetHomeMainProps, IAgiIntranetHomeMainState> {

  constructor(props: IAgiIntranetHomeMainProps) {
    super(props);
    sp.setup({
      spfxContext: this.props.context
    });
    this.state = {
      hideLoader: false
    }
  }

  public async componentDidMount(): Promise<void> {
    setTimeout(() => {
      this.setState({
        hideLoader: true
      })
    }, 2000)
  }

  public render(): React.ReactElement<IAgiIntranetHomeMainProps> {
    return (
      <div className={styles.agiIntranetHomeMain}>
        <div className="main-content">
          <div className="content-wrapper" style={{ display: this.state.hideLoader ? 'block' : 'none' }}>
            <div className="container">
              <div className="row home-page">
                <div className="col-xl-8 col-sm-12  ">
                  <div className="row h-100">
                    <ErrorBoundary>
                      <LatestNews {...this.props}></LatestNews>
                    </ErrorBoundary>
                    <ErrorBoundary>
                      <Announcements {...this.props}></Announcements>
                    </ErrorBoundary>
                    <ErrorBoundary>
                      <SnapShare  {...this.props}></SnapShare>
                    </ErrorBoundary>
                    <div className=" row p-0 me-0 ms-0">
                      <ErrorBoundary>
                        <SocialMedia {...this.props}></SocialMedia>
                      </ErrorBoundary>
                      <ErrorBoundary>
                        <Rewards {...this.props}></Rewards>
                      </ErrorBoundary>
                    </div>
                  </div>
                </div>
                <div className="col-xl-4 col-sm-12">
                  <div className="row">
                    <ErrorBoundary>
                      <PortalNavigation {...this.props}></PortalNavigation>
                    </ErrorBoundary>
                    <ErrorBoundary>
                      <MyApps {...this.props}></MyApps>
                    </ErrorBoundary>
                    <ErrorBoundary>
                      <Calender {...this.props}></Calender>
                    </ErrorBoundary>
                    <ErrorBoundary>
                      <CompanyEvents {...this.props}></CompanyEvents>
                    </ErrorBoundary>
                    <ErrorBoundary>
                      <EmployeeSurvey {...this.props}></EmployeeSurvey>
                    </ErrorBoundary>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className='loaderContainer' style={{ display: this.state.hideLoader ? 'none' : 'flex' }}>
            <div className="loader">
            </div>
          </div>
        </div>
      </div>
    );
  }
}


