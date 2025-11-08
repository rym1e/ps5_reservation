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
  const params = {};
  if (status) params.status = status;
  params.page = page;
  params.page_size = pageSize;
  return request({
    url: '/api/orders',
    method: 'GET',
    data: params
  });
}

export function fetchOrderDetail(orderId) {
  return request({
    url: `/api/orders/${orderId}`,
    method: 'GET'
  });
}

export function uploadPaymentProof(orderId, file, note = '') {
  return upload({
    url: `/api/orders/${orderId}/proofs`,
    file,
    formData: { note }
  });
}
