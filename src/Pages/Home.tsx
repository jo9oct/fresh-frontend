

import React, { useState,useEffect } from "react";
import CourseCards from "../components/CourseCards.tsx"
import axios from "axios"
import toast  from "react-hot-toast";
import Loader1 from "../components/ui/Loader1"
import type { course } from "../types/Course";
import api from "../lib/axios.tsx";
import RateLimitWarning from "../components/ui/TimeLimit.tsx"
import HomeUi from "../components/ui/HomeUi.tsx";
import { useNavigate } from "react-router-dom";
import { useThemeStore } from "../Store/TeamToggle.tsx";
import type {views} from "../types/View.ts"
import { useViewStore } from "../Store/viewStore.ts";
import {useAuthStore} from  "../Store/authStore.ts"

const Courses: React.FC = () => {

    const { isDark } = useThemeStore();
    const {view,fetchView} =useViewStore()

    const navigation=useNavigate();
      const {user} = useAuthStore()
    const [IsRateLimited,setIsRateLimited] = useState(false)
    const [CourseData,setCourseData] = useState<course[]>([])
    const [Loading,setLoading] = useState(true)
    console.log(user)
    useEffect(() => {
        const fetchViews = async() => {
            await fetchView()
        }
        fetchViews()
    },[])

    const topView = view?.CorseView
    .slice() // copy array
    .sort((a, b) => b.TotalCourseView - a.TotalCourseView);

    useEffect(() => {
        const PostData = async () => {
          try {
            if (!sessionStorage.getItem("viewCounted")) {
              await api.put<views>("/view", {
                TotalView: true,
              });
              sessionStorage.setItem("viewCounted", "true");
            }
          } catch (error) {
            console.error("❌ Error posting view:", error);
          }
        };
    
        PostData();

      }, []);

    useEffect(() => {
        const fetchData=async () => {
            try{
                const res=await api.get<course[]>('/course')
                console.log(res.data)
                setCourseData(res.data)
                setIsRateLimited(false)
            }
            catch(error){
                console.log("error fetching Data" , error)
                if (axios.isAxiosError(error) && error.response?.status === 429) {
                    setIsRateLimited(true);
                }
                else{
                    toast.error("Failed to load blogs")
                }
            }
            finally{
                setLoading(false)
            }
        }

        fetchData()
    },[])

    return (
        <>  
                <HomeUi/>

                {Loading && <Loader1 />}
                {CourseData.length > 0 && !IsRateLimited && (

                <div className="container py-5">
                    <div className="row gx-4 gy-4">
                    {topView
                        ?.map((tv) => {
                        // Find the matching course from CourseData
                        const courseMatch = CourseData.find(
                            (c) => c.CourseCode === tv.CourseCode
                        );
                        return courseMatch ? { ...tv, ...courseMatch } : null; // merge or skip
                        })
                        .filter((item) => item !== null) // remove unmatched
                        .slice(0, 3) // take top 3
                        .map((data: any) => (
                        <div
                            key={data._id}
                            className={`col-12 col-md-6 col-lg-4 ${isDark ? "HeaderToggle" : ""}`}
                        >
                            <CourseCards data={data} />
                        </div>
                        ))}
                    </div>
                </div>

                )}
                {IsRateLimited && <RateLimitWarning/>}

                <div className={`text-center ${isDark ? "HeaderToggle" : ""}`}>
                    <button className="my-5 py-2 px-4 rounded-3 bg-white text-shadow" style={{ border: "1px solid #D6D6D6" }} onClick={() => navigation("/courses")}>
                        View All Courses
                    </button>
                </div>
         
        </>
    ); 

};


export default Courses;