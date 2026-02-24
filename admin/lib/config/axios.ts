import axios from "axios";
import { showWarningToast, showErrorToast } from "@/utils/toastUtils";
import useAuthStore from "@/store/authStore";

// Base URL now points to the separate Express backend
const BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000";

export const api = axios.create({
  baseURL: BASE_URL,
  timeout: 15000,
  // Required so the browser sends the HttpOnly session cookie
  // cross-origin to the Express backend.
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// Response interceptor — handle 401 / network errors globally
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      useAuthStore.getState().logout();
      showWarningToast({
        title: "Session Expired",
        description: "Please login again to continue.",
      });

      if (typeof window !== "undefined" && window.location.pathname !== "/login") {
        window.location.href = "/login";
      }
    }

    if (!error.response) {
      showErrorToast({
        title: "Network Error",
        description: "Please check your connection and make sure the backend is running.",
      });
    }

    return Promise.reject(error);
  }
);
