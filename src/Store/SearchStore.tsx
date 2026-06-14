
import { create } from 'zustand';

type TermState = {
  term: string;               // current search/filter term
  setTerm: (value: string) => void; // function to update the term
};

// Zustand store for search/filter term
export const useTermStore = create<TermState>((set) => ({
  term: '',                    // initial term is empty
  setTerm: (value: string) => set({ term: value }), // update term in store
}));
