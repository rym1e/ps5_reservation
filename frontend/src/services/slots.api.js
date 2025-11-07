import { request } from './http.js';

export function fetchSlots({ from = 'now', hours = 72 } = {}) {
  return request({
    url: `/api/slots?from=${from}&hours=${hours}`,
    method: 'GET'
  });
}
