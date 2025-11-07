import { request } from './http.js';

export function fetchSettings() {
  return request({
    url: '/api/admin/settings',
    method: 'GET'
  });
}
