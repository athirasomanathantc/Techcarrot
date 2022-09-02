import * as React from "react";
import { useEffect, useState } from "react";
import { ISnap } from "../../models/ISnap";
import SPService from "../../services/SPService";
import { IAgiIntranetHomeMainProps } from "../IAgiIntranetHomeMainProps";

let siteUrl: string = '';

const Snap = (props: ISnap) => {
    return (<>
        <div className="img-with-text">
            <img src={`${siteUrl}/SnapAndShare/${props.LinkFilename}`} />
            <div className="overlay">
                <div className="text"><i><img src={`${siteUrl}/Assets/images/icon-camera.svg`} alt="" /></i>{props.Author?.Title}</div>
                <div className="text show-on-hover">{props.ImageDescription}</div>
            </div>
        </div>
    </>);
}

const SnapCarousel = (props: any) => {
    return (<>
        <div className={`carousel-item ${!props.index ? 'active' : ''}`}>
            <div className="snap-share-wrapper-item">
                {props.snapCarouselItem.map((snap: ISnap, index: number) => <Snap
                    index={index}
                    key={`key${index}`}
                    {...snap}></Snap>)}
            </div>
        </div>
    </>)
}

export const SnapShare = (props: IAgiIntranetHomeMainProps) => {
    const [error, setError] = useState(null);
    const [snapCarousel, setSnapCarousel] = useState([]);
    const _spService = new SPService(props);
    siteUrl = props.siteUrl;

    useEffect(() => {
        const getSnapShare = async () => {
            const snaps: ISnap[] = await _spService.getSnaps();
            const snapCarousel = [];
            let snapsColl = [];
            for (let i = 0; i < snaps.length; i += 6) {
                snapsColl = [];
                for (let j = 0; j < 6; j++) {
                    if (snaps[i + j]) {
                        snapsColl.push(snaps[j]);
                    }
                }
                if (snapsColl.length) {
                    snapCarousel.push(snapsColl);
                }
            }
            setSnapCarousel(snapCarousel);
        }
        getSnapShare().catch((error) => {
            setError(error);
        })
    }, [])

    if (error) {
        throw error;
    }


    return (<div className="col-md-12 snap-share-section mt-4 mb-4 stretch-card">
        <div className="card snap-share ">
            <div className="card-body">
                <div id="carouselExampleCaptions3" className="carousel slide"
                    data-bs-ride="carousel">
                    <div className="d-flex align-items-center justify-content-between flex-wrap card-header snap-share-header px-0">

                        <h4>Snap Share</h4>
                        <div className="p-0 position-relative">
                            <button className="carousel-control-prev" type="button"
                                data-bs-target="#carouselExampleCaptions3"
                                data-bs-slide="prev">
                                <span className="carousel-control-prev-icon"
                                    aria-hidden="true"></span>
                                <span className="visually-hidden">Previous</span>
                            </button>
                            <button className="carousel-control-next" type="button"
                                data-bs-target="#carouselExampleCaptions3"
                                data-bs-slide="next">
                                <span className="carousel-control-next-icon"
                                    aria-hidden="true"></span>
                                <span className="visually-hidden">Next</span>
                            </button>
                        </div>
                    </div>
                    <div className="carousel-inner pt-9 mt-3">
                        {snapCarousel.map((snapCarouselItem: ISnap, index: number) => <SnapCarousel
                            index={index}
                            key={`key${index}`}
                            snapCarouselItem={snapCarouselItem}
                        ></SnapCarousel>)}
                    </div>
                </div>
            </div>
        </div>
    </div>);
}