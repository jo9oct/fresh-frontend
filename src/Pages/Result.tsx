import React from "react";
import Loader1 from "../components/ui/Loader1";
import type { allQuestions, TestResult } from "../types/Question";
import { useLocation, useNavigate } from "react-router-dom";
import { useThemeStore } from "../Store/TeamToggle";
import  type{Chapter} from "../types/Course"

type LocationState = {
  answers: TestResult[];
  questionData: allQuestions[];
  CourseCode: String;
  data: Chapter;
};

const Result: React.FC = () => {

    const { isDark } = useThemeStore();
    const navigate = useNavigate();
    const { state } = useLocation();

    // Safely cast the state
    const { data,CourseCode,answers, questionData } = state as LocationState;

    // Early loading check
    if (!answers || !questionData || !questionData[0]?.Questions?.length) {
        return <Loader1 />;
    }

    const questions = questionData[0].Questions;
    const correctAnswers = answers.filter((a) => a.isCorrect).length;
    const scorePercentage = Math.round((correctAnswers / answers.length) * 100) || 0;
    const answeredQuestions = answers.map((a) => a.questionId);

    const resetQuiz = () => {
        navigate(`/Course/QuizModes/${CourseCode}`, {
            state: { data: data },
          });
    };

    const team = scorePercentage > 50

    return (

        <>
            <div className="shadow m-md-5 m-sm-3 m-0 rounded-5 p-1 p-md-5 p-sm-3">
                <p className="text-center fs-3 fw-semibold">Quiz Complete!</p>
                <p  className="text-center fs-4" style={{
                    color: team ? "green" : "red"
                 }}>{scorePercentage}%</p>
                <p className="text-center fs-4" style={{ color: "#22CA39" }}>
                    {scorePercentage < 50 ? (
                    <span className="text-danger">Fail</span>
                    ) : (
                    <span className="text-success">Pass</span>
                    )}
                </p>
                <p className="text-center text-black-50 mb-5">
                    You got {correctAnswers} out of {questions.length} questions correct
                </p>

                <p className="fs-5 mb-4">Review Your Answers:</p>

                {questions
                    .filter((question) => answeredQuestions.includes(question.id))
                    .map((question, index) => {
                    const userAnswer = answers.find((a) => a.questionId === question.id);
                    const isCorrect = userAnswer?.isCorrect;
                    return (
                        <div
                        key={index}
                        className="rounded-4 mb-4"
                        style={{
                            border: isCorrect ? "5px solid #0c8a0ce0" : "5px solid #ce0e0ecd",
                            padding: "15px 40px",
                        }}
                        >
                        <p className={` ${isDark ? "color-white" : "text-black-50"}`}>Question {index + 1}</p>
                        <p>{question.question}</p>
                        <div
                            className="d-flex gap-3 rounded-2 align-items-center mb-3"
                            style={{
                            border: "1px solid #124164",
                            paddingLeft: "30px",
                            backgroundColor: isCorrect ? "#59f86e59" : "#d3707059",
                            }}
                        >
                            <i>{isCorrect ? "✔️" : "❌"}</i>
                            <p className="pt-3">
                            {question.options[userAnswer?.selectedAnswer ?? 0]}
                            </p>
                        </div>
                        <p>
                            <span className="fw-bold">Correct Answer:</span> {question.correctAnswer}
                        </p>
                        <p>
                            <span className="fw-bold">Explanation:</span> {question.explanation}
                        </p>
                        </div>
                    );
                    })}

                <div className="mt-5 d-flex flex-wrap justify-content-center gap-5 mb-5">
                    <button
                    className="px-5 py-2 btn rounded-2 text-white"
                    style={{ width: "300px", backgroundColor: "#1FC735" }}
                    onClick={resetQuiz}
                    >
                    Retake Quiz
                    </button>
                    <div className={`${isDark ? "HeaderToggle" : ""}`}>
                        <button
                        className={`px-5 py-2 btn rounded-2 text-white ${isDark ? "HeaderToggle" : ""}`}
                        style={{ width: "300px", backgroundColor: "#041826b9" }}
                        onClick={() => navigate("/courses")}
                        >
                        Back To Course
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Result;
