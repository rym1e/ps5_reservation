import { defineStore } from 'pinia';
import { listOrders, getOrderDetail } from '@/services/orders.api';

export const useOrdersStore = defineStore('orders', {
  state: () => ({
    list: [],
    pagination: {
      page: 1,
      pageSize: 10,
      total: 0
    },
    current: null,
    loading: false
  }),
  actions: {
    async fetchList(params = {}) {
      this.loading = true;
      try {
        const data = await listOrders({
          page: this.pagination.page,
          page_size: this.pagination.pageSize,
          ...params
        });
        this.list = data.items || [];
        this.pagination.total = data.total || this.list.length;
      } finally {
        this.loading = false;
      }
    },
    async fetchDetail(id) {
      this.loading = true;
      try {
        const detail = await getOrderDetail(id);
        this.current = detail;
        return detail;
      } finally {
        this.loading = false;
      }
    }
  }
});
