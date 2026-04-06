import axios from "axios";

// API base URL env'den gelir, yoksa local backend kullanılır
export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:5287/api",
});

// Token varsa her isteğe otomatik eklenir
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});
