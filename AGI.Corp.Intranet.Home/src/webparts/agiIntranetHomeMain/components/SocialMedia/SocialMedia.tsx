import * as React from "react";
import { IAgiIntranetHomeMainProps } from "../IAgiIntranetHomeMainProps";

export const SocialMedia = (props: IAgiIntranetHomeMainProps) => {
    return (<div className="col-sm-6 col-xl-6  social-media-section mb-4 mb-md-0">
        <div className="card h-100">
            <div data-bs-target="#socialOffer" data-bs-toggle="collapse">
                <div className="card-header d-flex align-items-center justify-content-between" >
                    <h4 className="card-title mb-0">Social Media</h4>
                    <div className="d-md-none " >
                        <div className="float-right navbar-toggler d-md-none">
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18">
                                <g id="Dropdown-Logo" transform="translate(-84 -7.544)">
                                    <path id="Path_73662" data-name="Path 73662" d="M15.739,7.87,8.525.656,7.868,0,0,7.87" transform="translate(100.366 20.883) rotate(180)" fill="none" stroke="#dccede" stroke-width="1.5" />
                                    <rect id="Rectangle_7537" data-name="Rectangle 7537" width="18" height="18" transform="translate(84 7.544)" fill="none" />
                                </g>
                            </svg>
                        </div>
                    </div>
                    <div className="p-0 position-relative d-none d-md-block">
                        <button className="carousel-control-prev" type="button"
                            data-bs-target="#socialMediaControls"
                            data-bs-slide="prev">
                            <span className="carousel-control-prev-icon"
                                aria-hidden="true"></span>
                            <span className="visually-hidden">Previous</span>
                        </button>
                        <button className="carousel-control-next" type="button"
                            data-bs-target="#socialMediaControls"
                            data-bs-slide="next">
                            <span className="carousel-control-next-icon"
                                aria-hidden="true"></span>
                            <span className="visually-hidden">Next</span>
                        </button>

                    </div>
                </div>
            </div>

            <div className="collapse dont-collapse-sm" id="socialOffer">
                <div className="card-body d-flex flex-column align-items-center justify-content-center ">
                    <div id="socialMediaControls" className="carousel slide" data-bs-ride="carousel">
                        <div className="carousel-inner">
                            <div className="carousel-item active">
                                <img src={`${props.siteUrl}/Assets/images/social-media-img-1.png`} className="d-block w-100" alt="..." />
                                <div className="carousel-caption overlay">

                                    <p>As one of the largest importers of Canadian food products in the UAE, Al Ghurair Resources International had the privilege of hosting Kyle Procyshyn, Managing Director, and Ali S. Ali, … Trade & Investment Officer from Saskatchewan’s UAE Office, at the business’ facilities in Dubai last week, 13th July. The visit speaks as a testament to the longstanding bilateral trade relationship between the UAE and Canada, and the business’ key role in contributing to the country’s economy and advancing its food security agenda. With a focus on fostering agricultural prosperity in both nations, discussions were held in relation to furthering partnerships with additional Canadian agricultural commodity suppliers, uncovering regional insights, technological advancements within the canola industry, and cost-effective solutions. At Al Ghurair Investment we recognise that we have a critical role to play in supporting the global drive for enhanced food security and are committed to continuous improvement, as we invest in innovation to bring the best quality products to consumers across the region, and beyond. #AlGhurair #AGI #AGINews #Purposeled #EnhancingLife #AlGhurairInvestment #AlGhurairResources #FoodSecurity #Partnership #Sustainability #Innovation</p>
                                    <div className="caption-bottom d-flex justify-content-between">
                                        <div className="bottom-text">
                                            <h5>Al Ghurair Investment</h5>
                                            <p>18 July</p>
                                        </div>
                                        <div className="linkedin-icon">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="31.979" height="31.979" viewBox="0 0 31.979 31.979">
                                                <path id="linkedin_1_" data-name="linkedin (1)" d="M29.087,0H2.893A2.893,2.893,0,0,0,0,2.893V29.087a2.893,2.893,0,0,0,2.893,2.893H29.087a2.893,2.893,0,0,0,2.893-2.893V2.893A2.893,2.893,0,0,0,29.087,0ZM9.9,27.613a.842.842,0,0,1-.842.842H5.47a.842.842,0,0,1-.842-.842V12.591a.842.842,0,0,1,.842-.842H9.054a.842.842,0,0,1,.842.842ZM7.262,10.333a3.4,3.4,0,1,1,3.4-3.4A3.4,3.4,0,0,1,7.262,10.333ZM28.623,27.681a.774.774,0,0,1-.774.774H24a.774.774,0,0,1-.774-.774V20.635c0-1.051.308-4.606-2.747-4.606-2.37,0-2.851,2.433-2.947,3.525v8.127a.774.774,0,0,1-.774.774H13.043a.774.774,0,0,1-.774-.774V12.523a.774.774,0,0,1,.774-.774h3.719a.774.774,0,0,1,.774.774v1.311C18.414,12.515,19.72,11.5,22.5,11.5c6.157,0,6.122,5.753,6.122,8.913v7.27Z" fill="#fff" />
                                            </svg>
                                        </div>
                                    </div>


                                </div>

                            </div>
                            <div className="carousel-item">
                                <img src={`${props.siteUrl}/Assets/images/social-media-img-1.png`} className="d-block w-100" alt="..." />
                                <div className="carousel-caption overlay">

                                    <p>As one of the largest importers of Canadian food products in the UAE, Al Ghurair Resources International had the privilege of hosting Kyle Procyshyn, Managing Director, and Ali S. Ali, … Trade & Investment Officer from Saskatchewan’s UAE Office, at the business’ facilities in Dubai last week, 13th July. The visit speaks as a testament to the longstanding bilateral trade relationship between the UAE and Canada, and the business’ key role in contributing to the country’s economy and advancing its food security agenda. With a focus on fostering agricultural prosperity in both nations, discussions were held in relation to furthering partnerships with additional Canadian agricultural commodity suppliers, uncovering regional insights, technological advancements within the canola industry, and cost-effective solutions. At Al Ghurair Investment we recognise that we have a critical role to play in supporting the global drive for enhanced food security and are committed to continuous improvement, as we invest in innovation to bring the best quality products to consumers across the region, and beyond. #AlGhurair #AGI #AGINews #Purposeled #EnhancingLife #AlGhurairInvestment #AlGhurairResources #FoodSecurity #Partnership #Sustainability #Innovation</p>
                                    <div className="caption-bottom d-flex justify-content-between">
                                        <div className="bottom-text">
                                            <h5>Al Ghurair Investment</h5>
                                            <p>18 July</p>
                                        </div>
                                        <div className="linkedin-icon">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="31.979" height="31.979" viewBox="0 0 31.979 31.979">
                                                <path id="linkedin_1_" data-name="linkedin (1)" d="M29.087,0H2.893A2.893,2.893,0,0,0,0,2.893V29.087a2.893,2.893,0,0,0,2.893,2.893H29.087a2.893,2.893,0,0,0,2.893-2.893V2.893A2.893,2.893,0,0,0,29.087,0ZM9.9,27.613a.842.842,0,0,1-.842.842H5.47a.842.842,0,0,1-.842-.842V12.591a.842.842,0,0,1,.842-.842H9.054a.842.842,0,0,1,.842.842ZM7.262,10.333a3.4,3.4,0,1,1,3.4-3.4A3.4,3.4,0,0,1,7.262,10.333ZM28.623,27.681a.774.774,0,0,1-.774.774H24a.774.774,0,0,1-.774-.774V20.635c0-1.051.308-4.606-2.747-4.606-2.37,0-2.851,2.433-2.947,3.525v8.127a.774.774,0,0,1-.774.774H13.043a.774.774,0,0,1-.774-.774V12.523a.774.774,0,0,1,.774-.774h3.719a.774.774,0,0,1,.774.774v1.311C18.414,12.515,19.72,11.5,22.5,11.5c6.157,0,6.122,5.753,6.122,8.913v7.27Z" fill="#fff" />
                                            </svg>
                                        </div>
                                    </div>


                                </div>
                            </div>
                            <div className="carousel-item">
                                <img src={`${props.siteUrl}/Assets/images/social-media-img-1.png`} className="d-block w-100" alt="..." />
                                <div className="carousel-caption overlay">

                                    <p>As one of the largest importers of Canadian food products in the UAE, Al Ghurair Resources International had the privilege of hosting Kyle Procyshyn, Managing Director, and Ali S. Ali, … Trade & Investment Officer from Saskatchewan’s UAE Office, at the business’ facilities in Dubai last week, 13th July. The visit speaks as a testament to the longstanding bilateral trade relationship between the UAE and Canada, and the business’ key role in contributing to the country’s economy and advancing its food security agenda. With a focus on fostering agricultural prosperity in both nations, discussions were held in relation to furthering partnerships with additional Canadian agricultural commodity suppliers, uncovering regional insights, technological advancements within the canola industry, and cost-effective solutions. At Al Ghurair Investment we recognise that we have a critical role to play in supporting the global drive for enhanced food security and are committed to continuous improvement, as we invest in innovation to bring the best quality products to consumers across the region, and beyond. #AlGhurair #AGI #AGINews #Purposeled #EnhancingLife #AlGhurairInvestment #AlGhurairResources #FoodSecurity #Partnership #Sustainability #Innovation</p>
                                    <div className="caption-bottom d-flex justify-content-between">
                                        <div className="bottom-text">
                                            <h5>Al Ghurair Investment</h5>
                                            <p>18 July</p>
                                        </div>
                                        <div className="linkedin-icon">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="31.979" height="31.979" viewBox="0 0 31.979 31.979">
                                                <path id="linkedin_1_" data-name="linkedin (1)" d="M29.087,0H2.893A2.893,2.893,0,0,0,0,2.893V29.087a2.893,2.893,0,0,0,2.893,2.893H29.087a2.893,2.893,0,0,0,2.893-2.893V2.893A2.893,2.893,0,0,0,29.087,0ZM9.9,27.613a.842.842,0,0,1-.842.842H5.47a.842.842,0,0,1-.842-.842V12.591a.842.842,0,0,1,.842-.842H9.054a.842.842,0,0,1,.842.842ZM7.262,10.333a3.4,3.4,0,1,1,3.4-3.4A3.4,3.4,0,0,1,7.262,10.333ZM28.623,27.681a.774.774,0,0,1-.774.774H24a.774.774,0,0,1-.774-.774V20.635c0-1.051.308-4.606-2.747-4.606-2.37,0-2.851,2.433-2.947,3.525v8.127a.774.774,0,0,1-.774.774H13.043a.774.774,0,0,1-.774-.774V12.523a.774.774,0,0,1,.774-.774h3.719a.774.774,0,0,1,.774.774v1.311C18.414,12.515,19.72,11.5,22.5,11.5c6.157,0,6.122,5.753,6.122,8.913v7.27Z" fill="#fff" />
                                            </svg>
                                        </div>
                                    </div>


                                </div>
                            </div>
                        </div>
                        <div className="button-bottom d-md-none">
                            <button className="carousel-control-prev" type="button" data-bs-target="#socialMediaControls" data-bs-slide="prev">
                                <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                                <span className="visually-hidden">Previous</span>
                            </button>
                            <button className="carousel-control-next" type="button" data-bs-target="#socialMediaControls" data-bs-slide="next">
                                <span className="carousel-control-next-icon" aria-hidden="true"></span>
                                <span className="visually-hidden">Next</span>
                            </button>
                        </div>


                    </div>
                </div>
            </div>
        </div>
    </div>);
}