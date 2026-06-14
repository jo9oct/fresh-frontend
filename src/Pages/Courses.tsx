
import React, {  useEffect } from "react";
import CourseCards from "../components/CourseCards.tsx"
import Loader1 from "../components/ui/Loader1"
import type { course } from "../types/Course";
import RateLimitWarning from "../components/ui/TimeLimit.tsx"
import { useThemeStore } from "../Store/TeamToggle.tsx";
import { useTermStore } from '../Store/SearchStore.tsx';
import { useCourseStore } from "../Store/CourseStore.tsx";

const Courses: React.FC = () => {

    const { CourseData, fetchCourseData, Loading, IsRateLimited } = useCourseStore(); // Get course data and store actions

    useEffect(() => {
        fetchCourseData() // Fetch all courses when component mounts
    }, [fetchCourseData]);
    
    const { isDark } = useThemeStore(); // Theme mode (dark/light)
    
    const setTerm = useTermStore((state) => state.setTerm); // Function to set the search term
    
    // Custom search helper function: checks if 'pattern' exists in 'word' in order
    function isMatch(word: any, pattern: any) {
        let i = 0; 
        let j = 0; 
        while (i < word.length && j < pattern.length) {
          if (word[i] === pattern[j]) {
            j++; // Move pattern pointer if characters match
          }
          i++; // Always move word pointer
        }
        return j === pattern.length; // True if whole pattern was found in order
    }
    
    const term = useTermStore(state => state.term.toLowerCase()); // Current search term, lowercase
    
    // Filter courses based on search term
    const filteredData = CourseData.filter(data => {
        const title = data.CourseTitle.toLowerCase(); // Course title in lowercase
    
        if (!term) return true; // If no term, include all courses
    
        // Split title into words and check if any word matches the search term
        return title.split(" ").some(word => isMatch(word, term));
    });
    

    return (
        <>  

            <div className="d-flex flex-column justify-content-center align-items-center container text-center">
                <h2>All Freshman Courses</h2>
                <p className="col-5">Choose from our comprehensive collection of Ethiopian university freshman courses. 
                    Each course includes chapter-based quizzes with instant feedback.</p>
                <div className="d-flex justify-content-center align-items-center mb-4 w-25 mt-5 shadow-sm" style={{border: '1px solid #ccc', borderRadius: '5px' , backgroundColor:"white"}}>
                    <i className="fa-solid fa-magnifying-glass mx-3 " style={{color:"black"}}></i>
                    <input 
                        type="search"
                        className="form-control fa-solid fa-magnifying-glass border-0"
                        placeholder="Search ..."
                        onChange={(e) => setTerm(e.target.value)}
                    />
                </div>
            </div>

            {Loading && <Loader1 />}
            {CourseData.length > 0 && !IsRateLimited && (

                <div className="container py-5">
                    <div className={`row gx-4 gy-4 `}>
                        {filteredData.map((data: course) => (
                            <div key={data._id} className={`col-12 col-md-6 col-lg-4 ${isDark ? "HeaderToggle" : ""}`}>
                            <CourseCards data={data} />
                            </div>
                        ))}
                    </div>
                </div>

            )}
            {IsRateLimited && <RateLimitWarning/>}
        </>
    ); 

};


export default Courses;

