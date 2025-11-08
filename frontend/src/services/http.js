const API_BASE_URL = import.meta.env?.VITE_API_BASE_URL || 'http://localhost:3000';

let serverTimeOffset = 0;

export function getServerTimestamp() {
  return Date.now() + serverTimeOffset;
}

function updateServerTimeOffset(response) {
  const dateHeader = response.headers?.get('date');
  if (!dateHeader) return;
  const serverDate = new Date(dateHeader).getTime();
  if (!Number.isNaN(serverDate)) {
    serverTimeOffset = serverDate - Date.now();
  }
}

function buildUrl(url, params) {
  if (!params || Object.keys(params).length === 0) return url;
  const searchParams = new URLSearchParams(params);
  const separator = url.includes('?') ? '&' : '?';
  return `${url}${separator}${searchParams.toString()}`;
}

export async function request({ url, method = 'GET', data, headers = {}, skipAuth = false }) {
  const token = skipAuth ? '' : window.localStorage.getItem('token');
  const finalHeaders = new Headers({ 'Content-Type': 'application/json', ...headers });
  if (token && !skipAuth) {
    finalHeaders.set('Authorization', `Bearer ${token}`);
  }

  let requestUrl = url.startsWith('http') ? url : `${API_BASE_URL}${url}`;
  let body;

  if (method.toUpperCase() === 'GET' && data) {
    requestUrl = buildUrl(requestUrl, data);
  } else if (data !== undefined) {
    body = JSON.stringify(data);
  }

  const response = await fetch(requestUrl, {
    method,
    headers: finalHeaders,
    body
  });

  updateServerTimeOffset(response);

  const contentType = response.headers.get('content-type') || '';
  const isJson = contentType.includes('application/json');
  const payload = isJson ? await response.json() : await response.text();

  if (response.ok) {
    return payload;
  }

  if (response.status === 401) {
    window.localStorage.removeItem('token');
    throw new Error(payload?.message || '未登录或登录已过期');
  }

  const message = payload?.message || `请求失败（${response.status}）`;
  const error = new Error(message);
  error.code = payload?.code || response.status;
  error.payload = payload;
  throw error;
}

export async function upload({ url, file, formData = {}, headers = {} }) {
  if (!(file instanceof File)) {
    throw new Error('无效的上传文件');
  }

  const token = window.localStorage.getItem('token');
  const requestUrl = url.startsWith('http') ? url : `${API_BASE_URL}${url}`;
  const data = new FormData();

  Object.entries(formData).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      data.append(key, value);
    }
  });

  data.append('images', file);

  const finalHeaders = new Headers(headers);
  if (token) {
    finalHeaders.set('Authorization', `Bearer ${token}`);
  }

  const response = await fetch(requestUrl, {
    method: 'POST',
    headers: finalHeaders,
    body: data
  });

  updateServerTimeOffset(response);

  const payload = await response.json();
  if (response.ok) {
    return payload;
  }

  const error = new Error(payload?.message || '上传失败');
  error.code = payload?.code || response.status;
  error.payload = payload;
  throw error;
}
