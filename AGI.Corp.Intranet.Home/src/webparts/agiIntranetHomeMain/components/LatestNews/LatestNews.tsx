import * as React from "react";
import { IAgiIntranetHomeMainProps } from "../IAgiIntranetHomeMainProps";

export const LatestNews = (props: IAgiIntranetHomeMainProps) => {
    return (<div className="col-md-12 latest-news-section ">
        <div className="card ">
            <div className="card-header d-flex align-items-center justify-content-between border-bottom-0 pb-0 pt-3">
                <h4 className="card-title mb-0">Latest News</h4>
                <a href="#" className="viewall-link">View All</a>
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
                        <div className="carousel-item active">
                            <img src={`${props.siteUrl}/Assets/images/latest-new-img-1.png`} className="d-block w-100"
                                alt="..." />
                            <div className="carousel-caption">
                                <span className="badge rounded-pill bg-light">Business</span>
                                <p>Al Ghurair enroute to transforming digital landscape transforming digital landscape</p>
                                <h5 className="date">19 May 2022, Dubai, UAE</h5>
                            </div>
                        </div>
                        <div className="carousel-item">
                            <img src={`${props.siteUrl}/Assets/images/latest-new-img-1.png`} className="d-block w-100"
                                alt="..." />
                            <div className="carousel-caption ">
                                <span className="badge rounded-pill bg-light">Business</span>
                                <p>Al Ghurair enroute to transforming digital landscape</p>
                                <h5 className="date">19 May 2022, Dubai, UAE</h5>
                            </div>
                        </div>
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
    </div>);
}