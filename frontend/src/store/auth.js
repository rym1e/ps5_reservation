import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { loginWithWeChatCode } from '@/services/auth.api.js';
import { showError } from '@/utils/toast.js';

function getStoredObject(key) {
  try {
    const value = window.localStorage.getItem(key);
    return value ? JSON.parse(value) : null;
  } catch (error) {
    return null;
  }
}

export const useAuthStore = defineStore('auth', () => {
  const token = ref(window.localStorage.getItem('token') || '');
  const user = ref(getStoredObject('user'));
  const loading = ref(false);

  const isLoggedIn = computed(() => Boolean(token.value));

  function setSession(nextToken, nextUser) {
    token.value = nextToken || '';
    user.value = nextUser || null;
    if (nextToken) {
      window.localStorage.setItem('token', nextToken);
    } else {
      window.localStorage.removeItem('token');
    }
    if (nextUser) {
      window.localStorage.setItem('user', JSON.stringify(nextUser));
    } else {
      window.localStorage.removeItem('user');
    }
  }

  function clearSession() {
    setSession('', null);
  }

  async function login(code) {
    if (loading.value) return;
    loading.value = true;
    try {
      const loginCode = code || import.meta.env.VITE_MOCK_WECHAT_CODE;
      if (!loginCode) {
        throw new Error('缺少登录凭证，请在环境变量中设置 VITE_MOCK_WECHAT_CODE 或传入 code');
      }
      const response = await loginWithWeChatCode(loginCode);
      if (response?.token) {
        setSession(response.token, response.user);
        return response;
      }
      throw new Error('登录失败');
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
