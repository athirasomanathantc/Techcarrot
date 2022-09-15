import * as moment from "moment";
import * as React from "react";
import { useEffect, useState } from "react";
import { ILatestNews } from "../../models/ILatestNews";
import SPService from "../../services/SPService";
import { IAgiIntranetHomeMainProps } from "../IAgiIntranetHomeMainProps";

const CarouselItem = (props: ILatestNews) => {
    let imageUrl = JSON.parse(props.NewsImage);
    imageUrl = imageUrl?.serverUrl + imageUrl?.serverRelativeUrl;

    return (<>
        <div className={`carousel-item ${!props.index ? 'active' : ''}`} onClick={(e: React.MouseEvent<HTMLDivElement, MouseEvent>) => goToNews(e, props)}>
            <img src={imageUrl} className="d-block w-100"
                alt="..." />
            <div className="carousel-caption">
                <span className="badge rounded-pill bg-light">{props.Business?.Title}</span>
                <p title={props.Title}>{props.Title}</p>
                <h5 className="date">{moment(props.PublishedDate).format("DD MMM YYYY")}</h5>
            </div>
        </div>
    </>)
}

const goToNews = (e: React.MouseEvent<HTMLDivElement, MouseEvent>, props: ILatestNews) => {
    window.location.href = `${siteUrl}/SitePages//News/News%20Detail.aspx?newsID=${props.Id}`;
}

let siteUrl: string = '';

export const LatestNews = (props: IAgiIntranetHomeMainProps) => {
    const [error, setError] = useState(null);
    const [carouselItems, setCarouselItems] = useState([]);
    const _spService = new SPService(props);
    siteUrl = props.siteUrl;
    useEffect(() => {
        const getLatestNews = async () => {
            const latestNews: ILatestNews[] = await _spService.getLatestNews();
            setCarouselItems(latestNews);
        }
        getLatestNews().catch((error) => {
            setError(error);
        })
    }, [])

    if (error) {
        throw error;
    }

    return (<>
        {carouselItems.length > 0 && <div className="col-md-12 latest-news-section ">
            <div className="card ">
                <div className="card-header d-flex align-items-center justify-content-between border-bottom-0 pb-0 pt-3">
                    <h4 className="card-title mb-0">Latest News</h4>
                    <a href="./News.aspx" className="viewall-link">View All</a>
                </div>
                <div className="card-body">
                    <div id="carouselLatestNews" className="carousel slide mb-4" data-bs-ride="carousel">
                        <div className="carousel-indicators">
                            <button type="button" data-bs-target="#carouselLatestNews"
                                data-bs-slide-to="0" className="active" aria-current="true"
                                aria-label="Slide 1"></button>
                            <button type="button" data-bs-target="#carouselLatestNews"
                                data-bs-slide-to="1" aria-label="Slide 2"></button>
                            <button type="button" data-bs-target="#carouselLatestNews"
                                data-bs-slide-to="2" aria-label="Slide 3"></button>
                        </div>
                        <div className="carousel-inner">
                            {carouselItems.map((carouselItem, index) => <CarouselItem
                                index={index}
                                key={`key${index}`}
                                {...carouselItem}
                            ></CarouselItem>)}
                        </div>
                        <button className="carousel-control-prev" type="button"
                            data-bs-target="#carouselLatestNews" data-bs-slide="prev">
                            <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                            <span className="visually-hidden">Previous</span>
                        </button>
                        <button className="carousel-control-next" type="button"
                            data-bs-target="#carouselLatestNews" data-bs-slide="next">
                            <span className="carousel-control-next-icon" aria-hidden="true"></span>
                            <span className="visually-hidden">Next</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>}
    </>);
}