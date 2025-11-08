import { request } from './http';

export function fetchSettings() {
  return request({
    url: '/api/admin/settings',
    method: 'GET'
  });
}
