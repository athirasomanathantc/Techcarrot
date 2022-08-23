import * as React from 'react';
import styles from './AgiIntranetAnnouncementsDetails.module.scss';
import { IAgiIntranetAnnouncementsDetailsProps } from './IAgiIntranetAnnouncementsDetailsProps';
import { IAgiIntranetAnnouncementsDetailsStates } from './IAgiIntranetAnnouncementsDetailsStates';
import { escape } from '@microsoft/sp-lodash-subset';
import { SPService } from '../services/SPService';
import { sp } from "@pnp/sp/presets/all";
import { IAnnouncementData } from '../models/IAnnouncementData';
import * as moment from 'moment';


export default class AgiIntranetAnnouncementsDetails extends React.Component<IAgiIntranetAnnouncementsDetailsProps, IAgiIntranetAnnouncementsDetailsStates> {
  private _spServices: SPService;
  constructor(props: IAgiIntranetAnnouncementsDetailsProps) {
    super(props);
    this._spServices = new SPService(this.props.context);
    sp.setup({
      spfxContext: this.props.context
    })
    this.state = {
      announcementData: null,
      exceptionOccured: false
    }
  }

  private getQueryStringValue(param: string): string {
    try {
      const params = new URLSearchParams(window.location.search);
      let value = params.get(param) || '';
      return value;
    }
    catch (exception) {
      this.setState({
        exceptionOccured: true
      });
    }
  }

  public async componentDidMount() {
    try {
      let announcementId = this.getQueryStringValue('announcementID');
      if (!announcementId)
        return;
      const announcements: IAnnouncementData = await this._spServices.getAnnouncementById(parseInt(announcementId));
      this.setState({
        announcementData: announcements
      });
    }
    catch (exception) {
      this.setState({
        exceptionOccured: true
      });
    }
  }

  private getImageUrl(announcementImage: string): string {
    try {
      if (!announcementImage) {
        return;
      }
      const imageObj: any = JSON.parse(announcementImage);
      return imageObj.serverUrl + imageObj.serverRelativeUrl;
    }
    catch (exception) {
      this.setState({
        exceptionOccured: true
      });
    }
  }

  public render(): React.ReactElement<IAgiIntranetAnnouncementsDetailsProps> {
    const announcementData = this.state.announcementData;
    const imageUrl = announcementData ? this.getImageUrl(announcementData.AnnouncementImage): "";
    if (this.state.exceptionOccured) {
      throw new Error('Something went wrong');
    }
    return (
      <>
        {announcementData &&
          <article className="news-detail-wrapper announcement-details">
            <header className="news-detail-header">
              <p><i><img src={`${this.props.siteUrl}/Assets/icons/Date.png`} /></i>{moment(announcementData.PublishedDate).format('MMM DD, YYYY')}</p>
              <h1>{announcementData.Title}</h1>
            </header>
            <section className="news-detail-content">
              <div className="row">

                <div className="col-md-12">
                  <ul>
                    <li><img src={`${this.props.siteUrl}/Assets/icons/icon-location.png`} />{announcementData.Location}</li>
                  </ul>
                </div>
              </div>
            </section>
            <section className="news-detail-img">
              <img src={imageUrl} className="d-block w-100" alt="..." />
            </section>
            <section className="news-detail-text">
              <div dangerouslySetInnerHTML={{ __html: announcementData.Summary }}>
              </div>
            </section>
          </article>
        }
      </>

    );
  }
}
