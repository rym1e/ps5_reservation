import api from './http';

export function fetchSlots(params = { from: 'now', hours: 72 }) {
  return api.get('/api/slots', { params }).then((res) => res.data);
}
