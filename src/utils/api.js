import axios from "axios";

// Use environment variable if available, otherwise default to localhost for dev
const BASE = import.meta.env.VITE_API_BASE || "http://localhost:5000";

const api = axios.create({
  baseURL: BASE,
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;
