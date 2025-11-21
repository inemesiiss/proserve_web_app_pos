import axios from "axios";

// Get API base URL from environment variable
const API_BASE_URL = import.meta.env.VITE_API_DOMAIN;

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // Important for cookies
});

// Request interceptor - can add tokens or modify requests
api.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
console.log("API Base URL:", API_BASE_URL);
// Response interceptor - handle errors globally
api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // If 401 and not already retried, try to refresh token
    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !window.location.pathname.includes("/login")
    ) {
      originalRequest._retry = true;

      try {
        // Try to refresh the token
        await api.post("/api/user/refresh/");
        // Retry the original request
        return api(originalRequest);
      } catch (refreshError) {
        // Refresh failed, redirect to login
        window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
