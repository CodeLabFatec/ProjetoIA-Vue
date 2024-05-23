import axios from "axios";
import type { AxiosInstance } from "axios";

const api: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_SPRING_BASEURL,
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;
