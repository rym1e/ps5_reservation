import api from './http';

export function loginWithCode(code) {
  return api.post('/api/auth/wechat/login', { code }).then((res) => res.data);
}
