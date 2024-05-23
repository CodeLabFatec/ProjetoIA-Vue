import axios from "axios";
import type { AxiosInstance } from "axios";

const apiPython: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_PYTHON_BASEURL,
  headers: {
    "Content-Type": "application/json",
  },
});

export default apiPython;
