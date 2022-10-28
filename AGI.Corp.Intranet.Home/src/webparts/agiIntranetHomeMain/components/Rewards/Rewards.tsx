import * as React from "react";
import { useEffect, useState } from "react";
import { IConfigItem } from "../../models/IConfigItem";
import { IReward } from "../../models/IReward";
import { IRewardsComponent } from "../../models/IRewardsComponent";
import SPService from "../../services/SPService";

let siteUrl: string = '';

const RewardCarousel = (props: IReward) => {
    let imageUrl = JSON.parse(props.OfferImage);
    imageUrl = imageUrl?.serverUrl + imageUrl?.serverRelativeUrl;
    return (<>
        <div className={`carousel-item ${!props.index ? 'active' : ''}`}>
            <img src={`${imageUrl}`} className="d-block w-100 rewards-image" alt="..." />
            <div className={`carousel-caption overlay`}>
                <p>{props.Description}</p>
                <div className="offer-btn-container"><a href={`${siteUrl}/SitePages/Rewards/Reward%20Details.aspx?rewardID=${props.Id}&env=WebView`} className="btn btn-lg btn-view-offer">View Rewards</a></div>
            </div>
        </div>
    </>)
}

export const Rewards = (props: IRewardsComponent) => {
    const [error, setError] = useState(null);
    const [rewardsCarousel, setRewardsCarousel] = useState([]);
    const _spService = new SPService(props);
    siteUrl = props.siteUrl;
    const configItem: IConfigItem = props.configItems.filter((configItem) => configItem.Title === 'Rewards Title' && configItem.Section === 'Home')[0];

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
        {rewardsCarousel.length > 0 && !configItem?.Hide && <div className="col-xs-12 col-sm-6 col-xl-6   employee-offer-section mb-4 mb-md-0">

            <div className="card h-100">
                <div data-bs-target="#employeeOffer" data-bs-toggle="collapse">
                    <div className="card-header d-flex align-items-center justify-content-between" >
                        <h4 className="card-title mb-0">{configItem?.Detail}</h4>
                        <div className="d-md-none me-0 ms-auto"><div className="float-right navbar-toggler d-md-none"><svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18"><g id="Dropdown-Logo" transform="translate(-84 -7.544)"><path id="Path_73662" data-name="Path 73662" d="M15.739,7.87,8.525.656,7.868,0,0,7.87" transform="translate(100.366 20.883) rotate(180)" fill="none" stroke="#dccede" stroke-width="1.5"></path><rect id="Rectangle_7537" data-name="Rectangle 7537" width="18" height="18" transform="translate(84 7.544)" fill="none"></rect></g></svg></div></div>
                        <div className="d-flex align-items-center">
                            <a href={`${props.siteUrl}/SitePages/Rewards.aspx?env=WebView`} className="viewall-link d-none d-md-block">View All</a>
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
                    <div className="text-center mt-0 mb-3"><a href={`${props.siteUrl}/SitePages/Rewards.aspx?env=WebView`} className="viewall-link  d-md-none">View All</a></div>
                </div>
            </div>
        </div>}
    </>);
}