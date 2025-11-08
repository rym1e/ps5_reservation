import { defineStore } from 'pinia';
import { ref, reactive } from 'vue';
import { fetchOrders, fetchOrderDetail, cancelOrder, uploadPaymentProof, createReservation } from '@/services/orders.api.js';
import { showError, showSuccess } from '@/utils/toast.js';

export const useOrdersStore = defineStore('orders', () => {
  const list = ref([]);
  const pagination = reactive({
    page: 1,
    pageSize: 10,
    hasMore: true,
    status: ''
  });
  const current = ref(null);
  const loading = ref(false);

  async function loadOrders({ reset = false, status = '' } = {}) {
    if (loading.value) return;
    loading.value = true;
    try {
      if (reset) {
        pagination.page = 1;
        pagination.hasMore = true;
        pagination.status = status;
        list.value = [];
      }
      if (!pagination.hasMore) return;
      const response = await fetchOrders({
        status: pagination.status || status,
        page: pagination.page,
        pageSize: pagination.pageSize
      });
      const items = Array.isArray(response) ? response : response?.items || response?.list || [];
      if (reset) {
        list.value = items;
      } else {
        list.value = list.value.concat(items);
      }
      pagination.hasMore = items.length >= pagination.pageSize;
      pagination.page += 1;
    } catch (error) {
      showError(error.message || '获取订单失败');
    } finally {
      loading.value = false;
    }
  }

  async function loadOrderDetail(orderId) {
    try {
      const response = await fetchOrderDetail(orderId);
      current.value = response;
    } catch (error) {
      showError(error.message || '获取订单详情失败');
      throw error;
    }
  }

  async function cancel(orderId) {
    try {
      await cancelOrder(orderId);
      showSuccess('已取消订单');
      list.value = list.value.map((item) => (item.id === orderId ? { ...item, status: 'cancelled' } : item));
      if (current.value?.id === orderId) {
        current.value = { ...current.value, status: 'cancelled' };
      }
    } catch (error) {
      showError(error.message || '取消失败');
      throw error;
    }
  }

  async function appendProof(orderId, file, note) {
    try {
      const response = await uploadPaymentProof(orderId, file, note);
      showSuccess('上传成功');
      if (current.value?.id === orderId) {
        current.value = { ...current.value, status: response?.status || 'proof_submitted' };
      }
      list.value = list.value.map((item) =>
        item.id === orderId ? { ...item, status: response?.status || 'proof_submitted' } : item
      );
    } catch (error) {
      showError(error.message || '上传失败');
      throw error;
    }
  }

  async function create(startTime) {
    try {
      return await createReservation(startTime);
    } catch (error) {
      showError(error.message || '创建预约失败');
      throw error;
    }
  }

  return {
    list,
    pagination,
    current,
    loading,
    loadOrders,
    loadOrderDetail,
    cancel,
    appendProof,
    create
  };
});
