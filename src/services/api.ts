import { usuarioStore } from "@/stores/usuarioStore";
import axios from "axios";
import type { AxiosInstance } from "axios";

const api: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_SPRING_BASEURL,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (config) => {
    const { usuario } = usuarioStore();

    if (usuario) {
      config.headers.Authorization = `Bearer ${usuario.token}`;
    }

    return config;
  },
  (err) => {
    return Promise.reject(err);
  }
);

export default api;
