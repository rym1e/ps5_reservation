import { request, upload } from './http.js';

export function createReservation(startTime) {
  return request({
    url: '/api/reservations',
    method: 'POST',
    data: { start_time: startTime }
  });
}

export function cancelOrder(orderId) {
  return request({
    url: `/api/orders/${orderId}/cancel`,
    method: 'POST'
  });
}

export function fetchOrders({ status, page = 1, pageSize = 10 } = {}) {
  const params = new URLSearchParams();
  if (status) params.append('status', status);
  params.append('page', page);
  params.append('page_size', pageSize);
  return request({
    url: `/api/orders?${params.toString()}`,
    method: 'GET'
  });
}

export function fetchOrderDetail(orderId) {
  return request({
    url: `/api/orders/${orderId}`,
    method: 'GET'
  });
}

export function uploadPaymentProof(orderId, filePath, note = '') {
  return upload({
    url: `/api/orders/${orderId}/proofs`,
    filePath,
    name: 'images',
    formData: { note }
  });
}
