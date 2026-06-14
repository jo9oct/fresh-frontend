
import { create } from "zustand";
import { devtools } from "zustand/middleware";
import api from "../lib/axios"; 
import axios from "axios";
import toast from "react-hot-toast";
import type {course} from "../types/Course"

interface CourseStore {
  CourseData: course[];       
  Loading: boolean;          
  IsRateLimited: boolean;     // true if API returns 429 Too Many Requests
  fetchCourseData: () => Promise<void>; // fetch all courses from backend
}

export const useCourseStore = create<CourseStore>()(
  devtools((set) => ({
    CourseData: [],
    Loading: true,           // initial loading state
    IsRateLimited: false,    // initial rate limit state

    fetchCourseData: async () => {
      try {
        set({ Loading: true }); // start loading before API call
        const res = await api.get<course[]>("/course"); // fetch courses from API
        set({ CourseData: res.data, IsRateLimited: false }); // store data and reset rate limit
      } catch (error) {
        console.error("Error fetching CourseData:", error); // log error for debugging

        if (axios.isAxiosError(error) && error.response?.status === 429) {
          set({ IsRateLimited: true }); // handle API rate limiting
        } else {
          toast.error("Failed to load CourseData"); // user-friendly error
        }
      } finally {
        set({ Loading: false }); // stop loading regardless of success/error
      }
    },
  }))
);
