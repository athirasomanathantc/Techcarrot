import * as React from "react";
import { IAgiIntranetHomeMainProps } from "../IAgiIntranetHomeMainProps";

export const PortalNavigation = (props: IAgiIntranetHomeMainProps) => {
    return (<div className="icon-links-wrapper">
        <div className="icon-links">
            <ul>
                <li>
                    <a href="#"><img src={`${props.siteUrl}/Assets/images/human-reources.svg`} /><b>Human
                        Resources</b></a>
                </li>
                <li>
                    <a href="#"><img src={`${props.siteUrl}/Assets/images/group-it.svg`} /><b>Group IT
                        Portal</b></a>
                </li>
                <li>
                    <a href="#"><img src={`${props.siteUrl}/Assets/images/competition.svg`} /><b>Games &
                        Competition</b></a>
                </li>
                <li>
                    <a href="#"><img src={`${props.siteUrl}/Assets/images/snap-share.svg`} /><b>Snap & Share</b></a>
                </li>
                <li>
                    <a href="#"><img src={`${props.siteUrl}/Assets/images/faq.svg`} /><b>FAQ</b></a>
                </li>
            </ul>
        </div>
    </div>);
}