import * as React from "react";
import { useEffect, useState } from "react";
import { IConfigItem } from "../../models/IConfigItem";
import { IMyApp } from "../../models/IMyApp";
import { IMyAppsComponent } from "../../models/IMyAppsComponent";
import Common from "../../services/Common";
import SPService from "../../services/SPService";
import { IAgiIntranetHomeMainProps } from "../IAgiIntranetHomeMainProps";

let siteUrl: string = '';

const MyApp = (props: IMyApp) => {
    let imageUrl = JSON.parse(props.AppIcon);
    imageUrl = imageUrl?.serverUrl + imageUrl?.serverRelativeUrl;

    let url = props.NavigationUrl?.Url;
    url = url.toLowerCase().indexOf(siteUrl?.toLowerCase()) > -1 ? `${url}?env=WebView` : url;
    let trgt;
    const external = props.IsExternal;
    if (external == true) {
        trgt = '_blank';
    }
    else {
        trgt = '_self';
    }

    return (<>
        <div className="col col-lg-6 col-sm-4">
            <a className="navlink" href={`${url}`} target={trgt} data-interception="off">
                <div className="d-flex app-item">
                    <div className="app-item-icon"><img src={imageUrl} /></div>
                    <div className="d-flex flex-column justify-content-around">
                        <h5 className="me-2 mb-0">{props.Title}</h5>
                    </div>
                </div>
            </a>
        </div>
    </>)
}

const MyAppsCarousel = (props: any) => {
    return (<>
        <div className={`row carousel-item ${!props.index ? 'active' : ''}`}>
            {props.myAppsCarouselItem.map((myApp: IMyApp, index: number) =>
                <MyApp
                    index={index}
                    key={`key${index}`}
                    {...myApp}></MyApp>)}
        </div>
    </>)
}

export const MyApps = (props: IMyAppsComponent) => {
    const [error, setError] = useState(null);
    const [myAppsCarousel, setMyAppsCarousel] = useState([]);
    const _spService = new SPService(props);
    const _common = new Common();
    siteUrl = props.siteUrl;
    const configItem: IConfigItem = props.configItems.filter((configItem) => configItem.Title === 'My Apps Title' && configItem.Section === 'Home')[0];

    useEffect(() => {
        const getExtraNavigation = async () => {
            let myApps: IMyApp[] = await _spService.getMyApps();
            const myAppsCarousel = _common.generateCarouselArray(myApps, 4);
            setMyAppsCarousel(myAppsCarousel);
        }
        getExtraNavigation().catch((error) => {
            setError(error);
        })
    }, [])

    if (error) {
        throw error;
    }

    return (<>
        {myAppsCarousel.length > 0 && !configItem?.Hide && <div className="col-md-12 my-app ">
            <div className="card carousel slide" id="myApps">
                <div className="card-header d-flex align-items-center justify-content-between">
                    <h4 className="card-title m-2 me-2">{configItem?.Detail}</h4>
                    <div className="p-0 ms-3 position-relative">
                        <button className="carousel-control-prev" style={{ borderRadius: '60px' }} type="button"
                            data-bs-target="#myApps"
                            data-bs-slide="prev">
                            <span className="carousel-control-prev-icon"
                                aria-hidden="true"></span>
                            <span className="visually-hidden">Previous</span>
                        </button>
                        <button className="carousel-control-next" style={{ borderRadius: '60px' }} type="button"
                            data-bs-target="#myApps"
                            data-bs-slide="next">
                            <span className="carousel-control-next-icon"
                                aria-hidden="true"></span>
                            <span className="visually-hidden">Next</span>
                        </button>
                    </div>
                </div>
                <div className="card-body">

                    <div className="app-wrapper carousel-inner">
                        {myAppsCarousel.map((myAppsCarouselItem, index) =>

                            <MyAppsCarousel
                                index={index}
                                key={`key${index}`}
                                myAppsCarouselItem={myAppsCarouselItem}></MyAppsCarousel>)}

                    </div>
                </div>
            </div>
        </div>}
    </>);
}