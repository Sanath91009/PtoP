import React, { useState } from "react";
import { Button } from "react-bootstrap";
import { propTypes } from "react-bootstrap/esm/Image";

export const SubjectTab = (props) => {
    
    
    const defaultAnswers = [false, false, false, false];
    const [checkedArr, setCheckedArr] = useState(defaultAnswers);
    const [currentQueston, setCurrentQuestion] = useState(0);
    const [finalAnswers, setFinalAnswers] = useState(defaultFinalAnswers);
    
    const handeAnswerOptionClick = (event, answerIndex) => {
        let newAnswers = defaultAnswers;
        newAnswers[answerIndex] = event.currentTarget.checked;
        setCheckedArr(newAnswers);
    };

    const onNext = () => {

        setCurrentQuestion((currentQueston + 1) % props.questions.length);
    }

    const onPrev = () => {
        setCurrentQuestion((currentQueston - 1) % props.questions.length);
    }
    

    const questions = props.questions;
    const questionElement = questions[currentQueston].options.map((option, index) => {
        <div key={index}>
            <ToggleButton
                vairant='light'
                type='checkbox'
                checked={checkedArr[index]}
                onChange={(event) => handeAnswerOptionClick(event, answerIndex)}
            >
                option
            </ToggleButton>
        </div>
    });

    return (
        <div>
            <div className = 'question-section'>
                <div className = 'question-count'>
                    Question <span>{ currentQueston+1 }</span> / {questions.length}
                </div>
                <div className = 'question-text'>
                    {questions[currentQueston].questionDesc}
                </div>
            </div>
            <div>
                <div className='answer-section'>
                    <ButtonGroup>
                    {
                        questionElement
                    }
                    </ButtonGroup>
                </div>
            </div>
        </div>
    );
}