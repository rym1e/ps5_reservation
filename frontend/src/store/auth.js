import { defineStore } from 'pinia';
import { loginByCode } from '@/services/auth.api';

const STORAGE_KEY = 'ps5_token';
const USER_KEY = 'ps5_user';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: uni.getStorageSync(STORAGE_KEY) || '',
    user: uni.getStorageSync(USER_KEY) || null,
    loading: false
  }),
  actions: {
    async ensureLogin() {
      if (this.token) {
        return this.user;
      }
      this.loading = true;
      try {
        const { code } = await uni.login({ provider: 'weixin' });
        const data = await loginByCode(code);
        this.setSession(data.token, data.user);
        return data.user;
      } finally {
        this.loading = false;
      }
    },
    setSession(token, user) {
      this.token = token;
      this.user = user;
      uni.setStorageSync(STORAGE_KEY, token);
      uni.setStorageSync(USER_KEY, user);
    },
    logout() {
      this.token = '';
      this.user = null;
      uni.removeStorageSync(STORAGE_KEY);
      uni.removeStorageSync(USER_KEY);
    }
  }
});
