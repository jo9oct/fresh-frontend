
import React,{useState,useEffect} from "react";
import {Link, useNavigate} from  "react-router-dom"
import type { course,Chapter,Course } from "../types/Course";
import api from "../lib/axios.tsx"
import toast from "react-hot-toast";
import { useThemeStore } from "../Store/TeamToggle.tsx";

type CourseCardsProps = {
  data: course;
};

const CourseCards: React.FC<CourseCardsProps> = ({data}) => {
    

  const { isDark } = useThemeStore(); // Access theme state (dark/light mode)
  const navigate = useNavigate(); // React Router hook for navigation
  
  const [ChapterData, setChapterData] = useState<Chapter[]>([]); // Store chapters for the course
  const chapterData = ChapterData[0]; // Take the first chapter (if any)
  
  let matchedCourse; // Will hold the course that matches the current CourseCode
  
  // Function to navigate to the quiz page
  const GoTOQuiz = () => {
    if (chapterData) {
      // Navigate to QuizModes page with the first chapter data as state
      navigate(`/Course/QuizModes/${data.CourseCode}`, {
        state: { data: chapterData },
      });
    } else {
      // Show error if no chapter is available
      toast.error("No Chapter Available For This Course");
    }
  };
  
  // Fetch chapter data when component mounts or CourseCode changes
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Get all chapters from the API
        const res = await api.get<Course[]>("/chapter");
        const Chapter = res.data;
  
        // Find the course that matches the current CourseCode
        matchedCourse = Chapter.find(
          (course) => course.CourseCode === data.CourseCode
        );
  
        if (matchedCourse) {
          // Set chapters for this course
          setChapterData(matchedCourse.Chapters);
        } else {
          console.log("No course found with CourseCode:", data.CourseCode);
        }
      } catch (error) {
        console.error("Error fetching data:", error); // Log any API errors
      }
    };
  
    // Only fetch if CourseCode exists
    if (data.CourseCode) fetchData(); 
  }, [data.CourseCode]); // Re-run effect when CourseCode changes
  

  return ( 
          <>
            <div className={`dynamicCard card shadow rounded-3 p-3 h-100 ${isDark ? "HeaderToggle" : ""}`}>
                <div className="d-flex align-items-center gap-3 mb-2">
                <img src={data.CourseIcon} alt="course icon" width={30} height={30} />
                <h5 className="mb-0">{data.CourseTitle}</h5>
                </div>
                <p>{data.CourseDescription}</p>
                <div className="d-flex justify-content-between mb-2">
                <p className="mb-0">10 Chapters</p>
                <p className="mb-0">100 Questions</p>
                </div>
                <Link to={`/Chapter/${data.CourseCode}`}  state={{ courseData : data , ChapterData: chapterData }} className="btn text-white mb-2" style={{ backgroundColor: "#179227" , textDecoration: 'none', color: 'inherit' }} >View Chapters</Link>
                <button className="btn bg-light text-dark" style={{ border: "1px solid #E0D4D4" }} onClick={GoTOQuiz}>Quick Start Quiz</button>
            </div>
          </>
        );
   
};


export default CourseCards;

