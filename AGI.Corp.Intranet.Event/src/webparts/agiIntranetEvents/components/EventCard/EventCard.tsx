import * as moment from 'moment';
import * as React from 'react';
import { IEventData } from '../../Model/IEventData';

interface IEventCard {
    imageUrl: string;
    item: IEventData;
    siteUrl: string;
    guid: string;
    selectedTab: string;
    isFeatured: boolean;
}

const EventCard = (props: IEventCard) => {
    const { imageUrl, item, siteUrl, guid, selectedTab, isFeatured } = props;
    return (
        <div className={'card news-card h-100'}>
            {isFeatured && <div className="badge-label">
                <span>
                    <i>
                        <img src={`${siteUrl}/Assets/images/star.svg`} />
                    </i>
                </span>
                <span className="badge-txt">Featured</span>
            </div>}
            <img src={imageUrl} className={'card-img-top'} alt="Card Image" />
            <div className={'card-body d-flex flex-column'}>
                <div className={'event-date-wrapper'}>
                    <div className={'event-date'} style={{ display: item.StartDate === null ? "none" : "display" }}>
                        <p className={'notification-date'} >
                            {moment(item.StartDate).format('DD')}
                        </p>
                        <p className={'notification-month'} >
                            {moment(item.StartDate).format('MMM')}
                        </p>
                    </div>
                    {
                        item.EndDate &&
                        <>
                            <div className={'divider'} style={{ display: item.StartDate == item.EndDate ? "none" : "display" }}></div>
                            <div className={'event-date'} style={{ display: item.StartDate == item.EndDate ? "none" : "display" }} >
                                <p className={'notification-date'} >
                                    {moment(item.EndDate).format('DD')}
                                </p>
                                <p className={'notification-month'} >
                                    {moment(item.EndDate).format('MMM')}
                                </p>
                            </div>
                        </>
                    }
                </div>
                <div>
                    <img src={`${siteUrl}/Assets/images/calendar-icon.svg`} alt="" />
                    <a target="_blank" style={{ display: 'inline-block' }} data-interception="off" className="add-to-calendar" href={`${siteUrl}/_vti_bin/owssvr.dll?CS=109&Cmd=Display&List=%7B${guid}%7D&CacheControl=1&ID=${item.ID}&Using=event.ics`} download="Event.ics">
                        Add to Calendar
                    </a>
                </div>
                <div className={'mb-3 card-content-header'}>
                    <h5 className={'card-title'}>{item.Title}</h5>
                </div>
                <div className={'news-details'}>
                    <span><i><img src={`${siteUrl}/Assets/icons/icon-location.png`} alt="" /></i> {item.City},{item.Country}</span>

                </div>
                <p className={'card-text'}>{item.Description}</p>
                <a href={`${siteUrl}/SitePages/News/Events/Event Details.aspx?eventID=${item.ID}&tab=${selectedTab}`}
                    className={'news-read-more  align-self-start'} data-interception="off">Read more</a>
            </div>
        </div>
    )
}

export default EventCard;