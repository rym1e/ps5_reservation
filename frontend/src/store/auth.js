import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { loginWithWeChatCode } from '@/services/auth.api.js';
import { showError } from '@/utils/toast.js';

function getStoredObject(key) {
  try {
    const value = uni.getStorageSync(key);
    return value ? JSON.parse(value) : null;
  } catch (error) {
    return null;
  }
}

export const useAuthStore = defineStore('auth', () => {
  const token = ref(uni.getStorageSync('token') || '');
  const user = ref(getStoredObject('user'));
  const loading = ref(false);

  const isLoggedIn = computed(() => Boolean(token.value));

  function setSession(nextToken, nextUser) {
    token.value = nextToken;
    user.value = nextUser;
    uni.setStorageSync('token', nextToken || '');
    uni.setStorageSync('user', nextUser ? JSON.stringify(nextUser) : '');
  }

  function clearSession() {
    token.value = '';
    user.value = null;
    uni.removeStorageSync('token');
    uni.removeStorageSync('user');
  }

  async function login() {
    if (loading.value) return;
    loading.value = true;
    try {
      const { code } = await uni.login({ provider: 'weixin' });
      const response = await loginWithWeChatCode(code);
      if (response?.token) {
        setSession(response.token, response.user);
      } else {
        throw new Error('登录失败');
      }
    } catch (error) {
      showError(error.message || '登录失败');
      clearSession();
      throw error;
    } finally {
      loading.value = false;
    }
  }

  async function ensureAuth() {
    if (isLoggedIn.value) return true;
    try {
      await login();
      return true;
    } catch (error) {
      return false;
    }
  }

  return {
    token,
    user,
    loading,
    isLoggedIn,
    login,
    ensureAuth,
    setSession,
    clearSession
  };
});
