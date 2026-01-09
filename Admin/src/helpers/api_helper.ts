import axios, { AxiosRequestConfig } from "axios";
import config from "../config";

const { api } = config;

/* ================= AXIOS BASE ================= */

axios.defaults.baseURL = api.API_URL; // http://localhost:8000/api
axios.defaults.withCredentials = true;

/* ================= AUTH HEADER ================= */

const authUser = localStorage.getItem("authUser");
const token = authUser ? JSON.parse(authUser)?.token : null;

if (token) {
  axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
}

/* ================= RESPONSE INTERCEPTOR ================= */

axios.interceptors.response.use(
  (response) => response.data,
  (error) => {
    let message = "Something went wrong";

    if (error.response) {
      switch (error.response.status) {
        case 401:
          message = "Unauthorized";
          break;
        case 422:
          message = error.response.data?.message || "Validation error";
          break;
        case 404:
          message = "API not found";
          break;
        case 500:
          message = "Server error";
          break;
        default:
          message = error.response.data?.message || error.message;
      }
    }

    return Promise.reject(message);
  }
);

/* ================= AUTH HELPERS ================= */

export const setAuthorization = (token: string) => {
  localStorage.setItem(
    "authUser",
    JSON.stringify({ token })
  );

  axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
};

export const getLoggedInUser = () => {
  const user = localStorage.getItem("authUser");
  return user ? JSON.parse(user) : null;
};

/* ================= API CLIENT ================= */

export class APIClient {
  get<T = any>(url: string, params?: any): Promise<T> {
    return axios.get(url, { params });
  }

  create<T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<T> {
    return axios.post(url, data, config);
  }

  update<T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<T> {
    return axios.patch(url, data, config);
  }

  delete<T = any>(
    url: string,
    config?: AxiosRequestConfig
  ): Promise<T> {
    return axios.delete(url, config);
  }
}
