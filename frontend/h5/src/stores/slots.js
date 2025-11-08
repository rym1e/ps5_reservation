import { defineStore } from 'pinia';
import { ref } from 'vue';
import { fetchSlots } from '@/services/slots';

export const useSlotsStore = defineStore('slots', () => {
  const slots = ref([]);
  const loading = ref(false);
  const lastFetched = ref(null);

  async function loadSlots() {
    loading.value = true;
    try {
      const data = await fetchSlots();
      slots.value = data;
      lastFetched.value = Date.now();
    } finally {
      loading.value = false;
    }
  }

  return { slots, loading, lastFetched, loadSlots };
});
