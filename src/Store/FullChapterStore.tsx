
import { create } from "zustand";
import api from "../lib/axios";
import type { Course,Chapter } from "../types/Course.ts";
import axios from "axios";

interface ChapterStore {
  chapterData: Course[]; 
  Chapters: Chapter[]
  loading: boolean;
  isRateLimited: boolean;
  fetchAllChapters: () => Promise<void>;
  clearChapters: () => void;
}

export const useFullChapterStore = create<ChapterStore>((set) => ({
  Chapters: [],               
  chapterData: [],            
  loading: true,             
  isRateLimited: false,      

  fetchAllChapters: async () => {
    set({ loading: true });   // start loading
    try {
      const res = await api.get<Course[]>("/chapter"); // fetch all chapters
      set({ chapterData: res.data, isRateLimited: false }); // store chapters

      // ❌ Incorrect: Error check should be in catch block
      if (axios.isAxiosError(Error) && Error.response?.status === 429) {
        set({ isRateLimited: true }); // mark rate-limited if status 429
      } else {
        // toast.error("Failed to load Chapters"); // notify user on other errors
      }
    } catch (error) {
      console.error("Error fetching Chapters:", error); // log fetch errors
    } finally {
      set({ loading: false }); // stop loading regardless of success/error
    }
  },

  clearChapters: () => set({ chapterData: [] }), // clear all chapter data
}));
