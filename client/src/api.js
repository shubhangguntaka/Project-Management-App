import axios from "axios";

/**
 * Configure the global API client.
 *
 * In production the React app is hosted on Vercel while the Express API
 * lives on Render — a completely different domain — so baseURL must be
 * an absolute URL (set via REACT_APP_API_URL in Vercel env vars).
 *
 * Locally we fall back to http://localhost:5000/api.
 */
const API_BASE_URL =
  process.env.REACT_APP_API_URL || "http://localhost:5000/api";

const API = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "x-api-key": process.env.REACT_APP_API_KEY || "utpatti-pm-api-key-2026",
    "Content-Type": "application/json"
  }
});

/**
 * Global Response Interceptor
 * Intercepts all API responses and errors to ensure consistent error formats
 * across the application, preventing boilerplate try/catch repetition in components.
 */
API.interceptors.response.use(
  (response) => response,
  (error) => {
    // Format error message cleanly before throwing it back to the component
    let errorMessage = "An unexpected error occurred.";
    if (error.response && error.response.data && error.response.data.error) {
      errorMessage = error.response.data.error; // Catch backend-thrown errors cleanly
    } else if (error.request) {
      errorMessage = "Network error. Please check your connection.";
    }
    
    // Create a new structured error object
    const structuredError = new Error(errorMessage);
    structuredError.status = error.response?.status || 500;
    structuredError.originalError = error;
    
    return Promise.reject(structuredError);
  }
);

/* ── Task Endpoints ────────────────────────────────── */
export const taskApi = {
  getAll:    (params) => API.get("/tasks", { params }),
  getById:   (id)     => API.get(`/tasks/${id}`),
  create:    (data)   => API.post("/tasks", data),
  update:    (id, data) => API.put(`/tasks/${id}`, data),
  delete:    (id)     => API.delete(`/tasks/${id}`),
  getHistory:(id)     => API.get(`/tasks/${id}/history`)
};

/* ── User Endpoints ────────────────────────────────── */
export const userApi = {
  getAll:    ()       => API.get("/users"),
  getById:   (id)     => API.get(`/users/${id}`),
  create:    (data)   => API.post("/users", data),
  update:    (id, data) => API.put(`/users/${id}`, data),
  delete:    (id)     => API.delete(`/users/${id}`)
};

export default API;