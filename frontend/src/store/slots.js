import { defineStore } from 'pinia';
import { ref } from 'vue';
import { fetchSlots } from '@/services/slots.api.js';
import { alignToNextHour } from '@/utils/time.js';
import { showError } from '@/utils/toast.js';
import { getServerTimestamp } from '@/services/http.js';

export const useSlotsStore = defineStore('slots', () => {
  const slots = ref([]);
  const loading = ref(false);
  const lastFetchedAt = ref(0);

  async function loadSlots() {
    if (loading.value) return;
    loading.value = true;
    try {
      const response = await fetchSlots({ from: 'now', hours: 72 });
      slots.value = response || [];
      lastFetchedAt.value = Date.now();
    } catch (error) {
      showError(error.message || '获取时段失败');
    } finally {
      loading.value = false;
    }
  }

  function getSlotByStartTime(startTime) {
    return slots.value.find((slot) => slot.start_time === startTime);
  }

  function findNextAvailableSlot() {
    const nowAligned = alignToNextHour(getServerTimestamp());
    return slots.value.find((slot) => new Date(slot.start_time).getTime() >= nowAligned && slot.available);
  }

  return {
    slots,
    loading,
    lastFetchedAt,
    loadSlots,
    getSlotByStartTime,
    findNextAvailableSlot
  };
});
