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
        options: [],
        responses: [],
        submitted: false
    });
    const _spService = new SPService(props);
    siteUrl = props.siteUrl;
    const { currentQuestion, questions, submitted } = survey;

    useEffect(() => {
        const getLatestNews = async () => {
            let questions: ISurveyQuestion[] = await _spService.getSurveyQuestions();
            let options: ISurveyOption[] = await _spService.getSurveyOptions();
            if (questions.length > 0) {
                setSurvey({
                    ...survey,
                    currentQuestion: {
                        question: questions[0],
                        options: options.filter((option: ISurveyOption) => option.Question.Id === questions[0].Id)
                    },
                    questions: questions,
                    options: options,
                    responses: questions.map((question) => {
                        return {
                            Title: question.Title,
                            QuestionId: question.Id,
                            UserEmail: props.context.pageContext.legacyPageContext.userEmail,
                            UserId: props.context.pageContext.legacyPageContext.userId
                        }
                    })
                });
            }
        }
        getLatestNews().catch((error) => {
            setError(error);
        })
    }, [])

    const moveNext = (index: number) => {
        setSurvey({
            ...survey,
            currentQuestion: {
                question: survey.questions[index],
                options: survey.options.filter((option: ISurveyOption) => option.Question.Id === survey.questions[index].Id)
            }
        });
    }

    const movePrev = (index: number) => {
        setSurvey({
            ...survey,
            currentQuestion: {
                question: survey.questions[index],
                options: survey.options.filter((option: ISurveyOption) => option.Question.Id === survey.questions[index].Id)
            }
        });
    }

    const onChange = (e: React.ChangeEvent<HTMLInputElement>, surveyOption: ISurveyOption) => {
        const { question } = survey.currentQuestion;

        const responses = survey.responses.map((surveyResponse) => {
            if (surveyResponse.QuestionId === question.Id) {
                return { ...surveyResponse, Option: surveyOption.Title, OptionId: surveyOption.Id }
            }
            return surveyResponse;
        });

        const options = survey.options.map((option) => {
            if (option.Question.Id === question.Id) {
                return { ...option, Checked: (option.Id === surveyOption.Id) }
            }
            return option;
        });

        setSurvey({
            ...survey,
            responses,
            options,
            currentQuestion: {
                ...survey.currentQuestion,
                options: options.filter((option: ISurveyOption) => option.Question.Id === question.Id)
            }
        })
    }

    const onSubmit = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.preventDefault();
        setSurvey({
            ...survey,
            submitted: true
        });
    }

    if (error) {
        throw error;
    }

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
                                    {!submitted && <div className="step d-block">
                                        <h4>{currentQuestion.question.Title}</h4>
                                        <div className="form-check ps-0 q-box">

                                            {currentQuestion.options.map((option: ISurveyOption, index: number) => {
                                                return (<>
                                                    <div className="q-box__question">
                                                        <input type="radio" id={`q_${index}`}
                                                            name="survey-questions" checked={option.Checked} onChange={(e) => onChange(e, option)} />
                                                        <label htmlFor={`q_${index}`}>{option.Title}</label>
                                                    </div>
                                                </>)
                                            })}

                                        </div>
                                    </div>}

                                    {submitted && <div id="success">
                                        <div className="mt-5">
                                            <h4>You have submitted your response!</h4>
                                        </div>
                                    </div>}

                                </div>
                                {!submitted && <div id="q-box__buttons">
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
                                        className={questions.length === currentQuestion.question.SortOrder ? '' : 'd-none'} onClick={(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => onSubmit(e)}>Submit</button>
                                </div>}
                            </form>}
                        </div>


                    </div>
                </div>
            </div>
        </div>}
    </>);
}