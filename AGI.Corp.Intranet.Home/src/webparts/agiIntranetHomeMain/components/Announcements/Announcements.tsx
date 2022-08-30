import * as React from "react";
import { IAgiIntranetHomeMainProps } from "../IAgiIntranetHomeMainProps";

export const Announcements = (props: IAgiIntranetHomeMainProps) => {
    return (<div className="col-md-12 announcement-section ">
        <div className="card border-radius-0">

            <div className="card-body">
                <div id="carouselExampleCaptions2" className="carousel slide"
                    data-bs-ride="carousel">
                    <div className="d-flex align-items-center justify-content-between flex-wrap mb-4 card-header announcement-header px-0">

                        <h4>Announcements</h4>

                        <div className="p-0 position-relative ">
                            <button className="carousel-control-prev" type="button"
                                data-bs-target="#carouselExampleCaptions2"
                                data-bs-slide="prev">
                                <span className="carousel-control-prev-icon"
                                    aria-hidden="true"></span>
                                <span className="visually-hidden">Previous</span>
                            </button>
                            <button className="carousel-control-next" type="button"
                                data-bs-target="#carouselExampleCaptions2"
                                data-bs-slide="next">
                                <span className="carousel-control-next-icon"
                                    aria-hidden="true"></span>
                                <span className="visually-hidden">Next</span>
                            </button>

                        </div>

                    </div>
                    <div className="carousel-inner pt-9">

                        <div className="carousel-item active">

                            <div className="row">
                                <div className="col-12 col-md-6 mb-4">
                                    <div className="d-flex ">
                                        <div
                                            className="icon-announcement text-dark flex-shrink-0 me-3">
                                            <img src={`${props.siteUrl}/Assets/images/announcement-1.png`}
                                                width="100%" />
                                        </div>
                                        <div className="d-flex flex-column flex-wrap">
                                            <p className="announcement-date">March 23, 12.30pm
                                            </p>
                                            <p className="announcement-title">Commemorated on
                                                28th of April, The World Day for Safety and
                                                Health at Work</p>
                                            <p className="mb-2 text-break text-wrap announcement-desc d-none d-sm-block ">
                                                Lorem ipsum dolor sit amet, consectetur
                                                adipiscing elit, sed do eiusmod tempor
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="col-12 col-md-6  mb-4">
                                    <div className="d-flex ">
                                        <div
                                            className="icon-announcement text-dark flex-shrink-0 me-3">
                                            <img src={`${props.siteUrl}/Assets/images/announcement-2.png`}
                                                width="100%" />
                                        </div>
                                        <div className="d-flex flex-column flex-wrap">
                                            <p className="announcement-date">March 23, 12.30pm
                                            </p>
                                            <p className="announcement-title">Commemorated on
                                                28th of April, The World Day for Safety and
                                                Health at Work</p>
                                            <p
                                                className="mb-2 text-break text-wrap announcement-desc d-none d-sm-block ">
                                                Long weekend alert, the likely dates of
                                                Islamic festival Eid Al Adha have been
                                                revealed…
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>);
}