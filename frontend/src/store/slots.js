import { defineStore } from 'pinia';
import { fetchSlots } from '@/services/slots.api';

export const useSlotsStore = defineStore('slots', {
  state: () => ({
    slots: [],
    loading: false
  }),
  actions: {
    async load() {
      this.loading = true;
      try {
        const data = await fetchSlots();
        this.slots = data;
      } finally {
        this.loading = false;
      }
    }
  }
});
