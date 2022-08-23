import * as React from 'react';
import styles from './AgiIntranetNewsNotifications.module.scss';
import { IAgiIntranetNewsNotificationsProps } from './IAgiIntranetNewsNotificationsProps';
import { IAgiIntranetNewsNotificationsState } from './IAgiIntranetNewsNotificationsState';
import { sp } from "@pnp/sp/presets/all";
import { INotification } from '../models/INotification';

export default class AgiIntranetNewsNotifications extends React.Component<IAgiIntranetNewsNotificationsProps, IAgiIntranetNewsNotificationsState> {
  constructor(props: IAgiIntranetNewsNotificationsProps) {
    super(props);
    sp.setup({
      spfxContext: this.props.context
    });

    this.state = {
      notifications: []
    }
  }

  public async componentDidMount(): Promise<void> {
    let newsItems: INotification[] = await sp.web.lists.getByTitle('News').items.select("Id,Title,PublishedDate").top(8)();
    if (newsItems.length) {
      newsItems = newsItems.map((newsItem) => {
        return {
          ...newsItem,
          Date: this.getFormattedDate(newsItem.PublishedDate),
          Time: this.getFormattedTime(newsItem.PublishedDate)
        };
      }, this)
      this.setState({
        notifications: newsItems
      });
    }
  }

  private getFormattedDate(date: string) {
    const d = new Date(date);
    const month = d.toLocaleString('default', { month: 'long' });
    return `${month} ${d.getDate()}, ${d.getFullYear()}`;
  }

  private getFormattedTime(date: string) {
    const d = new Date(date);
    let hours = d.getHours();
    let minutes = d.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    const minutestring = minutes < 10 ? '0' + minutes : minutes;
    const strTime = hours + ':' + minutestring + ' ' + ampm;
    return strTime;
  }

  private onClick(e: React.MouseEvent<HTMLElement>, notification: INotification) {
    window.location.href = `${this.props.context.pageContext.web.absoluteUrl}/SitePages/News/News%20Detail.aspx?newsID=${notification.Id}`;
  }

  public render(): React.ReactElement<IAgiIntranetNewsNotificationsProps> {
    const assetsPath = `${this.props.context.pageContext.web.absoluteUrl}/Assets/`;
    return (
      <div>
        <div className="main-content">
          <div className="content-wrapper">
            <div className="container">
              <div className="row">
                <div className="notification-section">
                  <div className="notification-list-wrapper">
                    <div className="row">
                      <div className="header-title">
                        <h3>Notifications</h3>
                      </div>
                    </div>
                    <div className="row mt-3">
                      <div className="notification-list-content">
                        {
                          this.state.notifications.map((notification: INotification) => {
                            return (
                              <div className="notification-list-item" onClick={(e) => {
                                this.onClick(e, notification)
                              }}>
                                <p className="notification-date">
                                  <span><i><img src={`${assetsPath}icons/date.svg`} /></i>{notification.Date}</span>
                                  <span><i><img src={`${assetsPath}icons/date.svg`} /></i>{notification.Time}</span>
                                </p>
                                <p className="mb-2 text-break text-wrap">
                                  {notification.Title}
                                </p>
                              </div>
                            )
                          })
                        }
                      </div>
                      <div className="text-left load-more-content mt-3">
                        <a href="#" className="load-more" id="load-more">View more</a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
