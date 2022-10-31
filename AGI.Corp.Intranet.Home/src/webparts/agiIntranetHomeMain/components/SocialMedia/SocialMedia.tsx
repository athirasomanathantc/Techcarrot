import * as React from "react";
import { useEffect } from "react";
import { useRef, useState } from "react";
import { SPComponentLoader } from '@microsoft/sp-loader';
import { ISocialMediaComponent } from "../../models/ISocialMediaComponent";
import { IConfigItem } from "../../models/IConfigItem";

export const SocialMedia = (props: ISocialMediaComponent) => {
    const titleRef = useRef<any>();
    const [dimensions, setDimensions] = useState({ width: 0, height: 390, dimensionSet: false });
    const configItem: IConfigItem = props.configItems.filter((configItem) => configItem.Title === 'Social Media Title' && configItem.Section === 'Home')[0];

    useEffect(() => {
        const renderSocialMedia = async () => {
            if (titleRef.current?.offsetWidth > 0) {
                SPComponentLoader.loadScript(`https://connect.facebook.net/en_US/sdk.js#xfbml=1&version=v15.0`,)
                    .then(() => {
                        setDimensions({
                            ...dimensions,
                            width: titleRef.current?.offsetWidth - 40,
                            dimensionSet: true
                        })
                    });
            }
        }
        renderSocialMedia();
    }, [titleRef.current]);

    return (<>
        {!configItem?.Hide && <div className="col-sm-6 col-xl-6  social-media-section mb-4 mb-md-0">
            <div className="card h-100">
                <div data-bs-target="#socialOffer" data-bs-toggle="collapse" ref={titleRef}>
                    <div className="card-header d-flex align-items-center justify-content-between" >
                        <h4 className="card-title mb-0">{configItem?.Detail}</h4>
                        <div className="d-md-none me-0 ms-auto">
                            <div className="float-right navbar-toggler d-md-none">
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18">
                                    <g id="Dropdown-Logo" transform="translate(-84 -7.544)">
                                        <path id="Path_73662" data-name="Path 73662" d="M15.739,7.87,8.525.656,7.868,0,0,7.87" transform="translate(100.366 20.883) rotate(180)" fill="none" stroke="#dccede" stroke-width="1.5">
                                        </path>
                                        <rect id="Rectangle_7537" data-name="Rectangle 7537" width="18" height="18" transform="translate(84 7.544)" fill="none">
                                        </rect>
                                    </g>
                                </svg>
                            </div>
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
        </div >}
    </>);
}