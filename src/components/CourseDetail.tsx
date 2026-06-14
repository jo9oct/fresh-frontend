

import React,{useEffect} from "react";
import type { Chapter } from "../types/Course.ts";
import { useNavigate,useParams } from 'react-router-dom'; 
import { useThemeStore } from "../Store/TeamToggle.tsx";  
import api from "../lib/axios.tsx"
import type { views } from "../types/View.ts";

type ChapterCardsProps = {
  data: Chapter;
};

const CourseDetail: React.FC<ChapterCardsProps> = ({data}) => {
   
    const navigate = useNavigate(); // React Router hook to programmatically navigate
    const { isDark } = useThemeStore(); // Access theme (dark/light mode)
    const { CourseCodes } = useParams(); // Get CourseCodes from the route params
    const CourseCode = decodeURIComponent(CourseCodes ?? ""); // Decode URL param safely
    
    // Function to navigate to the Quiz page with the course data
    const GoTOQuiz = () => {
        navigate(`/Course/QuizModes/${CourseCode}`, { state: { data: data } });
    };
    
    // Effect to post a view for this course when component mounts
    useEffect(() => {
        const PostData = async () => {
            try {
                await api.put<views>("/view", {
                    CourseCode: CourseCode, // Send the current course code
                    TotalCourseView: true,  // Mark as viewed
                });
            } catch (error) {
                console.error("❌ Error posting view:", error); // Log API errors
            }
        };
    
        PostData(); // Call the async function once on mount
    }, []); // Empty dependency array ensures this runs only once
    
    
    return (
        
        <>
            
            <ul className= {`shadow-lg rounded-2 ${isDark ? "HeaderToggle" : ""}`}style={{boxSizing:"border-box"}}>
                <li className="col row p-3">
                    <h3 className="mb-3">Chapter {data.ChapterNumber}: {data.ChapterTitle}</h3>
                    <div className="d-flex justify-content-between mb-3 gap-2 flex-wrap">
                        <p >{data.ChapterDescription}</p>
                        <button className=" rounded-3 d-flex flex-nowrap justify-content-center align-items-center px-4 pt-2" style={{maxHeight:"50px" , borderColor:"#179227"}}><p>1</p><p>Questions</p> </button>
                    </div>
                    <div className="d-flex gap-3 flex-sm-row flex-column">
                        <button className="p-2 w-100 w-sm-50 rounded-1 text-white border-0" style={{backgroundColor:"#179227"}} onClick={() => navigate(`/courses`)}>View course</button>
                        <button className="p-2 w-100 w-sm-50 rounded-1 bg-white" style={{borderColor:"1px solid #EBE6E6"}} onClick={GoTOQuiz}>Quick Start Quiz</button>
                    </div>
                </li>
            </ul>

        </>

    );
};


export default CourseDetail;

