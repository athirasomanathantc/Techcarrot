import * as React from "react"
import { useEffect, useState } from "react";
import { sp } from "@pnp/sp/presets/all";
import * as moment from "moment";

export const Policies = () => {
    const [error, setError] = useState(null);
    const [policies, setPolicies] = useState([]);
    useEffect(() => {
        const getPolicies = async () => {
            const policies = await sp.web.lists.getByTitle('CompanyPolicies').items
                .select("Id,Title,PolicyType/Title,PublishedDate,PolicyDescription")
                .expand("PolicyType")
                .top(5000)().then((items: [{
                    Id: number,
                    Title: string,
                    PolicyType: string,
                    PublishedDate: string
                }]) => {
                    return items
                })
                .catch((exception) => {
                    throw new Error(exception);
                });
            setPolicies(policies);
        }
        getPolicies().catch((error) => {
            setError(error);
        })
    }, [])

    if (error) {
        throw error;
    }


    return (
        <>
            <div className="tab-content px-0" id="policiesTabContent">
                <div className="tab-pane fade show active" id="general-tab-content" role="tabpanel" aria-labelledby="general-tab">
                    {policies.map((policy: {
                        Id: number,
                        Title: string,
                        PolicyType: string,
                        PublishedDate: string,
                        PolicyDescription: string
                    }) => {
                        return (<>
                            <div className="policy-content-wrapper col-12">
                                <div className="row align-items-center">
                                    <div className="policy-content col-lg-9">
                                        <h4 className="title">{policy.Title}</h4>
                                        <p className="date">Published: {moment(policy.PublishedDate).format("MMMM D, YYYY")}</p>
                                        <p className="description">{policy.PolicyDescription}</p>
                                    </div>

                                    <div className="policy-icon-section col-lg-3 ">
                                        <ul>
                                            <li><a href="policy-detail.html"><i><img src="../Assets/images/icon-pdf-file.svg" alt="" /></i> View</a></li>
                                            <li><a href="#"><i><img src="../Assets/images/icon-download.svg" alt="" /></i>
                                                Download</a></li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </>)
                    })}
                    {
                        !policies.length && <div className="policy-content-wrapper col-12">
                            <div className="row align-items-center">
                                <div className="policy-content col-lg-9">
                                    <h4 className="title">No items found</h4>
                                </div>
                            </div>
                        </div>
                    }
                </div>
            </div>
        </>
    )
}