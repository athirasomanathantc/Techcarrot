import * as moment from "moment";
import * as React from "react";
import { useEffect, useState } from "react";
import { IAnnouncement } from "../../models/IAnnouncement";
import Common from "../../services/Common";
import SPService from "../../services/SPService";
import { IAgiIntranetHomeMainProps } from "../IAgiIntranetHomeMainProps";

let siteUrl: string = '';

const imageStyle = {
    height: '140px',
    width: '214px'
}

const Announcement = (props: IAnnouncement) => {
    let imageUrl = JSON.parse(props.AnnouncementThumbnail);
    imageUrl = imageUrl?.serverUrl + imageUrl?.serverRelativeUrl;
    return (<>
        <div className="col-12 col-md-6 mb-4">
            <div className="d-flex ">
                <div
                    className="icon-announcement text-dark flex-shrink-0 me-3">
                    <img style={imageStyle} src={imageUrl}
                        width="100%" />
                </div>
                <div className="d-flex flex-column flex-wrap">
                    <p className="announcement-date">{moment(props.PublishedDate).format("MMMM DD, hh.mm A")}
                    </p>
                    <p className="announcement-title">{props.Title}</p>
                    <p className="mb-2 text-break text-wrap announcement-desc d-none d-sm-block ">
                        {props.Description}
                    </p>
                </div>
            </div>
        </div>
    </>)
}

const AnnouncementCarousel = (props: any) => {
    return (<>
        <div className={`carousel-item ${!props.index ? 'active' : ''}`}>
            <div className="row">
                {props.announcementCarouselItem.map((announcement: IAnnouncement, index: number) => <Announcement
                    index={index}
                    key={`key${index}`}
                    {...announcement}></Announcement>)}
            </div>
        </div>
    </>)
}

export const Announcements = (props: IAgiIntranetHomeMainProps) => {
    const [error, setError] = useState(null);
    const [announcementCarousel, setAnnouncementCarousel] = useState([]);
    const _spService = new SPService(props);
    const _common = new Common();
    siteUrl = props.siteUrl;
    useEffect(() => {
        const getLatestNews = async () => {
            let announcements: IAnnouncement[] = await _spService.getAnnouncements();
            const announcementCarousel = _common.generateCarouselArray(announcements, 2);
            setAnnouncementCarousel(announcementCarousel);
        }
        getLatestNews().catch((error) => {
            setError(error);
        })
    }, [])

    if (error) {
        throw error;
    }


    return (<>
        {announcementCarousel.length > 0 && <div className="col-md-12 announcement-section ">
            <div className="card border-radius-0">

                <div className="card-body">
                    <div id="carouselExampleCaptions2" className="carousel slide"
                        data-bs-ride="carousel">
                        <div className="d-flex align-items-center justify-content-between flex-wrap mb-4 card-header announcement-header px-0">

                            <h4>Announcements</h4>
                            <div className="d-flex align-items-center">
                                <a href={`${props.siteUrl}/SitePages/News/Announcements.aspx`} className="viewall-link">View All</a>
                                <div className="p-0 ms-3 position-relative ">
                                    <button className="carousel-control-prev" style={{ borderRadius: '60px' }} type="button"
                                        data-bs-target="#carouselExampleCaptions2"
                                        data-bs-slide="prev">
                                        <span className="carousel-control-prev-icon"
                                            aria-hidden="true"></span>
                                        <span className="visually-hidden">Previous</span>
                                    </button>
                                    <button className="carousel-control-next" style={{ borderRadius: '60px' }} type="button"
                                        data-bs-target="#carouselExampleCaptions2"
                                        data-bs-slide="next">
                                        <span className="carousel-control-next-icon"
                                            aria-hidden="true"></span>
                                        <span className="visually-hidden">Next</span>
                                    </button>

                                </div>
                            </div>

                        </div>
                        <div className="carousel-inner pt-9">
                            {announcementCarousel.map((announcementCarouselItem: IAnnouncement[], index: number) => <AnnouncementCarousel
                                index={index}
                                key={`key${index}`}
                                announcementCarouselItem={announcementCarouselItem}
                            ></AnnouncementCarousel>)}
                        </div>
                    </div>
                </div>
            </div>
        </div>}
    </>);
}