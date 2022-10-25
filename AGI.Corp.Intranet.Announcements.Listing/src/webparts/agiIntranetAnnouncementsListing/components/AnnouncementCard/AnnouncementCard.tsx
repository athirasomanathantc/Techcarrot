import * as moment from 'moment';
import * as React from 'react';
import { IAnnouncementData } from '../../models/IAnnouncementData';

interface IEventCard {
    siteUrl: string;
    imageUrl: string;
    announcement: IAnnouncementData;
    category: {
        ID: number;
        Title: String;
    };
    isFeatured: boolean;
}

const AnnouncementCard = (props: IEventCard) => {
    const { siteUrl, imageUrl, announcement, category, isFeatured } = props;
    return (
        <div className="card news-card h-100">
            {isFeatured && <div className="badge-label">
                <span>
                    <i>
                        <img src={`${siteUrl}/Assets/images/star.svg`} />
                    </i>
                </span>
                <span className="badge-txt">Featured</span>
            </div>}
            <img src={imageUrl} className="card-img-top" alt="Card Image" />
            <div className="card-body d-flex flex-column">
                <div className={'category'}>
                    <span><i><img src={`${siteUrl}/Assets/icons/Tag.svg`} alt="" /></i> {category ? category.Title : ""}</span>
                </div>
                <div className="mb-2 mt-2 card-content-header">
                    <h5 className="card-title">{announcement.Title}</h5>
                </div>
                <div className="date">
                    <span><i><img src={`${siteUrl}/Assets/icons/Date-blue.svg`} alt="" /></i> {moment(announcement.PublishedDate).format('DD-MMM-YYYY')}</span>

                </div>
                <p className="card-text mt-2">{announcement.Description}</p>
                <a href={`${siteUrl}/SitePages/News/Announcements/Announcement Details.aspx?announcementID=${announcement.ID}`} className="btn news-read-more  align-self-start">Read more</a>
            </div>
        </div>
    )
}

export default AnnouncementCard;