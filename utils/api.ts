import * as SecureStore from "expo-secure-store";
import axios, { type AxiosInstance, type AxiosRequestConfig } from "axios";
import { Platform } from "react-native";

const API_URL =
  process.env.EXPO_PUBLIC_API_URL ??
  "https://cashin-api-production.up.railway.app";

export const ACCESS_TOKEN_KEY = "cashin_access_token";
export const REFRESH_TOKEN_KEY = "cashin_refresh_token";

// SecureStore wrapper compatible with web
async function storeGet(key: string): Promise<string | null> {
  if (Platform.OS === "web") {
    try {
      return localStorage.getItem(key);
    } catch {
      return null;
    }
  }
  return SecureStore.getItemAsync(key);
}

async function storeSet(key: string, value: string): Promise<void> {
  if (Platform.OS === "web") {
    try {
      localStorage.setItem(key, value);
    } catch {}
    return;
  }
  return SecureStore.setItemAsync(key, value);
}

async function storeDel(key: string): Promise<void> {
  if (Platform.OS === "web") {
    try {
      localStorage.removeItem(key);
    } catch {}
    return;
  }
  return SecureStore.deleteItemAsync(key);
}

export const tokenStorage = { get: storeGet, set: storeSet, del: storeDel };

let _logoutCallback: (() => void) | null = null;
export function registerLogoutCallback(cb: () => void) {
  _logoutCallback = cb;
}

const api: AxiosInstance = axios.create({
  baseURL: API_URL,
  headers: { "Content-Type": "application/json" },
  timeout: 30000,
});

// Request interceptor — attach bearer token
api.interceptors.request.use(async (config) => {
  const token = await storeGet(ACCESS_TOKEN_KEY);
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor — handle 401 with refresh
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value: unknown) => void;
  reject: (reason?: unknown) => void;
  config: AxiosRequestConfig;
}> = [];

function processQueue(error: unknown, token: string | null = null) {
  failedQueue.forEach(({ resolve, reject, config }) => {
    if (error) {
      reject(error);
    } else {
      if (config.headers) {
        (config.headers as Record<string, string>).Authorization = `Bearer ${token}`;
      }
      resolve(api(config));
    }
  });
  failedQueue = [];
}

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config as AxiosRequestConfig & {
      _retry?: boolean;
    };

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject, config: originalRequest });
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const refreshToken = await storeGet(REFRESH_TOKEN_KEY);
        if (!refreshToken) throw new Error("No refresh token");

        const response = await axios.post(`${API_URL}/api/v1/auth/refresh`, {
          refresh_token: refreshToken,
        });

        const { access_token, refresh_token } = response.data;
        await storeSet(ACCESS_TOKEN_KEY, access_token);
        if (refresh_token) await storeSet(REFRESH_TOKEN_KEY, refresh_token);

        processQueue(null, access_token);
        if (originalRequest.headers) {
          (originalRequest.headers as Record<string, string>).Authorization = `Bearer ${access_token}`;
        }
        return api(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        await storeDel(ACCESS_TOKEN_KEY);
        await storeDel(REFRESH_TOKEN_KEY);
        _logoutCallback?.();
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default api;
