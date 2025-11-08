import api from './http';

export function createReservation(startTime) {
  return api.post('/api/reservations', { start_time: startTime }).then((res) => res.data);
}

export function fetchOrders(params) {
  return api.get('/api/orders', { params }).then((res) => res.data);
}

export function fetchOrderDetail(id) {
  return api.get(`/api/orders/${id}`).then((res) => res.data);
}

export function cancelOrder(id) {
  return api.post(`/api/orders/${id}/cancel`).then((res) => res.data);
}

export function uploadProof(id, { files, note }) {
  const formData = new FormData();
  files.forEach((file) => formData.append('images[]', file));
  if (note) {
    formData.append('note', note);
  }
  return api.post(`/api/orders/${id}/proofs`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }).then((res) => res.data);
}
