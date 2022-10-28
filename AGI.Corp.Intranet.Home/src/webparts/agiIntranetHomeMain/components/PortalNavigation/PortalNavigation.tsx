import * as React from "react";
import { useEffect, useState } from "react";
import { INavigation } from "../../models/INavigation";
import { IPortalNavigation } from "../../models/IPortalNavigation";
import SPService from "../../services/SPService";

let siteUrl: string = '';

export const PortalNavigation = (props: IPortalNavigation) => {
    const [error, setError] = useState(null);
    const [navigations, setNavigations] = useState([]);
    const _spService = new SPService(props);
    siteUrl = props.siteUrl;
    const configItem = props.configItems.filter((configItem) => configItem.Title === 'Portal Navigation' && configItem.Section === 'Home')[0];

    useEffect(() => {
        const getExtraNavigation = async () => {
            let navigations: INavigation[] = await _spService.getExtraNavigation();
            setNavigations(navigations);
        }
        getExtraNavigation().catch((error) => {
            setError(error);
        })
    }, [])

    if (error) {
        throw error;
    }

    return (
        <>
            {
                !configItem?.Hide && <div className="icon-links-wrapper">
                    <div className="icon-links">
                        <ul>
                            {navigations.map((navigation: INavigation) => {
                                let imageUrl = JSON.parse(navigation.NavIcon);
                                imageUrl = imageUrl?.serverUrl + imageUrl?.serverRelativeUrl;
                                let url = navigation.NavigationUrl?.Url;
                                url = url.toLowerCase().indexOf(props.siteUrl?.toLowerCase()) > -1 ? `${url}?env=WebView` : url;
                                return (<>
                                    <li>
                                        <a href={url} data-interception="off">
                                            <img src={imageUrl} />
                                            <b>{navigation.Title}</b>
                                        </a>
                                    </li>
                                </>)
                            })}
                        </ul>
                    </div>
                </div>
            }
        </>
    );
}