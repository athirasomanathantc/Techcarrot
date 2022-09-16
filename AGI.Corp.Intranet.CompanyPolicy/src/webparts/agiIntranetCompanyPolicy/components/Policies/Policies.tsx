import * as React from "react"
import { useEffect, useState } from "react";
import { sp } from "@pnp/sp/presets/all";
import * as moment from "moment";
import { IPolicy } from "../../models/IPolicy";
import ReactHtmlParser from 'react-html-parser';
import { IPolicies } from "../../models/IPolicies";

export const Policies = (props: IPolicies): JSX.Element => {
    const [error, setError] = useState(null);

    const getFilteredPolicies = (keyword: string, policies: IPolicy[]): IPolicy[] => policies.filter(
        (policy: IPolicy) => {
            return (
                policy.Title?.toLowerCase().includes(keyword.trim().toLowerCase()) ||
                policy.PolicyDescription?.toLowerCase().includes(keyword.trim().toLowerCase()) ||
                policy.Tags?.toLowerCase().includes(keyword.trim().toLowerCase())
            );
        }
    );

    const goToDetails = (policyId: number): void => {
        window.location.href = `${props.siteUrl}/SitePages/Policies/Policy%20Detail.aspx?policyId=${policyId}`;
    }

    const downloadAttachment = (policy: IPolicy): void => {
        window.location.href = `${props.siteUrl}/_layouts/download.aspx?SourceUrl=${props.siteUrl}/Lists/CompanyPolicies/Attachments/${policy.Id}/${policy.AttachmentFiles[0]?.FileName}&download=1`;
    }

    useEffect(() => {
        const getPolicies = async (policyType: string): Promise<void> => {
            let policies = await sp.web.lists.getByTitle('CompanyPolicies').items
                .select("Id,Title,AttachmentFiles,Tags,PolicyType/Title,PublishedDate,PolicyDescription")
                .filter(`PolicyType/Title eq '${policyType}'`)
                .expand("PolicyType,AttachmentFiles")
                .top(5000)().then((items: IPolicy[]) => {
                    return items
                })
                .catch((exception) => {
                    throw new Error(exception);
                });
            policies = getFilteredPolicies(props.keyword, policies)
            props.setPolicies(policies);
        }
        getPolicies(props.policyType).catch((error) => {
            setError(error);
        })
    }, [props.policyType, props.keyword])

    if (error) {
        throw error;
    }


    return (
        <>
            <div className="tab-content px-0" id="policiesTabContent">
                <div className="tab-pane fade show active" id="general-tab-content" role="tabpanel" aria-labelledby="general-tab">
                    {props.policies.map((policy: IPolicy) => {
                        return (<>
                            <div className="policy-content-wrapper col-12 mt-3">
                                <div className="row">
                                    <div className="policy-content col-lg-9">
                                        <h4 className="title">{policy.Title}</h4>
                                        <p className="date">Published: {moment(policy.PublishedDate).format("MMMM D, YYYY")}</p>
                                        <p className="description">{ReactHtmlParser(policy.PolicyDescription)}</p>
                                    </div>

                                    <div className="policy-icon-section col-lg-3 ">
                                        <ul>
                                            <li>
                                                <div onClick={() => goToDetails(policy.Id)}>
                                                    <i>
                                                        <img src={`${props.siteUrl}/Assets/images/icon-pdf-file.svg`} alt="" />
                                                    </i>
                                                    View
                                                </div>
                                            </li>
                                            {policy.AttachmentFiles.length > 0 && <li>
                                                <div onClick={() => { downloadAttachment(policy) }}>
                                                    <i>
                                                        <img src={`${props.siteUrl}/Assets/images/icon-download.svg`} alt="" />
                                                    </i>
                                                    Download
                                                </div>
                                            </li>}
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </>)
                    })}
                    {
                        !props.policies.length && <div className="policy-content-wrapper col-12 mt-3">
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