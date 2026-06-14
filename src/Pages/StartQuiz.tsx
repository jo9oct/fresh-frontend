
import React, { useState, useEffect } from "react";
import Loader1 from "../components/ui/Loader1.tsx";
import RateLimitWarning from "../components/ui/TimeLimit.tsx";
import { useLocation, useNavigate,useParams } from "react-router-dom";
import { useThemeStore } from "../Store/TeamToggle.tsx";
import { useQuizStore } from "../Store/QuestionStore.tsx";
import {useAuthStore} from "../Store/authStore.ts"
import {useStatusDataStore} from "../Store/StatusDataStore.tsx"

const StartQuiz: React.FC = () => {

    const {updateData} = useStatusDataStore()
    const { user } = useAuthStore();
    const navigate = useNavigate();
    
    const { isDark } = useThemeStore();
    
    const {CourseCodes} = useParams()
    const CourseCode = decodeURIComponent(CourseCodes ?? "");
    
    const { state } = useLocation();
    const CourseData = state?.courseData ?? {};
    
    const [popUpUpdate, setPopUpUpdate] = useState<Boolean>(false);
    const [amount, setAmount] = useState<any>()
    const [timeLeft, setTimeLeft] = useState(0);
    const [Status, setStatus] = useState<boolean>(true);
    const [EndIndex, setEndIndex] = useState<number>(0);
    const [totalQuestion, setTotalQuestion] = useState<number>(0)
    const [timeLefts, setTimeLefts] = useState<number>(0)
    const [statusDatas, setStatusDatas] = useState<number>(0)
    const users = user?.username || ""
    
    const {
        currentQuestionIndex,
        selectedAnswer,
        answers,
        isRateLimited,
        questionData,
        loading,
        Length,
        fetchQuestions,
        setCurrentQuestionIndex,
        setSelectedAnswer,
        setAnswers,
    } = useQuizStore();
    
    useEffect(() => {
        const fetch = async () => {
            await fetchQuestions(CourseCode, CourseData, state); // fetch all quiz questions on component mount
        }
        fetch()
    }, [CourseCode, CourseData]);
    
    useEffect(() => {
        setTimeLeft(timeLefts); // update countdown timer whenever total allowed time changes
    }, [timeLefts]);
    
    const handleAmountChange =  (e: React.ChangeEvent<HTMLInputElement>) => {
        setAmount(e.target.value); // update number of questions to attempt
    };
    
    const ClothPopUp = () => {
        if(Status){
            TotalTimeAmount(amount) // calculate total quiz time based on selected questions
        }
        setPopUpUpdate(false) // close the popup
    }
    
    const PostStatusData = async () => {
        await updateData(users, CourseCode.replace(/\s+/g, "") + "Chapter" + CourseData.ChapterNumber, currentQuestionIndex) // save current progress to backend
    }
    
    useEffect(() => {
        if (state?.callFunction && typeof state.functionParam === "boolean" && state.functionStatus >= 0) {
            startTest(state.functionParam,state.functionStatus); // auto-start quiz if redirected with state
        }
    }, [state]);
    
    const TotalTimeAmount = (amount: number) => {
        const matched = questionData[0];
        if (!matched?.Questions) return 0;
    
        if (state?.callFunction && typeof state.functionParam === "boolean") {
            let value
            if(users !== ""){
                value = statusDatas
                localStorage.setItem(CourseCode.replace(/\s+/g, "") + "Chapter" + CourseData.ChapterNumber, String(statusDatas)); // save user progress locally
            } else {
                value = Number(localStorage.getItem(CourseCode + "Chapter" + CourseData.ChapterNumber)) || 0;
            }
    
            const incomingStatus = state.functionParam;
            if (!incomingStatus) return 0;
    
            const totalQuestions = matched.Questions.length;
            const start = value;
            const end = Number(start) + Number(amount); // compute end index of questions slice
            const amounts = totalQuestions - start
            
            let selected: typeof matched.Questions = [];
    
            if (end <= totalQuestions) {
                selected = matched.Questions.slice(start, end); // normal case: slice questions normally
            } else {
                const firstPart = matched.Questions.slice(start, totalQuestions);
                const secondPart = matched.Questions.slice(0, amount - amounts );
                selected = [...firstPart, ...secondPart]; // wrap-around: pick remaining from start
            }
    
            const total = selected.reduce((sum, q) => {
                const time = Number(q.allowedTime) || 0;
                return sum + time; // sum total allowed time
            }, 0);
            setTimeLefts(total)
        }
    
        return 0;
    };
    
    // startTest initializes quiz state
    const startTest = async (status: boolean, statusData: number) => {
        setStatus(status);
        if (!status) setTimeLeft(0); // reset timer if quiz not started
        const totalQuestions = questionData[0].Questions.length || Length;
        setStatusDatas(statusData)
        setTotalQuestion(totalQuestions)
        if(totalQuestions >= 5  ){
            setPopUpUpdate(true) // open the popup
        }
    
        if(users !== ""){
            setCurrentQuestionIndex(statusData);
            localStorage.setItem(CourseCode.replace(/\s+/g, "") + "Chapter" + CourseData.ChapterNumber, String(statusData)); // save index
        } else {
            const value = Number(localStorage.getItem(CourseCode.replace(/\s+/g, "") + "Chapter" + CourseData.ChapterNumber)) || 0;
            setCurrentQuestionIndex(value);
        }
        setSelectedAnswer(null);
        setAnswers([]);
        setEndIndex(0);
    };
    
    // countdown timer effect
    useEffect(() => {
        let interval: number;
        if (timeLeft > 0) {
            interval = setInterval(() => {
                setTimeLeft(prev => {
                    if (prev <= 1) { // when time is up
                        navigate("/Course/Result", { // redirect to result page
                            state: {
                                answers: answers,
                                questionData: questionData,
                                CourseCode: CourseCode,
                                CourseData: CourseData
                            },
                        });
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
        }
    
        return () => { if (interval) clearInterval(interval); }; // clear interval on unmount
    }, [timeLeft]);
    
    const formatTime = (seconds: number): string => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`; // format seconds as mm:ss
    }
    
    // load previously selected answer for current question
    useEffect(() => {
        const savedAnswer = answers.find((a) => questionData[0]?.Questions[currentQuestionIndex]?.id === a.questionId);
        setSelectedAnswer(savedAnswer ? savedAnswer.selectedAnswer : null);
    }, [currentQuestionIndex, answers, questionData]);
    
    // handle moving to next question
    const handleNextQuestion = () => {
        const question = questionData[0].Questions[currentQuestionIndex];
        const totalQuestions = questionData[0].Questions.length;
        setTotalQuestion(totalQuestions)
    
        if (selectedAnswer !== null) {
            const isCorrect = question.options[selectedAnswer] === question.correctAnswer;
            const newAnswer = { questionId: question.id, selectedAnswer, isCorrect };
    
            const updatedAnswers = (() => {
                const existingIndex = answers.findIndex((a) => a.questionId === question.id);
                if (existingIndex >= 0) {
                    const clone = [...answers];
                    clone[existingIndex] = newAnswer; // update existing answer
                    return clone;
                } else {
                    return [...answers, newAnswer]; // add new answer
                }
            })();
    
            setAnswers(updatedAnswers);
            setEndIndex((prev) => prev + 1); // increment EndIndex
    
            // navigate to result if last question reached
            if (totalQuestion < amount) {
                if (EndIndex === totalQuestion - 1) {
                    if(users !== "") PostStatusData();
                    navigate("/Course/Result", { state: { answers: updatedAnswers, questionData, CourseCode, data: CourseData } });
                }
            } else if (EndIndex === amount - 1) {
                if(users !== "") PostStatusData();
                navigate("/Course/Result", { state: { answers: updatedAnswers, questionData, CourseCode, data: CourseData } });
            } else if (Number(currentQuestionIndex) === Number(totalQuestions) - 1) {
                const nextIndex = 0; // wrap-around to first question
                setCurrentQuestionIndex(nextIndex);
                localStorage.setItem(CourseCode.replace(/\s+/g, "") + "Chapter" + CourseData.ChapterNumber, String(nextIndex));
            } else {
                const nextIndex = 1 + Number(currentQuestionIndex);
                setCurrentQuestionIndex(nextIndex);
                localStorage.setItem(CourseCode.replace(/\s+/g, "") + "Chapter" + CourseData.ChapterNumber, String(nextIndex));
            }
    
            setSelectedAnswer(null);
        }
    };
    
    // handle moving to previous question
    const handlePreviousQuestion = () => {
        if (EndIndex > 0) {
            setEndIndex((prev) => Math.max(prev - 1, 0));
    
            if(currentQuestionIndex <= 0){
                const prevIndex = totalQuestion - 1; // wrap-around to last question
                setCurrentQuestionIndex(prevIndex);
                localStorage.setItem(CourseCode.replace(/\s+/g, "") + "Chapter" + CourseData.ChapterNumber, String(prevIndex));
            } else {
                const prevIndex = currentQuestionIndex - 1;
                setCurrentQuestionIndex(prevIndex);
                localStorage.setItem(CourseCode.replace(/\s+/g, "") + "Chapter" + CourseData.ChapterNumber, String(prevIndex));
            }
        }
    };

    // double check the question length
    if (loading) {
        return <Loader1 />; // show loader while fetching quiz data
    }
    
    if (!questionData || !questionData[0]?.Questions?.length) {
        return (
            <div
                className={`d-flex justify-content-center align-items-center gap-2 ${isDark ? "text-white-50" : "text-muted"}`}
                style={{ height: "65vh", fontSize: "xx-large" }}
            >
                <span className="text-danger fw-bold fs-2"> No Questions</span> available. 
                {/* display message if no questions are available */}
            </div>
        );
    }
    
    const Q = questionData[0].Questions[currentQuestionIndex];
    if (!Q) {
        return (
            <div
                className={`d-flex justify-content-center align-items-center gap-2 ${isDark ? "text-white-50" : "text-muted"}`}
                style={{ height: "65vh", fontSize: "xx-large" }}
            >
                <span className="text-danger fw-bold fs-2"> No Questions</span> available.
                {/* safeguard in case currentQuestionIndex points to undefined */}
            </div>
        );
    }
    
    const progress = Math.round(((EndIndex + 1) / amount) * 100); // calculate quiz progress percentage
    const timeDown = timeLeft <= 30; // flag for warning when 30 seconds or less remain
    

    return (
        <>
            
            <>
                <div className="shadow p-4 rounded-3" style={{ border: "1px solid #CDC6C6", margin: "30px 70px" }}>
                        {Status && <div className="d-flex justify-content-center align-items-center gap-3" >
                            <img src="/public/clock.png" alt="icon" width={"25px"} height={"25px"} />
                            <p className="fw-bold fs-4 " style={{marginTop:"15px" , color: timeDown ? "red" : "green"}}>{formatTime(timeLeft)}</p>
                        </div>}
                <div className="d-flex justify-content-between">
                    <p>Question {EndIndex + 1} of {amount}</p>
                    <p>{progress}% Complete</p>
                </div>
                <div  style={{ backgroundColor: "#EBE6E6", height: "5px", width: `100%` }}>
                    <div className="d-flex justify-content-center align-item-center " style={{ transition:"all 1s" , backgroundColor: "#179227", height: "5px", width: `${progress}%` }}>{progress}%</div>
                </div>
                </div>
                
                {loading ? (<Loader1 />) :
                isRateLimited ? (<RateLimitWarning />) :
                questionData[0].Questions.length > 4 ? (
                <div className={`shadow p-4 ${isDark ? "HeaderToggle" : ""}`} style={{ margin: "30px 70px" }}>
                    <div className={`p-5 ${isDark ? "HeaderToggle" : ""}`}>
                        <p>{Q.question}</p>
                        <ul className={`list-group`}>
                            {Q.options.map((option, index) => (
                            <li key={index} className={`list-group-item mb-3 ${isDark ? "HeaderToggle" : ""}`}>
                                <input
                                className="form-check-input me-1 " 
                                type="radio"
                                style={{ accentColor: "#179227" , cursor:"pointer" }}
                                name="listGroupRadio"
                                value={index}
                                id={`optionRadio${index}`}
                                checked={selectedAnswer === index}
                                onChange={() => setSelectedAnswer(index)}
                                />
                                <label className="form-check-label" htmlFor={`optionRadio${index}`}>{option}</label>
                            </li>
                            ))}
                        </ul>
                        
                        <div className="d-flex justify-content-around">
                            <button className="px-4 py-2 rounded-2 border-0" style={{ backgroundColor: "#EBE6E6" }} onClick={handlePreviousQuestion} disabled={EndIndex <= 0}>
                            Previous
                            </button>
                            <button className="px-4 py-2 rounded-2 border-0" style={{ backgroundColor: "#1fb633b4" }} onClick={handleNextQuestion} disabled={selectedAnswer === null}>
                            {EndIndex === amount - 1 ? "Submit" : "Next"}
                            </button>
                        </div>
                    </div>
                </div>
                  ):(
                    <div className="text-muted d-flex justify-content-center align-items-center gap-2"  style={{height:"65vh",fontSize:"xx-large"}}>
                      <span  className="text-danger fw-bold fs-2"> No Questions</span> <span style={{color:"white"}}>available.</span>
                    </div>
                  )}
            </>
      
            {popUpUpdate && 
            <div
                className="toast show position-fixed top-50 start-50"
                role="alert"
                aria-live="assertive"
                aria-atomic="true"
                style={{ 
                zIndex: 9999, 
                transform: "translate(-50%, -50%)",
                minWidth: "300px" 
                }}
            >
                <div className="toast-body">
                <div className="mb-3">
                    <label className="fw-bold mb-3 text-black">
                        How many questions do you want to do?
                    </label>
                    <div className="d-flex flex-column text-center">
                        <label className="fw-bold mb-3 text-black">
                            minimum question : 5
                        </label>
                        <label className="fw-bold mb-3 text-black">
                            maximum question : {totalQuestion}
                        </label>
                    </div>
                    <input
                    type="number"
                    name="amount"
                    className="form-control rounded-pill bg-light"
                    style={{ color: "black" }}
                    placeholder="Enter number of questions"
                    value={amount}
                    onChange={handleAmountChange}
                    max={totalQuestion}
                    min={5}
                    />
                </div>

                <div className="d-flex justify-content-end gap-2">
                    <button 
                    className="btn btn-danger btn-sm bg-danger text-white" 
                    onClick={() => ClothPopUp()}
                    disabled={!Number(amount) || amount <= 4 || amount > totalQuestion}  
                    style={{cursor:"pointer"}}
                    >
                    OK
                    </button>
                </div>
                </div>
            </div>
            }

    </>
    );
}


export default StartQuiz;
 
