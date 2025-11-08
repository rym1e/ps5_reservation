import { defineStore } from 'pinia';
import { ref } from 'vue';
import { loginWithCode } from '@/services/auth';

const TOKEN_KEY = 'ps5_token';
const USER_KEY = 'ps5_user';

export const useAuthStore = defineStore('auth', () => {
  const token = ref(localStorage.getItem(TOKEN_KEY) || '');
  const user = ref(localStorage.getItem(USER_KEY) ? JSON.parse(localStorage.getItem(USER_KEY)) : null);
  const loading = ref(false);

  async function login(code) {
    loading.value = true;
    try {
      const data = await loginWithCode(code);
      token.value = data.token;
      user.value = data.user;
      localStorage.setItem(TOKEN_KEY, token.value);
      localStorage.setItem(USER_KEY, JSON.stringify(user.value));
      return data.user;
    } finally {
      loading.value = false;
    }
  }

  function logout() {
    token.value = '';
    user.value = null;
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  }

  return { token, user, loading, login, logout };
});
