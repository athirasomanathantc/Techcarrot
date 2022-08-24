import * as React from 'react';
import { INotificationProps } from './INotificationProps';
import { INotificationState } from './INotificationState';
import { sp } from "@pnp/sp/presets/all";
import { INotification } from '../../models/INotification';
import SPService from '../../services/SPService';

export default class Notification extends React.Component<INotificationProps, INotificationState> {
    private _spServices: SPService;
    constructor(props: INotificationProps) {
        super(props);
        this._spServices = new SPService(this.props.context);

        sp.setup({
            spfxContext: this.props.context
        });

        this.state = {
            notifications: [],
            exception: null,
            rowCount: 8
        }
    }

    public async componentDidMount(): Promise<void> {
        try {
            let newsItems: INotification[] = await this._spServices.getNotifications();
            if (newsItems.length) {
                this.setState({
                    notifications: newsItems
                });
            }
        }
        catch (exception: any) {
            this.setState({
                exception: exception
            })
        }
    }

    private viewDetails(e: React.MouseEvent<HTMLElement>, notification: INotification) {
        let detailPath;
        switch (notification.Type) {
            case 'News':
                detailPath = 'News%20Detail.aspx?newsID=';
                break;
            case 'Events':
                detailPath = 'Events/Event%20Details.aspx?eventID=';
                break;
            case 'Announcements':
                detailPath = 'Announcements/Announcement%20Details.aspx?announcementID=';
                break;
            case 'Blogs':
                detailPath = 'Blogs/Blog%20Details.aspx?blogID=';
                break;
            default: break;
        }
        window.location.href = `${this.props.context.pageContext.web.absoluteUrl}/SitePages/News/${detailPath}${notification.Id}`;
    }

    private viewMore() {
        this.setState({
            rowCount: this.state.rowCount + 10
        })
    }

    public render(): React.ReactElement<INotificationProps> {
        const assetsPath = `${this.props.context.pageContext.web.absoluteUrl}/Assets/`;
        if (this.state.exception) {
            throw new Error(this.state.exception);
        }
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
                                                <h3>Notification</h3>
                                            </div>
                                        </div>
                                        <div className="row mt-3">
                                            <div className="notification-list-content">
                                                {
                                                    this.state.notifications.slice(0, this.state.rowCount).map((notification: INotification) => {
                                                        return (
                                                            <div className={`notification-list-item ${notification.IsRead ? '' : 'unread'}`} onClick={(e) => {
                                                                this.viewDetails(e, notification)
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
                                                <a href="#" className="load-more" id="load-more" onClick={() => this.viewMore()}>View more</a>
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
