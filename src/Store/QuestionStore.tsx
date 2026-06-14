
import { create } from "zustand";
import api from "../lib/axios";
import axios from "axios";
import toast from "react-hot-toast";
import type { allQuestions, TestResult } from "../types/Question.ts";

interface QuizStore {
  currentQuestionIndex: number;
  selectedAnswer: number | null;
  answers: TestResult[];
  isRateLimited: boolean;
  questionData: allQuestions[];
  loading: boolean;
  Status: boolean;
  EndIndex: number;
  Length: number;

  setCurrentQuestionIndex: (index: number) => void;
  setSelectedAnswer: (answer: number | null) => void;
  setAnswers: (answers: TestResult[]) => void;
  setStatus: (Status: boolean) => void;
  setEndIndex: (index: number) => void;
  setLength: (length: number) => void;

  fetchQuestions: (CourseCode: any, CourseData: any, state?: { callFunction?: boolean; functionParam?: boolean }) => Promise<void>;
}

export const useQuizStore = create<QuizStore>((set) => ({
  currentQuestionIndex: 0,
  selectedAnswer: null,
  answers: [{
    questionId: 0,
    selectedAnswer: 0,
    isCorrect: false,
  }],
  isRateLimited: false,
  questionData: [],
  loading: true,
  Status: true,
  EndIndex: 0,
  Length: 0,

  setCurrentQuestionIndex: (index) => set({ currentQuestionIndex: index }),
  setSelectedAnswer: (answer) => set({ selectedAnswer: answer }),
  setAnswers: (answers) => set({ answers }),
  setStatus: (Status) => set({ Status }),
  setEndIndex: (index) => set({ EndIndex: index }),
  setLength: (Length) => set({ EndIndex: Length }),

  fetchQuestions: async (CourseCode, CourseData) => {
    set({ loading: true }); // start loading before API call
    try {
      const res = await api.get<allQuestions[]>("/question"); // fetch all questions from API
      
      // find the questions matching the current course and chapter
      const matched = res.data.find(
        (entry) =>
          entry.CourseCode === CourseCode &&
          entry.CourseChapter === CourseData.ChapterNumber
      );
  
      if (matched) {
        set({ Length: matched.Questions.length }); // store number of questions
        set({ questionData: [matched], isRateLimited: false }); // store matched questions
      } else {
        set({ questionData: [] }); // no matching questions found
      }

    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 429) {
        set({ isRateLimited: true }); // handle rate-limit error
      } else {
        toast.error("Failed to load questions"); // show error toast for other issues
      }
    } finally {
      set({ loading: false }); // stop loading after API call
    }
  },
  

}));
