import * as React from "react";
import { useEffect, useState } from "react";
import { IReward } from "../../models/IReward";
import SPService from "../../services/SPService";
import { IAgiIntranetHomeMainProps } from "../IAgiIntranetHomeMainProps";

let siteUrl: string = '';

const RewardCarousel = (props: IReward) => {
    let imageUrl = JSON.parse(props.OfferImage);
    imageUrl = imageUrl?.serverUrl + imageUrl?.serverRelativeUrl;
    return (<>
        <div className={`carousel-item ${!props.index ? 'active' : ''}`}>
            <img src={`${imageUrl}`} className="d-block w-100 rewards-image" alt="..." />
            <div className={`carousel-caption overlay`}>
                <p>{props.Description}</p>
                <div className="offer-btn-container"><a href={`./Reward%20Details.aspx?rewardID=${props.Id}`} className="btn btn-lg btn-view-offer">View Offer</a></div>
            </div>
        </div>
    </>)
}

export const Rewards = (props: IAgiIntranetHomeMainProps) => {
    const [error, setError] = useState(null);
    const [rewardsCarousel, setRewardsCarousel] = useState([]);
    const _spService = new SPService(props);
    siteUrl = props.siteUrl;
    useEffect(() => {
        const getLatestNews = async () => {
            let rewardsCarousel: IReward[] = await _spService.getRewards();
            setRewardsCarousel(rewardsCarousel);
        }
        getLatestNews().catch((error) => {
            setError(error);
        })
    }, [])

    if (error) {
        throw error;
    }

    return (<>
        {rewardsCarousel.length > 0 && <div className="col-xs-12 col-sm-6 col-xl-6   employee-offer-section mb-4 mb-md-0">

            <div className="card h-100">
                <div data-bs-target="#employeeOffer" data-bs-toggle="collapse">
                    <div className="card-header d-flex align-items-center justify-content-between" >
                        <h4 className="card-title mb-0">Rewards</h4>
                        <div className="d-flex align-items-center">
                            <a href={`${props.siteUrl}/SitePages/Rewards.aspx`} className="viewall-link d-none d-md-block">View All</a>
                            <div className="p-0 ms-3 position-relative d-none d-md-block">
                                <button className="carousel-control-prev" type="button"
                                    data-bs-target="#employeeOffersControls"
                                    data-bs-slide="prev">
                                    <span className="carousel-control-prev-icon"
                                        aria-hidden="true"></span>
                                    <span className="visually-hidden">Previous</span>
                                </button>
                                <button className="carousel-control-next" type="button"
                                    data-bs-target="#employeeOffersControls"
                                    data-bs-slide="next">
                                    <span className="carousel-control-next-icon"
                                        aria-hidden="true"></span>
                                    <span className="visually-hidden">Next</span>
                                </button>
                            </div>
                        </div>
                    </div>

                </div>


                <div className="collapse dont-collapse-sm" id="employeeOffer">
                    <div className="card-body">

                        <div id="employeeOffersControls" className="carousel slide" data-bs-ride="carousel">
                            <div className="carousel-inner">
                                {rewardsCarousel.map((rewardsCarouselItem: IReward, index: number) => <RewardCarousel
                                    index={index}
                                    key={`key${index}`}
                                    {...rewardsCarouselItem}></RewardCarousel>)}
                            </div>
                            <div className="d-md-none button-bottom">
                                <button className="carousel-control-prev" type="button" data-bs-target="#employeeOffersControls" data-bs-slide="prev">
                                    <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                                    <span className="visually-hidden">Previous</span>
                                </button>
                                <button className="carousel-control-next" type="button" data-bs-target="#employeeOffersControls" data-bs-slide="next">
                                    <span className="carousel-control-next-icon" aria-hidden="true"></span>
                                    <span className="visually-hidden">Next</span>
                                </button>
                            </div>
                        </div>



                    </div>
                    <div className="text-center mt-0 mb-3"><a href="#" className="viewall-link  d-md-none">View All</a></div>
                </div>
            </div>
        </div>}
    </>);
}