import * as React from "react";
import { useEffect, useState } from "react";
import { IConfigItem } from "../../models/IConfigItem";
import { IQuizComponent } from "../../models/IQuizComponent";
import { IQuizOption } from "../../models/IQuizOptions";
import { IQuizQuestion } from "../../models/IQuizQuestion ";
import SPService from "../../services/SPService";

let siteUrl: string = '';
let initialQuestion = null;

export const Quiz = (props: IQuizComponent) => {
    console.log("entered quiz");

    const [error, setError] = useState(null);
    const [quiz, setQuiz] = useState({
        currentQuestion: {
            options: [],
            question: null
        },
        questions: [],
        options: [],
        responses: [],
        scores: 0,
        submitted: false,
    });
    const [showResult, setShowResult] = useState(false);
    const [retest, setRetest] = useState(false);
    const [next, setNext] = useState(false);

    const userEmail = props.context.pageContext.legacyPageContext.userEmail;
    const userId = props.context.pageContext.legacyPageContext.userId;

    const _spService = new SPService(props);
    siteUrl = props.siteUrl;
    const { currentQuestion, questions, submitted } = quiz;
    const configItem: IConfigItem = props.configItems.filter((configItem) => configItem.Title === 'Employee Quiz Title' && configItem.Section === 'Home')[0];

    useEffect(() => {
        // const func2 = async () => { _spService.checkSubmitted(props.context.pageContext.legacyPageContext.userEmail) };
        // let submit:boolean= await _spService.checkSubmitted(props.context.pageContext.legacyPageContext.userEmail);
        const getQuizDetails = async () => {
            // let submit = await func2();

            let submit: boolean = await _spService.checkSubmitted(userEmail);
            let questions: IQuizQuestion[] = await _spService.getQuizQuestions();
            let options: IQuizOption[] = await _spService.getQuizOptions();

            if (questions.length > 0) {
                initialQuestion = {
                    ...quiz,
                    currentQuestion: {
                        question: questions[0],
                        options: options.filter((option: IQuizOption) => option.Question.Id === questions[0].Id)
                    },
                    questions: questions,
                    options: options,
                    responses: questions.map((question) => {
                        return {
                            Title: question.Title,
                            QuestionId: question.Id,
                            UserEmail: userEmail,
                            UserId: userId,
                            OptionId: ''
                        }

                    }),
                    submitted: submit
                }
                setQuiz(initialQuestion);

                console.log('reset', retest);
            }

        }
        getQuizDetails().catch((error) => {
            setError(error);
        })
    }, [])

    useEffect(() => {
        const getQuizCalc = async () => {
            const { options, submitted, } = quiz;

            if (submitted) {

                let givenAns = await _spService.getData(userEmail, quiz.questions.length);
                console.log('Given ans', givenAns);
                //debugger;
                let score = await _spService.CalculateScore(givenAns, quiz.options);

                console.log("score after reload", score);
                setQuiz({
                    ...quiz,
                    scores: score,
                    submitted: submitted
                });
                if (!retest && submitted)
                    setShowResult(true);
            }
            console.log('submitted', quiz.submitted);

        }
        getQuizCalc().catch((error) => {
            setError(error);
        })
    }, [quiz.options.length])

    const moveNext = (index: number) => {
        setQuiz({
            ...quiz,
            currentQuestion: {
                question: quiz.questions[index],
                options: quiz.options.filter((option: IQuizOption) => option.Question.Id === quiz.questions[index].Id)
            }
        });
        console.log(quiz.responses[index].OptionId);
        quiz.responses.map((item) => {

            if (item.QuestionId == quiz.questions[index].Id) {
                console.log('Response', item)
                if (item.OptionId != '') {


                    setNext(true);

                } else {
                    setNext(false);

                }


            }
        })

    }

    const movePrev = (index: number) => {
        setQuiz({
            ...quiz,
            currentQuestion: {
                question: quiz.questions[index],
                options: quiz.options.filter((option: IQuizOption) => option.Question.Id === quiz.questions[index].Id)
            }

        });

        quiz.responses.map((item) => {

            if (item.QuestionId == quiz.questions[index].Id && item.OptionId != '') {
                console.log('Response', item)

                setNext(true);

            }
        })
    }

    const onChange = (e: React.ChangeEvent<HTMLInputElement>, quizOption: IQuizOption) => {
        const { question } = quiz.currentQuestion;

        const responses = quiz.responses.map((quizResponse) => {
            if (quizResponse.QuestionId === question.Id) {
                return { ...quizResponse, Option: quizOption.Title, OptionId: quizOption.Id }
            }
            return quizResponse;
        });

        const options = quiz.options.map((option) => {
            if (option.Question.Id === question.Id) {
                return { ...option, Checked: (option.Id === quizOption.Id) }
            }
            return option;
        });
        setNext(true);


        setQuiz({
            ...quiz,
            responses,
            options,
            //scores:quiz.scores,
            currentQuestion: {
                ...quiz.currentQuestion,
                options: options.filter((option: IQuizOption) => option.Question.Id === question.Id)
            }
        })

    }

    const onSubmit = async () => {
        // e.preventDefault();
        let score = await _spService.CalculateScore(quiz.responses, quiz.options);
        // debugger;
        // quiz.responses.map((response) => {
        //     const ans: IQuizOption[] = quiz.options.filter((option: IQuizOption) => {
        //         if (option.Question.Id === response.QuestionId && option.CorrectOption == true) {
        //             return option;
        //         }

        //     })
        //     if (response.OptionId == ans[0].Id) {
        //         score++;
        //     }

        // })
        setQuiz({
            ...quiz,
            scores: score
        })
        // console.log('score:', quiz.scores);

        // console.log('quiz', quiz);
        // debugger;
        const quizSubmitted = await _spService.submitQuiz(quiz);
        if (quizSubmitted) {
            setQuiz({
                ...quiz,
                submitted: true,
                scores: score
            });
            setShowResult(true);
            setRetest(false);
        }
    }

    if (error) {
        throw error;
    }
    const onRetest = async () => {



        setShowResult(false);
        setRetest(true);
        initialQuestion = {
            ...initialQuestion,
            submitted: true
        }
        setQuiz(initialQuestion);


    }

    return (<>
        {questions.length > 0 && !configItem?.Hide && <div className="col-md-12 mt-4 mb-4 mb-md-0">
            <div className="card h-100">
                <div className="card-header d-flex align-items-center justify-content-between"
                    data-bs-target="#quiz" data-bs-toggle="collapse">
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

                <div className="collapse dont-collapse-sm" id="quiz">
                    <div className="card-body">

                        <div id="qbox-container">
                            <form className="needs-validation" id="form-wrapper" method="post"
                                name="form-wrapper" >
                                <div id="steps-container">
                                    {(!quiz.submitted || retest) && <div className="step d-block">
                                        <h4>{quiz.currentQuestion.question.Title}</h4>
                                        <div className="form-check ps-0 q-box">
                                            {
                                                quiz.currentQuestion.options.map((option, index) => {
                                                    return (
                                                        <div className="q-box__question" key={`key${index}`}>
                                                            <input type="radio" checked={option.Checked} onChange={(e) => onChange(e, option)} id={`q_${index}`}
                                                                name="survey-questions" />
                                                            <label htmlFor={`q_${index}`}>{option.Title}</label>
                                                        </div>

                                                    )
                                                })
                                            }
                                        </div>
                                    </div>}

                                    {showResult && <div id="success">
                                        <div className="mt-5">
                                            <h4>You have submitted your response!</h4>
                                            <h3>Your score is: {quiz.scores}/{quiz.responses.length}</h3>
                                        </div>
                                    </div>}

                                </div>
                                <div id="q-box__buttons">
                                    {(!quiz.submitted || retest) && <>
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
                                        {next && <button id="next-btn" type="button" className={questions.length === currentQuestion.question.SortOrder ? 'd-none' : 'd-inline-block'} onClick={() => moveNext(currentQuestion.question.SortOrder)}>Next
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
                                        </button>}
                                        <a href="javascript:void(0)" id="submit-btn" className={(questions.length === currentQuestion.question.SortOrder) && (quiz.responses[questions.length - 1].OptionId != '') ? 'btn btn-lg btn-gradient ms-3' : 'd-none '} onClick={() => onSubmit()}>Submit</a>
                                    </>}
                                </div>
                                <div id="q-box__button" className="retest">
                                    {(!retest && quiz.submitted) && <a href="javascript:void(0)" id="submit-btn" type="button" className={submitted ? 'btn btn-lg btn-gradient ms-3' : "d-none"} onClick={() => onRetest()}>Retest</a>}
                                </div>

                                {/* <img src={`${props.siteUrl}/assets/images/quiz-icon.svg`} />
                                <h5>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</h5>
                                <a className="btn btn-lg btn-gradient">Start Quiz</a> */}
                            </form>
                        </div>


                    </div>
                </div>
            </div>
        </div>}
    </>);
}