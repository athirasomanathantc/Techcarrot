import * as React from "react";
import { useEffect, useState } from "react";
import { ISurveyOption } from "../../models/ISurveyOption";
import { ISurveyQuestion } from "../../models/ISurveyQuestion";
import SPService from "../../services/SPService";
import { IAgiIntranetHomeMainProps } from "../IAgiIntranetHomeMainProps";

let siteUrl: string = '';

export const EmployeeSurvey = (props: IAgiIntranetHomeMainProps) => {

    const [error, setError] = useState(null);
    const [survey, setSurvey] = useState({
        currentQuestion: {
            options: [],
            question: null
        },
        questions: [],
        options: []
    });
    const _spService = new SPService(props);
    siteUrl = props.siteUrl;
    useEffect(() => {
        const getLatestNews = async () => {
            let questions: ISurveyQuestion[] = await _spService.getSurveyQuestions();
            let options: ISurveyOption[] = await _spService.getSurveyOptions();
            setSurvey({
                ...survey,
                currentQuestion: {
                    ...currentQuestion,
                    options
                }
            });

            if (questions.length > 0) {
                setSurvey({
                    currentQuestion: {
                        question: questions[0],
                        options: options.filter((option: ISurveyOption) => option.Question.Id === questions[0].Id)
                    },
                    questions: questions,
                    options: options
                });
            }
        }
        getLatestNews().catch((error) => {
            setError(error);
        })
    }, [])

    const moveNext = (index: number) => {
        setSurvey({
            currentQuestion: {
                question: survey.questions[index],
                options: survey.options.filter((option: ISurveyOption) => option.Question.Id === survey.questions[index].Id)
            },
            questions: survey.questions,
            options: survey.options
        });
    }

    const movePrev = (index: number) => {
        setSurvey({
            currentQuestion: {
                question: survey.questions[index],
                options: survey.options.filter((option: ISurveyOption) => option.Question.Id === survey.questions[index].Id)
            },
            questions: survey.questions,
            options: survey.options
        });
    }

    const onSubmit = () => {

    }

    if (error) {
        throw error;
    }

    const { currentQuestion, questions } = survey;

    return (<>
        {questions.length > 0 && <div className="col-md-12 mt-4 mb-4 mb-md-0">
            <div className="card h-100">
                <div className="card-header d-flex align-items-center justify-content-between"
                    data-bs-target="#survey" data-bs-toggle="collapse">
                    <h4 className="card-title mb-0">Employee Survey</h4>
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

                        <div id="qbox-container">
                            {currentQuestion.question && <form className="needs-validation" id="form-wrapper" method="post"
                                name="form-wrapper">
                                <div id="steps-container">
                                    <div className="step d-block">
                                        <h4>{currentQuestion.question.Title}</h4>
                                        <div className="form-check ps-0 q-box">

                                            {currentQuestion.options.map((option: ISurveyOption) => {
                                                return (<>
                                                    <div className="q-box__question">
                                                        <input type="radio" checked id="q_1"
                                                            name="survey-questions" />
                                                        <label htmlFor="q_1">{option.Title}</label>
                                                    </div>
                                                </>)
                                            })}

                                        </div>
                                    </div>

                                    <div id="success">
                                        <div className="mt-5">
                                            <h4>Success! We'll get back to you ASAP!</h4>
                                            <p>Meanwhile, clean your hands often, use soap and
                                                water, or an alcohol-based hand rub, maintain a safe
                                                distance from anyone who is coughing or sneezing and
                                                always wear a mask when physical distancing is not
                                                possible.</p>
                                            <a className="back-link" href="">Go back from the beginning
                                                ➜</a>
                                        </div>
                                    </div>

                                </div>
                                <div id="q-box__buttons">
                                    <button id="prev-btn" type="button" className={currentQuestion.question.SortOrder === 1 ? 'd-none' : ''} onClick={() => movePrev(currentQuestion.question.SortOrder - 2)}>
                                        <i><svg id="Group_8057" data-name="Group 8057"
                                            xmlns="http://www.w3.org/2000/svg" width="30"
                                            height="30" viewBox="0 0 30 30">
                                            <g id="Ellipse_76" data-name="Ellipse 76"
                                                fill="rgba(157,14,113,0.05)"
                                                stroke="rgba(112,112,112,0.04)"
                                                stroke-width="1">
                                                <circle cx="15" cy="15" r="15" stroke="none" />
                                                <circle cx="15" cy="15" r="14.5" fill="none" />
                                            </g>
                                            <path id="Path_73923" data-name="Path 73923"
                                                d="M30.211,13.153a.56.56,0,1,1,.768.814l-4.605,4.35,4.605,4.35a.56.56,0,1,1-.768.814l-5.036-4.756a.56.56,0,0,1,0-.814l5.036-4.756Z"
                                                transform="translate(-13.155 -3)"
                                                fill="#9d0e71" />
                                        </svg>
                                        </i>
                                        Previous

                                    </button>
                                    <button id="next-btn" type="button" className={questions.length === currentQuestion.question.SortOrder ? 'd-none' : 'd-inline-block'} onClick={() => moveNext(currentQuestion.question.SortOrder)}>Next
                                        <i><svg id="Group_8056" data-name="Group 8056"
                                            xmlns="http://www.w3.org/2000/svg" width="30"
                                            height="30" viewBox="0 0 30 30">
                                            <g id="Ellipse_76" data-name="Ellipse 76"
                                                fill="rgba(157,14,113,0.05)"
                                                stroke="rgba(112,112,112,0.04)"
                                                stroke-width="1">
                                                <circle cx="15" cy="15" r="15" stroke="none" />
                                                <circle cx="15" cy="15" r="14.5" fill="none" />
                                            </g>
                                            <path id="Path_73923" data-name="Path 73923"
                                                d="M25.944,13.153a.56.56,0,1,0-.768.814l4.605,4.35-4.605,4.35a.56.56,0,1,0,.768.814l5.036-4.756a.56.56,0,0,0,0-.814l-5.036-4.756Z"
                                                transform="translate(-13 -3)" fill="#9d0e71" />
                                        </svg></i>
                                    </button>
                                    <button id="submit-btn" type="submit"
                                        className={questions.length === currentQuestion.question.SortOrder ? '' : 'd-none'} onClick={() => onSubmit()}>Submit</button>
                                </div>
                            </form>}
                        </div>


                    </div>
                </div>
            </div>
        </div>}
    </>);
}