import * as React from "react";
import { IAgiIntranetHomeMainProps } from "../IAgiIntranetHomeMainProps";

export const MyApps = (props: IAgiIntranetHomeMainProps) => {
    return (<div className="col-md-12 my-app ">
        <div className="card ">
            <div className="card-header d-flex align-items-center justify-content-between border-bottom-0">
                <h4 className="card-title m-2 me-2">My Apps</h4>
                <a href="#" className="viewall-link">View All</a>
            </div>
            <div className="card-body">

                <div className="row app-wrapper">
                    <div className="col col-lg-6 col-sm-4">

                        <div className="d-flex app-item">
                            <div className="app-item-icon"><img src={`${props.siteUrl}/Assets/images/process1.svg`} /></div>
                            <div className="d-flex flex-column justify-content-around">
                                <h5 className="me-2 mb-0">Employee Services</h5>
                            </div>
                        </div>
                    </div>

                    <div className="col col-lg-6 col-sm-4">

                        <div className="d-flex app-item ">
                            <div className="app-item-icon"><img src={`${props.siteUrl}/Assets/images/browser.svg`} /></div>
                            <div className="d-flex flex-column justify-content-around">
                                <h5 className="me-2 mb-0">Webmail</h5>
                            </div>
                        </div>
                    </div>


                    <div className="col col-lg-6 col-sm-4">

                        <div className="d-flex app-item ">
                            <div className="app-item-icon"><img src={`${props.siteUrl}/Assets/images/online-learning1.svg`} /></div>
                            <div className="d-flex flex-column justify-content-around">
                                <h5 className="me-2 mb-0">Training</h5>
                            </div>
                        </div>
                    </div>

                    <div className="col col-lg-6 col-sm-4">

                        <div className="d-flex app-item ">
                            <div className="app-item-icon"><img src={`${props.siteUrl}/Assets/images/technical-support1.svg`} /></div>
                            <div className="d-flex flex-column justify-content-around">
                                <h5 className="me-2 mb-0">IT Services</h5>
                            </div>
                        </div>
                    </div>

                    <div className="col col-lg-6 col-sm-4">

                        <div className="d-flex app-item ">
                            <div className="app-item-icon"><img src={`${props.siteUrl}/Assets/images/document1.svg`} /></div>
                            <div className="d-flex flex-column justify-content-around">
                                <h5 className="me-2 mb-0">My Documents</h5>
                            </div>
                        </div>
                    </div>






                    <div className="col col-lg-6 col-sm-4">

                        <div className="d-flex app-item ">
                            <div className="app-item-icon"><img src={`${props.siteUrl}/Assets/images/gift.svg`} /></div>
                            <div className="d-flex flex-column justify-content-around">
                                <h5 className="me-2 mb-0">Employee Offers</h5>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>);
}