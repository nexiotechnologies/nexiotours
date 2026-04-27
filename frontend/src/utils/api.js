import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.PUBLIC_API_URL || "/api",
  headers: { "Content-Type": "application/json" },
});

let tokenFetcher = () => null;

export const setTokenFetcher = (fn) => {
  tokenFetcher = fn;
};

api.interceptors.request.use(async (config) => {
  const token = await tokenFetcher();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (res) => res,
  async (err) => {
    if (err.response?.status === 401) {
      // Let Clerk handle auth session errors
    }
    return Promise.reject(err);
  }
);

export default api;
