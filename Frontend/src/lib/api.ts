/** Axios instance configured for SafeStay API */
import axios from 'axios';
import type { ApiResponse } from '../types';

export const BASE_URL = '/api';

export const api = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

// Attach JWT token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Unwrap ApiResponse envelope
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      // Clear BOTH localStorage keys — the raw token AND Zustand's persisted store.
      // Only clearing 'accessToken' leaves 'safestay-auth' intact, causing
      // Zustand to restore the token on next rehydration → infinite redirect loop.
      localStorage.removeItem('accessToken');
      localStorage.removeItem('safestay-auth');
      // Only redirect if not already on login page
      if (!window.location.pathname.startsWith('/login')) {
        window.location.href = '/login';
      }
    }
    return Promise.reject(err);
  }
);

export async function apiGet<T>(url: string): Promise<T> {
  const res = await api.get<ApiResponse<T>>(url);
  return res.data.data;
}

export async function apiPost<T>(url: string, body: unknown): Promise<T> {
  const res = await api.post<ApiResponse<T>>(url, body);
  return res.data.data;
}

export async function apiPatch<T>(url: string, body: unknown): Promise<T> {
  const res = await api.patch<ApiResponse<T>>(url, body);
  return res.data.data;
}
