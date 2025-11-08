import { request } from './http';

export function loginByCode(code) {
  return request({
    url: '/api/auth/wechat/login',
    method: 'POST',
    data: { code }
  });
}
