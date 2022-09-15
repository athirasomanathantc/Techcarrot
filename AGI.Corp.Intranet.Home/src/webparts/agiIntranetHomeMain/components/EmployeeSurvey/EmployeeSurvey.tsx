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
                            <img src={`${props.siteUrl}/assets/images/survey-icon.svg`}/>
                            <h5>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</h5>
                            <a className="btn btn-lg btn-gradient">Start Survey</a>
                        </div>


                    </div>
                </div>
            </div>
        </div>}
    </>);
}