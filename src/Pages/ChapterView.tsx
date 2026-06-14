

import React, { useEffect } from "react";
import { useParams ,useLocation, useNavigate } from "react-router-dom";
import CourseDetail from "../components/CourseDetail";
import type { Chapter } from "../types/Course.ts";
import Loader1 from "../components/ui/Loader1.tsx";
import RateLimitWarning from "../components/ui/TimeLimit.tsx";
import { useThemeStore } from "../Store/TeamToggle.tsx";
import { useChapterStore } from "../Store/ChapterStore.tsx";
import {useStatusDataStore} from "../Store/StatusDataStore.tsx"
import {useQuizStore} from "../Store/QuestionStore.tsx"
  
const ChapterView: React.FC = () => {   

  const { fetchQuestions } = useQuizStore();

    const { getData, statusData } = useStatusDataStore(); // Status data store
    const navigate = useNavigate(); // React Router navigation hook 
    
    // Function to start a quiz/test
    // `value` is a boolean flag, `statusData` is a number representing some status
    const startTest = (value: boolean, statusData: number) => {
      navigate(`/Course/StartQuiz/${CourseCode}`, {
        state: {
          callFunction: true,       // flag to indicate a function call
          functionParam: value,     // parameter to pass to the function
          courseData: chapterData,   // course-specific data
          functionStatus: statusData, // current status of the course/quiz
        }
      });
    };
    
    // Fetch status data when component mounts
    useEffect(() => {
      const FetchData = async () => {
        await getData();
      };
      FetchData();
    }, []); // Empty dependency array → runs only once on mount
    
    const location = useLocation(); // Access current route/location state
    const { CourseCodes } = useParams(); // Get URL param
    const CourseCode = decodeURIComponent(CourseCodes ?? ""); // Decode URI component
    
    const { ChapterData, loading, isRateLimited, fetchChaptersByCourse } = useChapterStore(); // Chapter store
        
    const CourseData = location.state?.courseData; // Course data passed via state
    const chapterData = location.state?.ChapterData; // Course data passed via state

    useEffect(() => {
      const fetchData = async () => {
        if (CourseCode) {
          await fetchChaptersByCourse(CourseCode);
        }
      }
      fetchData()
    }, [CourseCode, fetchChaptersByCourse]);

    useEffect(() => {
      const  fetch = async () => {
        await fetchQuestions(CourseCode, chapterData);
      }
      fetch()
    },[CourseCode,chapterData,fetchQuestions])
    
    const { isDark } = useThemeStore(); // Theme mode (dark/light)
    
    // Navigate to quiz modes page for the current course
    const GoTOQuiz = () => {
      navigate(`/Course/QuizModes/${CourseCode}`, { state: { data: chapterData } });
    };

    return (

        <>

            <h2 className={` ${isDark ? "text-white-50" : "text-black-50" }`} style={{marginLeft:"60px"}}>Courses: <span>{CourseData.CourseTitle}</span></h2>
            <div className={` ${isDark ? "HeaderToggle" : ""}`}>
              <div className={`shadow-sm p-4 mx-xl-5 mx-lg-3 mx-sm-2 mx-0 my-4 ${isDark ? "HeaderToggle" : ""}`}>
                  <h2 className="d-flex gap-3"><img src="/public/stack-of-books.png" alt="icon" width={54} height={54}/><span>{CourseData.CourseTitle}</span></h2>
                  <div className="" style={{marginLeft:"80px"}}>
                      <p>{CourseData.CourseDescription}</p>
                      <div className="row gap-2">
                          <div className="col d-flex flex-nowrap gap-2"><p>{ChapterData.length}</p><p>Chapters</p></div>
                          <div className="col d-flex flex-nowrap gap-2"><p>100</p><p>Questions</p></div>
                          <div className="col d-flex flex-nowrap gap-2"><p>100</p><p>Questions</p></div>
                      </div>
                  </div>
              </div>
              </div>
 
            <div className="row gap-3 mx-xl-5 mx-lg-3 mx-sm-2 mx-0"  >

               <div className="chapterList col-12 col-lg-8 col-sm-12 my-4" style={{boxSizing:"border-box"}}> 

                    {loading ? (
                        <Loader1 />
                    ) : isRateLimited ? (
                        <RateLimitWarning />
                    ) : ChapterData.length > 0 ? (
                        ChapterData.map((chapter: Chapter) => (
                        <div key={chapter._id}>
                          <div className={`${isDark ? "HeaderToggle" : ""}`}>
                            <CourseDetail data={chapter} />
                            </div>
                        </div>
                        ))
                    ) : (
                        <p className="text-muted d-flex justify-content-center align-items-center gap-2"  style={{height:"65vh",fontSize:"xx-large"}}><span className="text-danger fw-bold fs-2">No chapters </span> available for this course.</p>
                    )}
                </div>

                <div className={`col-12 col-lg-3 col-sm-12 d-flex flex-column gap-4 mb-4 ${isDark ? "HeaderToggle" : ""}`}>
                    <div className={`d-flex flex-column gap-2 shadow-sm p-3 mb-3 ${isDark ? "HeaderToggle" : ""}`} >
                        <p>Quick Actions</p>
                        <button className=" rounded-1 p-2 rounded-1 text-white border-0" style={{backgroundColor:"#179227"}} onClick={GoTOQuiz}>Start First Chapter</button>
                        <button className="rounded-1 p-2 rounded-1 bg-white"  style={{borderColor:" #EBE6E6"}} onClick={() => startTest(true,statusData)}>Time Mode</button>
                        <button className="rounded-1 p-2 rounded-1 bg-white"  style={{borderColor:" #EBE6E6"}} onClick={() => startTest(false,statusData)}>Practice Mode</button>
                    </div>
                    <div className={`col shadow-sm p-3 ${isDark ? "HeaderToggle" : ""}`}style={{maxHeight:"250px"}}>
                        <p className="fw-bold fs-4">Course Statistics</p>
                        <div className="d-flex justify-content-between"><p>Available Chapters:</p><p className="text-muted">{ChapterData.length}</p></div>
                        <div className="d-flex justify-content-between"><p>Total Chapters:</p><p className="text-muted">{CourseData.TotalChapter}</p></div>
                    </div>
                </div>
            </div>

        </>

    );
};

 
export default ChapterView;