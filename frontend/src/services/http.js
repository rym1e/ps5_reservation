import { useAuthStore } from '@/store/auth';

let serverTimeOffset = 0;

export function getServerTime() {
  return Date.now() + serverTimeOffset;
}

export function updateServerTimeOffset(dateHeader) {
  if (!dateHeader) return;
  const serverTime = new Date(dateHeader).getTime();
  if (!Number.isNaN(serverTime)) {
    serverTimeOffset = serverTime - Date.now();
  }
}

export function request(options) {
  const auth = useAuthStore();
  const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

  return new Promise((resolve, reject) => {
    uni.request({
      url: baseURL + options.url,
      method: options.method || 'GET',
      data: options.data,
      header: {
        'Content-Type': options.header?.['Content-Type'] || 'application/json',
        Authorization: auth.token ? `Bearer ${auth.token}` : '',
        ...options.header
      },
      success: (res) => {
        updateServerTimeOffset(res.header?.Date);
        if (res.statusCode === 401) {
          auth.logout();
          reject(new Error('登录已过期'));
          return;
        }
        if (res.statusCode >= 400) {
          const message = res.data?.message || '请求失败';
          reject(new Error(message));
          return;
        }
        resolve(res.data);
      },
      fail: (err) => {
        reject(err);
      }
    });
  });
}
