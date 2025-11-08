import { request } from './http.js';

export function fetchSlots({ from = 'now', hours = 72 } = {}) {
  return request({
    url: '/api/slots',
    method: 'GET',
    data: { from, hours }
  });
}
