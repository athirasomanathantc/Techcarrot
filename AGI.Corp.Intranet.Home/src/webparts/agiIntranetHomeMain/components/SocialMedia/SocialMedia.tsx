import * as React from "react";
import { useEffect } from "react";
import { useLayoutEffect, useRef, useState } from "react";
import { IAgiIntranetHomeMainProps } from "../IAgiIntranetHomeMainProps";
import { SPComponentLoader } from '@microsoft/sp-loader';

export const SocialMedia = (props: IAgiIntranetHomeMainProps) => {
    const titleRef = useRef<any>();
    const [dimensions, setDimensions] = useState({ width: 0, height: 390, dimensionSet: false });

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
        <div className="col-sm-6 col-xl-6  social-media-section mb-4 mb-md-0">
            <div className="card h-100">
                <div data-bs-target="#socialOffer" data-bs-toggle="collapse" ref={titleRef}>
                    <div className="card-header d-flex align-items-center justify-content-between" >
                        <h4 className="card-title mb-0">Social Media</h4>
                    </div>
                </div>

                <div className="collapse dont-collapse-sm" id="socialOffer">
                    {dimensions.dimensionSet && <div className="card-body d-flex flex-column align-items-center justify-content-center">
                        <div className="fb-page" data-href="https://www.facebook.com/AlGhurairInvestment" data-tabs="timeline" data-width={dimensions.width} data-height={dimensions.height} data-small-header="true" data-adapt-container-width="false" data-hide-cover="false" data-show-facepile="true">
                            <blockquote cite="https://www.facebook.com/AlGhurairInvestment" className="fb-xfbml-parse-ignore">
                                <a href="https://www.facebook.com/AlGhurairInvestment">Al Ghurair Investment</a>
                            </blockquote>
                        </div>
                    </div>}
                </div>
            </div>
        </div >
    </>);
}