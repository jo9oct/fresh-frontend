
import { create } from "zustand";
import api from "../lib/axios";
import axios from "axios";
import toast from "react-hot-toast";
import type { Course, Chapter } from "../types/Course.ts";

interface ChapterStore {
  ChapterData: Chapter[]; // array of chapters for the selected course
  loading: boolean; // indicates if API call is in progress
  isRateLimited: boolean; // true if API returns 429 Too Many Requests

  fetchChaptersByCourse: (courseCode: string) => Promise<void>; // fetch chapters for a specific course
  clearChapters: () => void; // clear chapter data
}

export const useChapterStore = create<ChapterStore>((set) => ({
  ChapterData: [],
  loading: false,
  isRateLimited: false,

  fetchChaptersByCourse: async (courseCode) => {
    set({ loading: true }); // start loading before API call

    try {
      const res = await api.get<Course[]>("/chapter"); // fetch all courses with chapters
      const matchedCourse = res.data.find(
        (course) => course.CourseCode === courseCode // find the matching course
      );

      if (matchedCourse) {
        set({ ChapterData: matchedCourse.Chapters, isRateLimited: false }); // store chapters for matched course
      } else {
        console.log("No Chapter found with CourseCode:", courseCode); // no course match
        set({ ChapterData: [] }); // clear chapters if no match
      }
    } catch (error) {
      console.error("Error fetching data:", error); // log error

      if (axios.isAxiosError(error) && error.response?.status === 429) {
        set({ isRateLimited: true }); // handle API rate limiting
      } else {
        toast.error("Failed to load chapters"); // show user-friendly error
      }
    } finally {
      set({ loading: false }); // stop loading regardless of success/error
    }
  },

  clearChapters: () => set({ ChapterData: [] }), // utility to clear stored chapters
}));
