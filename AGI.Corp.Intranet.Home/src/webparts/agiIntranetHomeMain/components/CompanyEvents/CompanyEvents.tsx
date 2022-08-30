import * as React from "react";
import { IAgiIntranetHomeMainProps } from "../IAgiIntranetHomeMainProps";

export const CompanyEvents = (props: IAgiIntranetHomeMainProps) => {
    return (<div className="col-md-12 mt-4  ">
        <div className="card  company-event">
            <div className="card-header d-flex align-items-center justify-content-between">
                <h4 className="card-title m-2 me-2">Company Events</h4>
                <a href="#" className="viewall-link">View All</a>
            </div>
            <div className="card-body">
                <ul className="p-0 m-0 list-group">
                    <li className="list-group-item">
                        <div className="d-flex align-items-center">
                            <div className="event-date flex-shrink-0 me-3">
                                <p className="notification-date">12</p>
                                <p className="notification-month">May</p>
                            </div>
                            <div className="d-flex flex-column flex-wrap">

                                <p className="mb-2 text-break text-wrap">
                                    Changing Your Business Mindset From Operational To
                                    Aspirational
                                </p>
                            </div>
                        </div>
                    </li>
                    <li className="list-group-item">
                        <div className="d-flex align-items-center">
                            <div className="event-date  flex-shrink-0 me-3">
                                <p className="notification-date">12</p>
                                <p className="notification-month">May</p>
                            </div>
                            <div className="d-flex flex-column flex-wrap">

                                <p className="mb-2 text-break text-wrap">
                                    Changing Your Business Mindset From Operational To
                                    Aspirational
                                </p>
                            </div>
                        </div>
                    </li>
                    <li className="list-group-item">
                        <div className="d-flex align-items-center">
                            <div className="event-date  flex-shrink-0 me-3">
                                <p className="notification-date">12</p>
                                <p className="notification-month">May</p>
                            </div>
                            <div className="d-flex flex-column flex-wrap">

                                <p className="mb-2 text-break text-wrap">
                                    Changing Your Business Mindset From Operational To
                                    Aspirational
                                </p>
                            </div>
                        </div>
                    </li>
                </ul>


            </div>
        </div>
    </div>);
}