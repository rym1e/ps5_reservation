const API_BASE_URL = import.meta.env?.VITE_API_BASE_URL || 'http://localhost:3000';

let serverTimeOffset = 0;

export function getServerTimestamp() {
  return Date.now() + serverTimeOffset;
}

function updateServerTimeOffset(response) {
  const dateHeader = response?.header?.Date || response?.header?.date;
  if (!dateHeader) return;
  const serverDate = new Date(dateHeader).getTime();
  if (!Number.isNaN(serverDate)) {
    serverTimeOffset = serverDate - Date.now();
  }
}

export function request({ url, method = 'GET', data = {}, header = {}, skipAuth = false }) {
  return new Promise((resolve, reject) => {
    const token = skipAuth ? '' : uni.getStorageSync('token');
    const finalHeaders = Object.assign({ 'Content-Type': 'application/json' }, header);
    if (token && !skipAuth) {
      finalHeaders.Authorization = `Bearer ${token}`;
    }

    uni.request({
      url: url.startsWith('http') ? url : `${API_BASE_URL}${url}`,
      method,
      data,
      header: finalHeaders,
      success: (response) => {
        updateServerTimeOffset(response);
        const { statusCode, data: payload } = response;
        if (statusCode >= 200 && statusCode < 300) {
          resolve(payload);
        } else if (statusCode === 401) {
          uni.removeStorageSync('token');
          reject({ code: 401, message: '未登录或登录已过期', payload });
        } else {
          reject({ code: payload?.code || statusCode, message: payload?.message || '请求失败', payload });
        }
      },
      fail: (error) => {
        reject({ code: -1, message: error.errMsg || '网络错误', error });
      }
    });
  });
}

export function upload({ url, filePath, name = 'file', formData = {}, header = {} }) {
  return new Promise((resolve, reject) => {
    const token = uni.getStorageSync('token');
    const finalHeaders = { ...header };
    if (token) {
      finalHeaders.Authorization = `Bearer ${token}`;
    }

    uni.uploadFile({
      url: url.startsWith('http') ? url : `${API_BASE_URL}${url}`,
      filePath,
      name,
      formData,
      header: finalHeaders,
      success: (response) => {
        updateServerTimeOffset(response);
        let payload = response.data;
        try {
          payload = JSON.parse(response.data);
        } catch (error) {
          // ignore parse errors and return original data
        }
        if (response.statusCode >= 200 && response.statusCode < 300) {
          resolve(payload);
        } else {
          reject({ code: response.statusCode, message: '上传失败', payload });
        }
      },
      fail: (error) => {
        reject({ code: -1, message: error.errMsg || '上传失败', error });
      }
    });
  });
}
