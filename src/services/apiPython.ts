import axios from "axios";
import type { AxiosInstance } from "axios";

const apiPython: AxiosInstance = axios.create({
  baseURL: "http://localhost:8080",
  headers: {
    "Content-Type": "application/json",
  },
});

export default apiPython;
