import * as React from 'react';
import { INotificationProps } from './INotificationProps';
import { INotificationState } from './INotificationState';
import { sp } from "@pnp/sp/presets/all";
import { INotification } from '../../models/INotification';
import SPService from '../../services/SPService';

const NotificationItem = (props: any) => {
    const { notification, assetsPath, viewDetails } = props;
    return <>
        <div className={`notification-list-item ${notification.IsRead ? '' : 'unread'}`} onClick={(e) => {
            viewDetails(e, notification)
        }}>
            <p className="notification-date">
                <span><i><img src={`${assetsPath}icons/date.svg`} /></i>{notification.Date}</span>
                <span><i><img src={`${assetsPath}icons/time.svg`} /></i>{notification.Time}</span>
            </p>
            <p className="mb-2 text-break text-wrap">
                {notification.Title}
            </p>
        </div>
    </>;
}

export default class Notification extends React.Component<INotificationProps, INotificationState> {
    private _spServices: SPService;
    constructor(props: INotificationProps) {
        super(props);
        this._spServices = new SPService(this.props);

        sp.setup({
            spfxContext: this.props.context
        });

        this.state = {
            notifications: [],
            exception: null,
            rowCount: this.props.initial,
            showMore: false,
            viewMoreClicked: false
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

    componentDidUpdate(prevProps: Readonly<INotificationProps>, prevState: Readonly<INotificationState>, snapshot?: any): void {
        if (this.state.viewMoreClicked !== prevState.viewMoreClicked) {
            this.setState({
                viewMoreClicked: false
            })
            setTimeout(() => {
                this.setState({
                    rowCount: (this.state.rowCount + (this.props.counter / 2)),
                    showMore: false,
                })
            }, 1000);
        }
    }

    private viewMore() {
        this.setState({
            showMore: true,
            viewMoreClicked: true
        })
    }

    private viewDetails(e: React.MouseEvent<HTMLElement>, notification: INotification) {
        let detailPath;
        switch (notification.Type) {
            case 'News':
                detailPath = 'News%20Detail.aspx?newsID=';
                break;
            case 'EventDetails':
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
        window.location.href = `${this.props.context.pageContext.web.absoluteUrl}/SitePages/News/${detailPath}${notification.Id}&env=WebView`;
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
                                                {this.state.notifications.length === 0 &&
                                                    <div className='notification-list-item'>
                                                        <p className='mb-2 text-break text-wrap'>No items found</p>
                                                    </div>
                                                }
                                                {
                                                    this.state.notifications.slice(0, this.state.rowCount).map((notification: INotification) => {
                                                        return (
                                                            <NotificationItem notification={notification} assetsPath={assetsPath} viewDetails={(e: React.MouseEvent<HTMLElement>) => this.viewDetails(e, notification)}></NotificationItem>
                                                        )
                                                    })
                                                }
                                                <div className={`notification-list-content-next ${this.state.showMore ? 'show' : ''}`}>
                                                    {
                                                        this.state.notifications.slice(this.state.rowCount, this.state.rowCount + this.props.counter).map((notification: INotification) => {
                                                            return (
                                                                <NotificationItem notification={notification} assetsPath={assetsPath} viewDetails={(e: React.MouseEvent<HTMLElement>) => this.viewDetails(e, notification)}></NotificationItem>
                                                            )
                                                        })
                                                    }
                                                </div>
                                            </div>
                                            {(this.state.rowCount < this.state.notifications.length) && <div className="text-left load-more-content mt-3">
                                                <a href="#" className="load-more" id="load-more" onClick={() => this.viewMore()}>View more</a>
                                            </div>}
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
