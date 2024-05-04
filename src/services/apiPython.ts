import axios from "axios";
import type { AxiosInstance } from "axios";

const apiPython: AxiosInstance = axios.create({
  baseURL: "http://localhost:5007",
  headers: {
    "Content-Type": "application/json",
  },
});

export default apiPython;
