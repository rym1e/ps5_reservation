import { request } from './http';

export function fetchSlots() {
  return request({
    url: '/api/slots?from=now&hours=72',
    method: 'GET'
  });
}
