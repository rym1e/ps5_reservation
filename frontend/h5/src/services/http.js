import axios from 'axios';
import dayjs from 'dayjs';
import { useAuthStore } from '@/stores/auth';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000',
  timeout: 15000
});

let serverTimeOffset = 0;

api.interceptors.request.use((config) => {
  const auth = useAuthStore();
  if (auth.token) {
    config.headers.Authorization = `Bearer ${auth.token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => {
    const serverDate = response.headers.date;
    if (serverDate) {
      serverTimeOffset = new Date(serverDate).getTime() - Date.now();
    }
    return response;
  },
  (error) => {
    const { response } = error;
    if (response && response.status === 401) {
      const auth = useAuthStore();
      auth.logout();
    }
    return Promise.reject(error);
  }
);

export function getServerNow() {
  return dayjs(Date.now() + serverTimeOffset);
}

export default api;
