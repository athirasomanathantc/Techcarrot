import *  as React from 'react';
import { useEffect, useState } from 'react';
import { sp } from "@pnp/sp/presets/all";
import ReactHtmlParser from 'react-html-parser';
import * as moment from "moment";
import { IAgiIntranetCompanyPolicyDetailsProps } from '../IAgiIntranetCompanyPolicyDetailsProps';

interface IPolicyDetail extends IAgiIntranetCompanyPolicyDetailsProps {

}

interface IPolicy {

}

export const PolicyDetail = (props: IPolicyDetail): JSX.Element => {
    const [policyDetail, setPolicyDetail] = useState(null);
    const [error, setError] = useState(null);

    const getQueryStringValue = (param: string): number => {
        const params = new URLSearchParams(window.location.search);
        const value = params.get(param) || '';
        return parseInt(value);
    }

    useEffect(() => {
        const getPolicyDetail = async (): Promise<void> => {
            const policyDetail = await sp.web.lists.getByTitle('CompanyPolicies').items
                .getById(getQueryStringValue('policyId'))
                .select("Id,Title,AttachmentFiles,Tags,PolicyType/Title,PublishedDate,PolicyDescription")
                .expand("PolicyType,AttachmentFiles")()
                .then((item: IPolicy) => {
                    return item
                })
                .catch((exception) => {
                    throw new Error(exception);
                });

            setPolicyDetail(policyDetail);
        }
        getPolicyDetail().catch((error) => {
            setError(error);
        })
    }, [])

    if (error) {
        throw error;
    }

    return (<>
        <div className="top-switch">
            <div className="col">
                <p>
                    <svg xmlns="http://www.w3.org/2000/svg" width="17.2" height="17.2" viewBox="0 0 17.2 17.2">
                        <path id="Time" d="M10.6,5.44a.86.86,0,0,0-.86.86v3.77L7.65,11.122a.86.86,0,1,0,.773,1.536l2.564-1.29a.859.859,0,0,0,.474-.768V6.3A.86.86,0,0,0,10.6,5.44ZM10.6,2a8.6,8.6,0,1,0,8.6,8.6A8.6,8.6,0,0,0,10.6,2Zm0,15.48a6.88,6.88,0,1,1,6.88-6.88A6.88,6.88,0,0,1,10.6,17.48Z" transform="translate(-2 -2)" fill="#300b55" />
                    </svg>
                    Published: {moment(policyDetail?.PublishedDate).format("MMMM D, YYYY")}</p>
            </div>
            <div className="col text-end">
                <a className="sec-btn">
                    <svg xmlns="http://www.w3.org/2000/svg" width="23.639" height="21.971" viewBox="0 0 23.639 21.971">
                        <g id="printing" transform="translate(0 -18.065)">
                            <g id="Group_9984" data-name="Group 9984" transform="translate(7.617 35.691)">
                                <g id="Group_9983" data-name="Group 9983">
                                    <path id="Path_81282" data-name="Path 81282" d="M172.594,399.834h-6.829a.788.788,0,0,0,0,1.576h6.829a.788.788,0,0,0,0-1.576Z" transform="translate(-164.977 -399.834)" />
                                </g>
                            </g>
                            <g id="Group_9986" data-name="Group 9986" transform="translate(7.617 33.206)">
                                <g id="Group_9985" data-name="Group 9985" transform="translate(0 0)">
                                    <path id="Path_81283" data-name="Path 81283" d="M172.594,346.006h-6.829a.788.788,0,0,0,0,1.576h6.829a.788.788,0,0,0,0-1.576Z" transform="translate(-164.977 -346.006)" />
                                </g>
                            </g>
                            <g id="Group_9988" data-name="Group 9988" transform="translate(0 18.065)">
                                <g id="Group_9987" data-name="Group 9987" transform="translate(0 0)">
                                    <path id="Path_81284" data-name="Path 81284" d="M21.8,23.413H19.293v-4.56a.788.788,0,0,0-.788-.788H5.134a.788.788,0,0,0-.788.788v4.56H1.839A1.841,1.841,0,0,0,0,25.252v7.927a1.841,1.841,0,0,0,1.839,1.839H4.346v4.23a.788.788,0,0,0,.788.788H18.5a.788.788,0,0,0,.788-.788v-4.23H21.8a1.841,1.841,0,0,0,1.839-1.839V25.252A1.841,1.841,0,0,0,21.8,23.413ZM5.922,19.641h11.8v3.772H5.922Zm11.8,18.819H5.922V32.013h11.8C17.717,32.208,17.717,38.312,17.717,38.46Zm.788-10.419H16.5a.788.788,0,1,1,0-1.576h2.006a.788.788,0,0,1,0,1.576Z" transform="translate(0 -18.065)" />
                                </g>
                            </g>
                        </g>
                    </svg>
                    Print</a>
                <a className="sec-btn" href={`${props.siteUrl}/_layouts/download.aspx?SourceUrl=${props.siteUrl}/Lists/CompanyPolicies/Attachments/${policyDetail?.Id}/${policyDetail?.AttachmentFiles[0]?.FileName}?download=1`}><svg xmlns="http://www.w3.org/2000/svg" width="21.094" height="22.5" viewBox="0 0 21.094 22.5">
                    <g id="download_2_" data-name="download (2)" transform="translate(-16)">
                        <g id="Group_9961" data-name="Group 9961" transform="translate(20.922)">
                            <g id="Group_9960" data-name="Group 9960">
                                <path fill="" id="Path_81277" data-name="Path 81277" d="M139.185,10.256a.7.7,0,0,0-.64-.412h-2.812V.7a.7.7,0,0,0-.7-.7h-2.812a.7.7,0,0,0-.7.7V9.844H128.7a.7.7,0,0,0-.529,1.166l4.922,5.625a.7.7,0,0,0,1.057,0l4.922-5.625A.7.7,0,0,0,139.185,10.256Z" transform="translate(-127.998)" />
                            </g>
                        </g>
                        <g id="Group_9963" data-name="Group 9963" transform="translate(16 15.469)">
                            <g id="Group_9962" data-name="Group 9962">
                                <path fill="" id="Path_81278" data-name="Path 81278" d="M34.281,352v4.219H18.813V352H16v5.625a1.406,1.406,0,0,0,1.406,1.406H35.688a1.4,1.4,0,0,0,1.406-1.406V352Z" transform="translate(-16 -352)" />
                            </g>
                        </g>
                    </g>
                </svg>Download</a>
            </div>
        </div>
        <h3>{policyDetail?.Title}</h3>
        <div className="img-responsive pt-3 pb-3">
            {ReactHtmlParser(policyDetail?.PolicyDescription)}
        </div>
    </>);
}