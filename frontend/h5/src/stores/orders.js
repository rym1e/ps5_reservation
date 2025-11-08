import { defineStore } from 'pinia';
import { ref } from 'vue';
import { fetchOrders, fetchOrderDetail } from '@/services/orders';

export const useOrdersStore = defineStore('orders', () => {
  const items = ref([]);
  const pagination = ref({ page: 1, pageSize: 10, total: 0 });
  const loading = ref(false);
  const current = ref(null);

  async function loadOrders(params = {}) {
    loading.value = true;
    try {
      const data = await fetchOrders({ page: pagination.value.page, page_size: pagination.value.pageSize, ...params });
      items.value = data.items;
      pagination.value = {
        page: data.page,
        pageSize: data.page_size,
        total: data.total
      };
      return data;
    } finally {
      loading.value = false;
    }
  }

  async function loadOrderDetail(id) {
    const data = await fetchOrderDetail(id);
    current.value = data;
    return data;
  }

  return { items, pagination, loading, current, loadOrders, loadOrderDetail };
});
