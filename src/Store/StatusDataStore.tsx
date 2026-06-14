import { create } from "zustand";
import type { statusData } from "../types/StatusData";
import api from "../lib/axios";
import { useAuthStore } from "./authStore";

interface StatusStore {
  statusData: number ;
  updateData: (userName:string,chapterName: string, data: number) => Promise<void>;
  getData: () => Promise<void>;
}

export const useStatusDataStore = create<StatusStore>((set) => ({
  statusData: 0,

  updateData: async (userName, chapterName, data) => {
    try {
        // Send PUT request to update user's status data for a chapter
        await api.put(`/user/statusData`, {
            userName: userName,
            chapterName,
            data,
        });
        console.log("Update success"); // log success
    } catch (error) {
        console.error(error); // log any errors
    }
  },

  getData: async () => {
    try {
        // Get current user from auth store
        const user = useAuthStore.getState().user;
        if (!user?.username) throw new Error("User not logged in"); // handle missing user

        // Fetch all status data from API
        const res = await api.get(`/user/statusData`);

        // Find the record for the current user
        const userRecord = res.data.find(
            (d: statusData) => d.userName === user.username
        );

        // Get the first value of StatusData or default to 0
        const firstValue = userRecord?.StatusData?.[0]?.data ?? 0;

        set({ statusData: firstValue }); // update state in store

    } catch (error) {
        console.error("Failed to get data", error); // log errors
    }
}

  
}));
