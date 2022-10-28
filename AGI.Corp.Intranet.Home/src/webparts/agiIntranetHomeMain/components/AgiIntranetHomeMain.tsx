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
import { Quiz } from './Quiz/Quiz';
import ErrorBoundary from './ErrorBoundary/ErrorBoundary';
import Calender from './Calendar/Calendar';
import SPService from '../services/SPService';
import { IConfigItem } from '../models/IConfigItem';

export default class AgiIntranetHomeMain extends React.Component<IAgiIntranetHomeMainProps, IAgiIntranetHomeMainState> {

  constructor(props: IAgiIntranetHomeMainProps) {
    super(props);
    sp.setup({
      spfxContext: this.props.context
    });
    this.state = {
      hideLoader: false,
      configItems: []
    }
  }

  private _spService = new SPService(this.props);

  public async componentDidMount(): Promise<void> {
    let configItems: IConfigItem[] = await this._spService.getConfigItems();
    this.setState({
      configItems
    });
    setTimeout(() => {
      this.setState({
        hideLoader: true
      })
    }, 1000)
  }

  public render(): React.ReactElement<IAgiIntranetHomeMainProps> {
    return (
      <div className={styles.agiIntranetHomeMain}>
        <div className="main-content">
          <div className="content-wrapper" style={{ display: this.state.hideLoader ? 'block' : 'none' }}>
            <div className="container">
              <div className="row home-page">
                <div className="col-xl-8 col-sm-12  ">
                  <div className="row">
                    <ErrorBoundary>
                      <LatestNews {...this.props} configItems={this.state.configItems}></LatestNews>
                    </ErrorBoundary>
                    <ErrorBoundary>
                      <Announcements {...this.props} configItems={this.state.configItems}></Announcements>
                    </ErrorBoundary>
                    <ErrorBoundary>
                      <SnapShare  {...this.props} configItems={this.state.configItems}></SnapShare>
                    </ErrorBoundary>
                    <div className=" row p-0 me-0 ms-0">
                      <ErrorBoundary>
                        <SocialMedia {...this.props} configItems={this.state.configItems}></SocialMedia>
                      </ErrorBoundary>
                      <ErrorBoundary>
                        <Rewards {...this.props} configItems={this.state.configItems}></Rewards>
                      </ErrorBoundary>
                    </div>
                  </div>
                </div>
                <div className="col-xl-4 col-sm-12">
                  <div className="row">
                    <ErrorBoundary>
                      <PortalNavigation {...this.props} configItems={this.state.configItems}></PortalNavigation>
                    </ErrorBoundary>
                    <ErrorBoundary>
                      <MyApps {...this.props} configItems={this.state.configItems}></MyApps>
                    </ErrorBoundary>
                    <ErrorBoundary>
                      <Calender {...this.props} configItems={this.state.configItems}></Calender>
                    </ErrorBoundary>
                    <ErrorBoundary>
                      <CompanyEvents {...this.props} configItems={this.state.configItems}></CompanyEvents>
                    </ErrorBoundary>
                    <ErrorBoundary>
                      <EmployeeSurvey {...this.props} configItems={this.state.configItems}></EmployeeSurvey>
                    </ErrorBoundary>
                    <ErrorBoundary>
                      <Quiz {...this.props} configItems={this.state.configItems}></Quiz>
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


