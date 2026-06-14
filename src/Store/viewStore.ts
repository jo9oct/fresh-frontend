
import { create } from "zustand";
import type { views } from "../types/View";
import api from "../lib/axios";

interface viewStore {
  view: views | null;
  fetchView: () => Promise<void>;
}

export const useViewStore = create<viewStore>((set) => ({
  view: null, // Stores the fetched view data

  fetchView: async () => {
    try {
      const res = await api.get<views>("/view"); // Fetch view data from API
      set({ view: res.data }); // Update store state with fetched data
    } catch (error) {
      console.error("❌ Error in fetching view data:", error); // Log error if API call fails
    }
  },
}));

