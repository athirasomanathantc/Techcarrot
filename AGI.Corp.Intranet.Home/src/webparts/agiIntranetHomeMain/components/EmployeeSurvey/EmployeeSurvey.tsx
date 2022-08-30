import * as React from "react";
import { IAgiIntranetHomeMainProps } from "../IAgiIntranetHomeMainProps";

export const EmployeeSurvey = (props: IAgiIntranetHomeMainProps) => {
    return (<div className="col-md-12 mt-4 mb-4 mb-md-0">
        <div className="card h-100">
            <div className="card-header d-flex align-items-center justify-content-between" data-bs-target="#survey" data-bs-toggle="collapse">
                <h4 className="card-title mb-0">Employee Survey</h4>
                <div className="d-md-none " >
                    <div className="float-right navbar-toggler d-md-none">
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18">
                            <g id="Dropdown-Logo" transform="translate(-84 -7.544)">
                                <path id="Path_73662" data-name="Path 73662" d="M15.739,7.87,8.525.656,7.868,0,0,7.87" transform="translate(100.366 20.883) rotate(180)" fill="none" stroke="#dccede" stroke-width="1.5" />
                                <rect id="Rectangle_7537" data-name="Rectangle 7537" width="18" height="18" transform="translate(84 7.544)" fill="none" />
                            </g>
                        </svg>
                    </div>
                </div>
            </div>

            <div className="collapse dont-collapse-sm" id="survey">
                <div className="card-body">

                    <div id="qbox-container">
                        <form className="needs-validation" id="form-wrapper" method="post" name="form-wrapper">
                            <div id="steps-container">
                                <div className="step d-block">
                                    <h4>How long have you been working with Al Ghurair?</h4>
                                    <div className="form-check ps-0 q-box">

                                        <div className="q-box__question">
                                            <input type="radio" checked id="q_1" name="survey-questions" />
                                            <label>1 - 3 years</label>
                                        </div>

                                        <div className="q-box__question">
                                            <input type="radio" id="q_2" name="survey-questions" />
                                            <label>3 - 6 years</label>
                                        </div>

                                        <div className="q-box__question">
                                            <input type="radio" id="q_3" name="survey-questions" />
                                            <label>6 - 9 years</label>
                                        </div>

                                        <div className="q-box__question">
                                            <input type="radio" id="q_4" name="survey-questions" />
                                            <label>More than 10 years</label>
                                        </div>
                                    </div>
                                </div>

                                <div className="step">
                                    <h4>2.How long have you been working with Al Ghurair?</h4>
                                    <div className="form-check ps-0 q-box">
                                        <div className="q-box__question">
                                            <input type="radio" id="q_5" name="survey-questions" />
                                            <label>1 - 3 years</label>
                                        </div>

                                        <div className="q-box__question">
                                            <input type="radio" id="q_6" name="survey-questions" />
                                            <label>3 - 6 years</label>
                                        </div>

                                        <div className="q-box__question">
                                            <input type="radio" id="q_7" name="survey-questions" />
                                            <label>6 - 9 years</label>
                                        </div>

                                        <div className="q-box__question">
                                            <input type="radio" id="q_8" name="survey-questions" />
                                            <label>More than 10 years</label>
                                        </div>
                                    </div>
                                </div>

                                <div className="step">
                                    <h4>3.How long have you been working with Al Ghurair?</h4>
                                    <div className="form-check ps-0 q-box">
                                        <div className="q-box__question">
                                            <input type="radio" id="q_9" name="survey-questions" />
                                            <label>1 - 3 years</label>
                                        </div>

                                        <div className="q-box__question">
                                            <input type="radio" id="q_10" name="survey-questions" />
                                            <label>3 - 6 years</label>
                                        </div>

                                        <div className="q-box__question">
                                            <input type="radio" id="q_11" name="survey-questions" />
                                            <label>6 - 9 years</label>
                                        </div>

                                        <div className="q-box__question">
                                            <input type="radio" id="q_12" name="survey-questions" />
                                            <label>More than 10 years</label>
                                        </div>
                                    </div>
                                </div>
                                {/* <div id="success">
                  <div className="mt-5">
                    <h4>Success! We'll get back to you ASAP!</h4>
                    <p>Meanwhile, clean your hands often, use soap and water, or an alcohol-based hand rub, maintain a safe distance from anyone who is coughing or sneezing and always wear a mask when physical distancing is not possible.</p>
                    <a className="back-link" href="">Go back from the beginning ➜</a>
                  </div>
                </div> */}

                            </div>
                            <div id="q-box__buttons">
                                <button id="prev-btn" type="button" className="d-none">
                                    <i><svg id="Group_8057" data-name="Group 8057" xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 30 30">
                                        <g id="Ellipse_76" data-name="Ellipse 76" fill="rgba(157,14,113,0.05)" stroke="rgba(112,112,112,0.04)" stroke-width="1">
                                            <circle cx="15" cy="15" r="15" stroke="none" />
                                            <circle cx="15" cy="15" r="14.5" fill="none" />
                                        </g>
                                        <path id="Path_73923" data-name="Path 73923" d="M30.211,13.153a.56.56,0,1,1,.768.814l-4.605,4.35,4.605,4.35a.56.56,0,1,1-.768.814l-5.036-4.756a.56.56,0,0,1,0-.814l5.036-4.756Z" transform="translate(-13.155 -3)" fill="#9d0e71" />
                                    </svg>
                                    </i>
                                    Previous

                                </button>
                                <button id="next-btn" type="button" className="d-inline-block">Next
                                    <i><svg id="Group_8056" data-name="Group 8056" xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 30 30">
                                        <g id="Ellipse_76" data-name="Ellipse 76" fill="rgba(157,14,113,0.05)" stroke="rgba(112,112,112,0.04)" stroke-width="1">
                                            <circle cx="15" cy="15" r="15" stroke="none" />
                                            <circle cx="15" cy="15" r="14.5" fill="none" />
                                        </g>
                                        <path id="Path_73923" data-name="Path 73923" d="M25.944,13.153a.56.56,0,1,0-.768.814l4.605,4.35-4.605,4.35a.56.56,0,1,0,.768.814l5.036-4.756a.56.56,0,0,0,0-.814l-5.036-4.756Z" transform="translate(-13 -3)" fill="#9d0e71" />
                                    </svg></i>
                                </button>
                                <button id="submit-btn" type="submit" className="d-none">Submit</button>
                            </div>
                        </form>
                    </div>


                </div>
            </div>
        </div>
    </div>
    );
}