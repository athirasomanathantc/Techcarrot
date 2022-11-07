import * as React from "react";
import { useEffect, useState } from "react";
import { IConfigItem } from "../../models/IConfigItem";
import { IEmployeeSurveyComponent } from "../../models/IEmployeeSurveyComponent";
import SPService from "../../services/SPService";

let siteUrl: string = '';

export const EmployeeSurvey = (props: IEmployeeSurveyComponent) => {

    const [error, setError] = useState(null);
    const [surveyItem, setSurveyItem] = useState(null);
    const _spService = new SPService(props);
    const configItem: IConfigItem = props.configItems.filter((configItem) => configItem.Title === 'Employee Survey Title' && configItem.Section === 'Home')[0];

    useEffect(() => {
        const getConfigItem = async () => {
            let configItems: IConfigItem[] = await _spService.getConfigItems();
            const _surveyItems = configItems.filter((item) => item.Title == 'Employee Survey Content');
            setSurveyItem(_surveyItems[0]);
        }
        getConfigItem().catch((error) => {
            setError(error);
        })
    }, [])

    if (error) {
        throw error;
    }

    return (<>
        {surveyItem && !configItem?.Hide && <div className="col-md-12 mt-4 mb-4 mb-md-0">
            <div className="card h-100">
                <div className="card-header d-flex align-items-center justify-content-between"
                    data-bs-target="#survey" data-bs-toggle="collapse">
                    <h4 className="card-title mb-0">{configItem?.Detail}</h4>
                    <div className="d-md-none ">
                        <div className="float-right navbar-toggler d-md-none">
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18"
                                viewBox="0 0 18 18">
                                <g id="Dropdown-Logo" transform="translate(-84 -7.544)">
                                    <path id="Path_73662" data-name="Path 73662"
                                        d="M15.739,7.87,8.525.656,7.868,0,0,7.87"
                                        transform="translate(100.366 20.883) rotate(180)"
                                        fill="none" stroke="#dccede" stroke-width="1.5" />
                                    <rect id="Rectangle_7537" data-name="Rectangle 7537" width="18"
                                        height="18" transform="translate(84 7.544)" fill="none" />
                                </g>
                            </svg>
                        </div>
                    </div>
                </div>
                <div className="collapse dont-collapse-sm" id="survey">
                    <div className="card-body">
                        <div id="qbox-container" className="text-center">
                            <img src={`${props.siteUrl}/assets/images/survey-icon.svg`} />
                            <h5>{surveyItem.Detail}</h5>
                            <a href={surveyItem.Link} className="btn btn-lg btn-gradient">Start Survey</a>
                        </div>
                    </div>
                </div>
            </div>
        </div>}
    </>);
}