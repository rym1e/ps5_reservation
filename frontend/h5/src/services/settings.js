import api from './http';

export function fetchSettings() {
  return api.get('/api/settings').then((res) => res.data);
}
