import axios from "axios";
import type { AxiosInstance } from "axios";

const api: AxiosInstance = axios.create({
  baseURL: "http://192.168.15.89:8080",
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;
