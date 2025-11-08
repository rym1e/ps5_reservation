import { request } from './http';
import { useAuthStore } from '@/store/auth';

export function createReservation(startTime) {
  return request({
    url: '/api/reservations',
    method: 'POST',
    data: { start_time: startTime }
  });
}

export function cancelOrder(id) {
  return request({
    url: `/api/orders/${id}/cancel`,
    method: 'POST'
  });
}

export function uploadProof(id, files, note) {
  const auth = useAuthStore();
  const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';
  return new Promise((resolve, reject) => {
    uni.uploadFile({
      url: `${baseURL}/api/orders/${id}/proofs`,
      files: files.map((file, index) => ({
        name: `images[${index}]`,
        uri: file.tempFilePath || file.path || file.url
      })),
      formData: note ? { note } : {},
      header: {
        Authorization: auth.token ? `Bearer ${auth.token}` : ''
      },
      success: (res) => {
        if (res.statusCode >= 400) {
          reject(new Error(res.data || '上传失败'));
          return;
        }
        try {
          const data = JSON.parse(res.data);
          resolve(data);
        } catch (error) {
          resolve(res.data);
        }
      },
      fail: reject
    });
  });
}

function buildQuery(params = {}) {
  return Object.keys(params)
    .filter((key) => params[key] !== undefined && params[key] !== null && params[key] !== '')
    .map((key) => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
    .join('&');
}

export function listOrders(params = {}) {
  const query = buildQuery(params);
  const suffix = query ? `?${query}` : '';
  return request({
    url: `/api/orders${suffix}`,
    method: 'GET'
  });
}

export function getOrderDetail(id) {
  return request({
    url: `/api/orders/${id}`,
    method: 'GET'
  });
}
