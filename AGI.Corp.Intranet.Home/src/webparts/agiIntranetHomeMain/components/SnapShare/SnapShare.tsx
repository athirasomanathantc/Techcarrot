import * as React from "react";
import { useEffect, useState } from "react";
import { ISnap } from "../../models/ISnap";
import Common from "../../services/Common";
import SPService from "../../services/SPService";
import { IAgiIntranetHomeMainProps } from "../IAgiIntranetHomeMainProps";
import { ImagePreview } from "./ImagePreview";

export const SnapShare = (props: IAgiIntranetHomeMainProps) => {
    const [error, setError] = useState(null);
    const [snapCarousel, setSnapCarousel] = useState([]);
    const [mobsnapCarousel, setmobSnapCarousel] = useState([]);
    const [showImagePreview, setShowImagePreview] = useState(null);
    const _spService = new SPService(props);
    const _common = new Common();
    let siteUrl: string = props.siteUrl;

    const displayOverlay = (e, itemId) => {
        setShowImagePreview({
            show: true,
            Id: itemId
        });
    }

    const Snap = (props: ISnap) => {
        return (<>
            <div className="img-with-text" style={{ cursor: 'pointer' }} onClick={(e: React.MouseEvent<HTMLDivElement, MouseEvent>) => { displayOverlay(e, props.Id) }}>
                <img src={`${props.File.ServerRelativeUrl}`} style={{
                    maxHeight: '130.5px',
                    height: 'auto'
                }} />
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


    useEffect(() => {
        const getSnapShare = async () => {
            const snaps: ISnap[] = await _spService.getSnaps();
            const snapCarousel = _common.generateCarouselArray(snaps, 6);
            const mobsnapCarousel = _common.generateCarouselArray(snaps, 1);
            setSnapCarousel(snapCarousel);
            setmobSnapCarousel(mobsnapCarousel);
        }
        getSnapShare().catch((error) => {
            setError(error);
        })
    }, []);

    if (error) {
        throw error;
    }

    return (
        <>
            {
                !showImagePreview?.show && snapCarousel.length > 0 && <div className="col-md-12 snap-share-section mt-4 mb-4 stretch-card  desktop">
                    <div className="card snap-share ">
                        <div className="card-body">
                            <div id="carouselExampleCaptions3" className="carousel slide"
                                data-bs-ride="carousel">
                                <div className="d-flex align-items-center justify-content-between flex-wrap card-header snap-share-header px-0">

                                    <h4>Snap Share</h4>
                                    <div className="d-flex align-items-center">
                                        <a href={`${props.siteUrl}/SitePages/Snap and Share.aspx`} className="viewall-link">View All</a>
                                        <div className="p-0 ms-3 position-relative">
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
                </div>
            }

            {
                <div className="col-md-12 snap-share-section mt-4 mb-4 stretch-card mobile">
                <div className="card snap-share ">
                    <div className="card-body">
                        <div id="carouselExampleCaptions4" className="carousel slide"
                            data-bs-ride="carousel">
                            <div className="d-flex align-items-center justify-content-between flex-wrap card-header snap-share-header px-0">

                                <h4>Snap Share</h4>
                                <div className="d-flex align-items-center">
                                    <a href={`${props.siteUrl}/SitePages/Snap and Share.aspx`} className="viewall-link">View All</a>
                                    <div className="p-0 ms-3 position-relative">
                                        <button className="carousel-control-prev" type="button"
                                            data-bs-target="#carouselExampleCaptions4" data-bs-slide="prev">
                                            <span className="carousel-control-prev-icon"
                                                aria-hidden="true"></span>
                                            <span className="visually-hidden">Previous</span>
                                        </button>
                                        <button className="carousel-control-next" type="button"
                                            data-bs-target="#carouselExampleCaptions4" data-bs-slide="next">
                                            <span className="carousel-control-next-icon"
                                                aria-hidden="true"></span>
                                            <span className="visually-hidden">Next</span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                            <div className="carousel-inner pt-9 mt-3">
                                {mobsnapCarousel.map((snapCarouselItem: ISnap, index: number) => <SnapCarousel
                                    index={index}
                                    key={`key${index}`}
                                    snapCarouselItem={snapCarouselItem}
                                ></SnapCarousel>)}
                            </div>
                        </div>
                    </div>
                </div>
                </div>

            }
            {
                showImagePreview?.show && <ImagePreview closePreview={() => {
                    setShowImagePreview({
                        show: false,
                        Id: -1
                    })
                }} snaps={snapCarousel.flat(1)} itemId={showImagePreview.Id} siteUrl={siteUrl}></ImagePreview>
            }
        </>
    );
}