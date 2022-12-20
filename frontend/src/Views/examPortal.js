import React from "react";
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import config from "../config.json";
import Countdown from "react-countdown";
import { useNavigate } from "react-router-dom";
export const ExamPortal = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { eventID, username, section } = location.state;

    const [answers, setAnswers] = useState([]);
    const [questions, setQuestions] = useState({});
    const [subjects, setSubjects] = useState([]);
    useEffect(() => {
        const endpoint = `${config.apiUrl}/events/getQuestions?examId=${eventID}`;
        fetch(endpoint, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        })
            .then((reponse) => reponse.json())
            .then((data) => {
                const quest = data.data.questions;
                const questions_temp = {};
                console.log(quest);
                const answers_temp = [];
                for (let i = 0; i < quest.length; i++) {
                    if (questions_temp[quest[i].subjectType] === undefined) {
                        questions_temp[quest[i].subjectType] = [];
                    }
                    questions_temp[quest[i].subjectType].push({
                        questionDesc: quest[i].questionDesc,
                        options: quest[i].options,
                        id: quest[i]._id,
                        Qnumber: i,
                    });
                    let temp = [];
                    for (let j = 0; j < quest[i].options.length; j++) {
                        temp.push(false);
                    }
                    answers_temp.push(temp);
                }
                setAnswers(answers_temp);
                setQuestions(questions_temp);
                const subjects_temp = Object.keys(questions_temp);
                setSubjects(subjects_temp);
            });
    }, []);
    const HandleChangeInput = (e, Qnumber, optionIndex) => {
        console.log("input changed : ", e.target.value);
        const answers_temp = [...answers];
        for (let i = 0; i < answers_temp[Qnumber].length; i++)
            answers_temp[Qnumber][i] = false;
        answers_temp[Qnumber][optionIndex] = true;
        setAnswers(answers_temp);
    };
    const onSubmit = () => {
        const endpoint = config.apiUrl + "/events/calculateScore";
        fetch(endpoint, {
            method: "post",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                username: username,
                examId: eventID,
                answers: answers,
                section: section,
            }),
        })
            .then((response) => response.json())
            .then((data) => {
                navigate("/event/results", {
                    state: {
                        username: username,
                        section: section,
                        eventID: eventID,
                        subScores: data.score,
                    },
                    replace: true,
                });
            });
    };
    if (subjects === []) return <div>Loading...</div>;
    console.log("answers : ", answers);
    return (
        <div>
            <div className="p-3 text-end">
                <button className="btn btn-danger mx-2">
                    <Countdown
                        date={Date.now() + 6000000}
                        intervalDelay={0}
                        precision={3}
                        onComplete={() => onSubmit()}
                    />
                </button>
                <button className="btn btn-dark" onClick={() => onSubmit()}>
                    Submit
                </button>
            </div>
            <nav className="mx-3">
                <div className="nav nav-tabs" id="nav-tab" role="tablist">
                    {subjects.map((subject, index) => {
                        return (
                            <button
                                key={index}
                                className={
                                    index == 0 ? "nav-link active" : "nav-link"
                                }
                                id={`nav-${subject}-tab`}
                                data-bs-toggle="tab"
                                data-bs-target={`#nav-${subject}`}
                                type="button"
                                role="tab"
                                aria-controls={`nav-${subject}`}
                                aria-selected="true"
                            >
                                {subject}
                            </button>
                        );
                    })}
                </div>
            </nav>
            <div className="tab-content mx-3" id="nav-tabContent">
                {subjects.map((subject, index) => {
                    return (
                        <div
                            className={
                                index == 0
                                    ? "tab-pane fade show active"
                                    : "tab-pane fade "
                            }
                            id={`nav-${subject}`}
                            role="tabpanel"
                            key={index}
                            aria-labelledby={`nav-${subject}-tab`}
                        >
                            {questions[subject] &&
                                questions[subject].map((question, index1) => {
                                    console.log(questions[subject], subject);
                                    return (
                                        <div className="card w-75">
                                            <div className="card-header">
                                                <p>{question.questionDesc}</p>
                                            </div>
                                            <div className="card-body">
                                                <ul className="list-group list-group-flush">
                                                    {question["options"] &&
                                                        question["options"].map(
                                                            (
                                                                option,
                                                                index2
                                                            ) => {
                                                                return (
                                                                    <li
                                                                        className="list-group-item"
                                                                        key={
                                                                            index2
                                                                        }
                                                                    >
                                                                        <input
                                                                            className="m-2"
                                                                            name={`${index}${index1}`}
                                                                            type="radio"
                                                                            id={
                                                                                index2
                                                                            }
                                                                            onChange={(
                                                                                e
                                                                            ) =>
                                                                                HandleChangeInput(
                                                                                    e,
                                                                                    question.Qnumber,
                                                                                    index2
                                                                                )
                                                                            }
                                                                            value={
                                                                                index2
                                                                            }
                                                                        ></input>
                                                                        <label
                                                                            for={
                                                                                index2
                                                                            }
                                                                        >
                                                                            {
                                                                                option
                                                                            }
                                                                        </label>
                                                                    </li>
                                                                );
                                                            }
                                                        )}
                                                </ul>
                                            </div>
                                        </div>
                                    );
                                })}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};
