
import React, { useEffect } from "react";
import { useLocation, useNavigate,useParams } from "react-router-dom";
import { useThemeStore } from "../Store/TeamToggle";
import {useStatusDataStore} from "../Store/StatusDataStore"
import {useQuizStore} from "../Store/QuestionStore.tsx"

const QuizModes: React.FC = () => {

    const { fetchQuestions } = useQuizStore(); // Action to fetch quiz questions
    const { getData, statusData } = useStatusDataStore(); // Fetch status info for quizzes
    
    const location = useLocation(); // React Router location object
    const navigate = useNavigate(); // React Router navigation
    const courseData = location.state?.data; // Extract course data from router state
    const { state } = useLocation(); // Access full location state if needed
    
    const { isDark } = useThemeStore(); // Theme mode (dark/light)
    
    const { CourseCodes } = useParams(); // Get CourseCodes from URL params
    const CourseCode = decodeURIComponent(CourseCodes ?? ""); // Decode URL parameter
    
    // Fetch status data when component mounts
    useEffect(() => {
        const FetchData = async () => {
            await getData(); // Retrieve status info
        };
        FetchData();
    }, []);
    
    // Function to start quiz and navigate to quiz page
    const startTest = (value: boolean, statusData?: number) => {
        navigate(`/Course/StartQuiz/${CourseCode}`, {
            state: {
                callFunction: true,           // Flag to indicate quiz call
                functionParam: value,         // Pass a boolean parameter
                functionStatus: statusData ?? 0, // Optional status data, default 0
                courseData: courseData        // Pass course info
            }
        });
    };
    
    // Fetch quiz questions when component mounts
    useEffect(() => {
        const FetchData = async () => {
            await fetchQuestions(CourseCode, courseData, state); // Pass course info and location state
        };
        FetchData();
    }, []); // Only runs on initial render
    

    return (
        <>
            <div className={` ${isDark ? "HeaderToggle" : ""}`}>
                <div className={`shadow-lg m-sm-5 m-0 p-5 rounded-3  ${isDark ? "HeaderToggle" : ""}`}>
                    <h3 className="text-center">{courseData.ChapterTitle}</h3>
                    <p className="text-center my-4">{courseData.ChapterDescription}</p>
                    <div className="d-flex gap-5 flex-wrap justify-content-center">
                    <div className="d-flex flex-column justify-content-center align-items-center shadow-sm rounded-2 px-5 py-2" style={{ width: "15rem", border: "1px groove #EBE6E6" }}>
                        <p className="fs-3" style={{ color: "#22CA39" }}>10</p>
                        <p className="fs-3">Questions</p>
                    </div>
                    <div className="d-flex flex-column justify-content-center align-items-center shadow-sm rounded-2 px-5 py-2" style={{ width: "15rem", border: "1px outset #EBE6E6" }}>
                        <p className="fs-3" style={{ color: "#22CA39" }}>MCQ</p>
                        <p className="fs-3">Format</p>
                    </div>
                    <div className="d-flex flex-column justify-content-center align-items-center shadow-sm rounded-2 px-5 py-2" style={{ width: "15rem", border: "1px groove #EBE6E6" }}>
                        <p className="fs-3" style={{ color: "#22CA39" }}>Instant</p>
                        <p className="fs-3">Feedback</p>
                    </div>
                    </div>
                    <p className="fs-4 fw-semibold my-5 text-center text-decoration-underline">Choose Quiz Mode:</p>
                    <div className="d-flex gap-4 flex-wrap justify-content-center">
                        <div className="ChooseTestMode d-flex flex-column justify-content-center align-items-center shadow-sm rounded-2 px-2 py-1" style={{ cursor: "pointer", width: "20rem", border: "1px groove #EBE6E6", backgroundColor: "#22CA39" }} onClick={() => startTest(false,statusData)}>
                            <p className="fs-5 fw-demibold">Practice Mode</p>
                            <p className="text-black-50">No time limit, learn at your own pace</p>
                        </div>
                        <div className="ChooseTestMode d-flex flex-column justify-content-center align-items-center shadow-sm rounded-2 px-2 py-1" style={{cursor:"pointer" , width:"20rem" , border:"1px groove #EBE6E6" , backgroundColor:"#fff"}} onClick={() => startTest(true,statusData)}>
                                        <p className="fs-5 fw-demibold">Timed Mode</p>
                                        <p className="text-black-50">3 minutes (3:00)</p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );

};


export default QuizModes;