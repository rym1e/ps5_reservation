import { request } from './http.js';

export function loginWithWeChatCode(code) {
  return request({
    url: '/api/auth/wechat/login',
    method: 'POST',
    data: { code },
    skipAuth: true
  });
}
