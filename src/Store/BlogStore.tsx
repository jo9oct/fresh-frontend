
import { create } from "zustand";
import type { blog } from "../types/Blog.ts";
import api from "../lib/axios";
import axios from "axios";
import toast from "react-hot-toast";

interface BlogStore {
  blogs: blog[]; // array of blog posts
  loading: boolean; // loading state for fetch operation
  isRateLimited: boolean; // true if API returns 429 Too Many Requests
  term: string; // search/filter term

  fetchBlogs: () => Promise<void>; // fetch blogs from API
  setTerm: (term: string) => void; // update search term
}

export const useBlogStore = create<BlogStore>((set) => ({
  blogs: [],
  loading: true, // initial loading state
  isRateLimited: false,
  term: "",

  fetchBlogs: async () => {
    set({ loading: true }); // start loading before API call
    try {
      const res = await api.get<blog[]>("/blog"); // fetch blogs
      set({ blogs: res.data, isRateLimited: false }); // update store with data
    } catch (error) {
      console.error("Error fetching data", error); // log error
      if (axios.isAxiosError(error) && error.response?.status === 429) {
        set({ isRateLimited: true }); // handle rate limiting
      } else {
        toast.error("Failed to load blogs"); // show user-friendly error
      }
    } finally {
      set({ loading: false }); // stop loading regardless of success/error
    }
  },

  setTerm: (term) => set({ term }), // update search term for filtering
}));
