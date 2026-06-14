import { create } from "zustand";
import api from "../lib/axios";
import type { allQuestions } from "../types/Question";
import axios from "axios";

interface QuestionStore {
  questionData: allQuestions[];
  Loading: boolean;
  IsRateLimited: boolean;
  fetchAllQuestions: () => Promise<void>;
  clearQuestions: () => void;
}

export const useQuestionStore = create<QuestionStore>((set) => ({
  questionData: [],
  Loading: true,
  IsRateLimited: false,

  fetchAllQuestions: async () => {
    try {
      set({ Loading: true }); // start loading before API call
      const res = await api.get<allQuestions[]>("/question"); // fetch all questions
  
      set({ questionData: res.data, IsRateLimited: false }); // store fetched questions
  
      // ❌ This check is incorrect here; axios errors should be handled in catch
      if (axios.isAxiosError(Error) && Error.response?.status === 429) {
        set({ IsRateLimited: true }); // mark rate-limited if status 429
      } else {
        // toast.error("Failed to load questions"); // show error toast for other issues
      }
  
    } catch (error) {
      console.error("❌ Error fetching questions:", error); // log any fetch errors
    } finally {
      set({ Loading: false }); // stop loading after fetch attempt
    }
  },
  

  clearQuestions: () => set({ questionData: [] }),
}));
