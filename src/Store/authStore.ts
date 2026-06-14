import { create } from "zustand";
import { persist } from "zustand/middleware";
import axios from "axios";
import toast from "react-hot-toast";
import type{ AdminLog } from "../types/AdminLog";

// ✅ Configure API and Axios
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";
axios.defaults.withCredentials = true;

// ✅ Types
interface User {
  username: string;
  email: string;
  isVerified: boolean;
  role: string;
}

interface AuthState {
  user: User | null;
  adminLog: AdminLog[] | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isCheckingAuth: boolean;
  error: string | null;
  setTotalUsers: number | 0
  setVerifiedUsersCount: number | 0

  // Setters for Google login
  setUser: (user: User | null) => void;
  setAuthenticated: (isAuth: boolean) => void;


  signUp: (username: string, email: string, password: string, role: string) => Promise<void>;
  login: (emailOrUsername: string, password: string) => Promise<void>;
  verifyEmail: (code: string) => Promise<void>;
  checkAuth: () => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (data: {
    username: string;
    currentPassword?: string;
    newPassword?: string;
  }) => Promise<void>;
  deleteAccount: (password: string) => Promise<void>;
  resendVerificationCode: () => Promise<void>;
  forgotPassword: (email: string) => Promise<void>;
  resetPassword: (token: string, newPassword: string, confirmPassword: string) => Promise<boolean>;
  fetchUserLog: () => Promise<void>
  fetchAdminLog: () => Promise<void>
  ResetPassword: (username:string,newPassword:string) => Promise<void>
}

// ✅ Zustand Store
export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      adminLog : null,
      isAuthenticated: false,
      isLoading: false,
      isCheckingAuth: true,
      error: null,
      setTotalUsers: 0,
      setVerifiedUsersCount: 0,

       // ✅ Setters for Google login
      setUser: (user) => set({ user }),
      setAuthenticated: (isAuth) => set({ isAuthenticated: isAuth }),

      // ✅ Sign Up
      signUp: async (username, email, password, role) => {
        set({ isLoading: true, error: null });
        console.log(role)
        try {
          const res = await axios.post(`${API_BASE_URL}/auth/register`, {
            username,
            email,
            password,
            role
          });

          if (res.data?.user) {
            set({ user: res.data.user, isAuthenticated: true });
          } else {
            throw new Error("Registration failed");
          }

          if(role === "user"){
            await axios.post(`${API_BASE_URL}/user/statusData` , {
              userName: username
            })
          }

        } catch (err) {
          const message = getErrorMessage(err);
          set({ error: message });
          // toast.error(message);
          throw err;
        } finally {
          set({ isLoading: false });
        }
      },

      // ✅ Login
      login: async (emailOrUsername, password) => {
        set({ isLoading: true, error: null });
        try {
          const res = await axios.post(`${API_BASE_URL}/auth/login`, {
            emailOrUsername,
            password,
          });
          
          if (res.data?.user) {
            set({ user: res.data.user, isAuthenticated: true });
            toast.success("Logged in successfully");
          } else {
            throw new Error("Login failed");
          }
        } catch (err) {
          const message = getErrorMessage(err);
          set({ error: message });
          toast.error(message);
          throw err;
        } finally {
          set({ isLoading: false });
        }
      },

      // ✅ Email Verification
      verifyEmail: async (code) => {
        set({ isLoading: true, error: null });
        try {
          const res = await axios.post(`${API_BASE_URL}/auth/verify`, { code });
          if (res.data?.user) {
            set({ user: res.data.user, isAuthenticated: true });
            toast.success("Email verified successfully!");
          } else {
            throw new Error("Verification failed");
          }
        } catch (err) {
          const message = getErrorMessage(err);
          set({ error: message });
          // toast.error(message);
          throw err;
        } finally {
          set({ isLoading: false });
        }
      },

      // ✅ Check Auth
      checkAuth: async () => {
        set({ isCheckingAuth: true, error: null });
        try {
          const res = await axios.get(`${API_BASE_URL}/auth/check-auth`, {
            withCredentials: true 
          });
      
          if (res.data?.user) {
            set({ user: res.data.user, isAuthenticated: true });
          } else {
            set({ user: null, isAuthenticated: false });
          }
        } catch {
          set({ user: null, isAuthenticated: false });
        } finally {
          set({ isCheckingAuth: false });
        }
      },

      // ✅ Logout
      logout: async () => {
        set({ isLoading: true, error: null });
        try {
          await axios.post(`${API_BASE_URL}/auth/logout`);
          set({ user: null, isAuthenticated: false });
          toast.success("Logged out");
        } catch (err) {
          const message = getErrorMessage(err);
          set({ error: message });
          // toast.error(message);
        } finally {
          set({ isLoading: false });
        }
      },

      // ✅ Update Profile
      updateProfile: async ({ username, currentPassword, newPassword }) => {
        set({ isLoading: true, error: null });

        try {
          const res = await axios.put(`${API_BASE_URL}/auth/update-profile`, {
            username,
            currentPassword,
            newPassword,
          });

          // Only consider success if response code is 200
          if (res.status === 200 && res.data?.user) {
            set({ user: res.data.user });
            toast.success("Profile updated successfully");
            
          } else {
            throw new Error(res.data?.message || "Update failed");
          }
        } catch (err) {
          const message = getErrorMessage(err);
          set({ error: message });
          toast.error(message); // This will show "Current password is incorrect" or other error from server
        } finally {
          set({ isLoading: false });
        }
      },

      // ✅ Delete Account

      deleteAccount: async (password: string) => {
      try {
        set({ isLoading: true, error: null }); // Optional: set loading state if you track it

        const res = await axios.delete(`${API_BASE_URL}/auth/delete`, {
          data: { password }, // axios supports body in DELETE via `data`
          withCredentials: true,
        });
    
        if (res.data.success) {
          toast.success("Account deleted successfully");
    
          // Clear Zustand auth state
          set({
            user: null,
            isAuthenticated: false,
            isLoading: false,
            error: null,
          });

          // Redirect to homepage
        } else {
          toast.error(res.data.message || "Failed to delete account");
          set({ isLoading: false });
        }
      } catch (err: any) {
        console.error("Delete error:", err);
        toast.error(err?.response?.data?.message || "Failed to delete account");
        set({ isLoading: false });
      }
    },

      // ✅ Resend Verification
      resendVerificationCode: async () => {
        set({ isLoading: true, error: null });
        try {
          const res = await axios.post(`${API_BASE_URL}/auth/resend-verification`);
          toast.success(res.data?.message || "Verification code sent");
        } catch (err) {
          const message = getErrorMessage(err);
          set({ error: message });
          // toast.error(message);
        } finally {
          set({ isLoading: false });
        }
      },

      // ✅ Forgot Password
      forgotPassword: async (email) => {
        set({ isLoading: true, error: null });
        try {
          const res = await axios.post(`${API_BASE_URL}/auth/forgot-password`, { email });
          toast.success(res.data?.message || "Reset link sent");
        } catch (err) {
          const message = getErrorMessage(err);
          set({ error: message });
          // toast.error(message);
        } finally {
          set({ isLoading: false });
        }
      },

      // ✅ Reset Password
      resetPassword: async (token, newPassword) => {
        set({ isLoading: true, error: null });

        try {
          const res = await axios.post(`${API_BASE_URL}/auth/reset-password/${token}`, {
            password: newPassword,
          });

          toast.success(res.data?.message || "Password reset successful");

          if (res.data?.user) {
            set({ user: res.data.user, isAuthenticated: true });
          }

          return true;
        } catch (err) {
          const message = getErrorMessage(err);
          set({ error: message });
          toast.error(message);
          return false;
        } finally {
          set({ isLoading: false });
        }
      },

      fetchUserLog: async () => {
        set({ isLoading: true }); // start loading while fetching users
        try {
          const res = await axios.get(`${API_BASE_URL}/auth/AllUser`);
          set({ setTotalUsers: res.data.totalUsers }); // update total users count in store
          set({ setVerifiedUsersCount: res.data.verifiedUsersCount }); // update verified users count in store
          console.log("success");
        } catch (error) {
          console.error("Error fetching User logs:", error); // log any error
        } finally {
          set({ isLoading: false }); // stop loading
        }
      },
      
      fetchAdminLog: async () => {
        set({ isLoading: true }); // start loading while fetching admin logs
        try {
          const res = await axios.get<AdminLog[]>(`${API_BASE_URL}/auth/AllAdmin`);
          set({ adminLog: res.data }); // update admin logs in store
        } catch (error) {
          console.error("Error fetching admin logs:", error); // log error
          throw error; // propagate error
        } finally {
          set({ isLoading: false }); // stop loading
        }
      },
      
      ResetPassword: async (username, newPassword) => {
        set({ isLoading: true }); // indicate loading state
        if (!username || !newPassword) {
          toast.error("Please Enter Reset Password"); // validate inputs
          set({ isLoading: false });
          return;
        }
        try {
          await axios.post(`${API_BASE_URL}/auth/ResetAdminPassword`, {
            userName: username,
            newPassword: newPassword,
          });
          toast.success("Updated Successfully"); // show success notification
        } catch (error) {
          toast.error("Error In Password Updated"); // show error notification
          console.log("error in", error);
        } finally {
          set({ isLoading: false }); // stop loading
        }
      },      

    }),
    {
      name: "auth-storage", // localStorage key
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);

// ✅ Error handler
function getErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    return error.response?.data?.message || error.message || "Network error";
  }
  if (error instanceof Error) return error.message;
  return "Unknown error occurred";
}
