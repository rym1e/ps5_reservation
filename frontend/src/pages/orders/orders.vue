<template>
  <div class="orders-page">
    <div class="section card orders__filters">
      <button
        v-for="tab in statusTabs"
        :key="tab.value"
        type="button"
        :class="['orders__tab', tab.value === activeStatus ? 'orders__tab--active' : '']"
        @click="() => changeStatus(tab.value)"
      >
        {{ tab.label }}
      </button>
    </div>

    <div class="section" v-if="ordersStore.list.length">
      <div v-for="order in ordersStore.list" :key="order.id" class="orders__item card">
        <div class="orders__item-header">
          <div class="orders__order-no">订单号：{{ order.order_no }}</div>
          <status-tag :status="order.status" />
        </div>
        <div class="orders__row">
          <span class="orders__label">时段</span>
          <span class="orders__value">{{ formatSlot(order.start_time, order.end_time) }}</span>
        </div>
        <div class="orders__row">
          <span class="orders__label">金额</span>
          <span class="orders__value">¥{{ (order.amount / 100).toFixed(2) }}</span>
        </div>
        <div class="orders__footer">
          <button type="button" @click="() => goDetail(order.id)">查看详情</button>
          <button
            v-if="order.status === 'pending'"
            type="button"
            class="orders__button--warn"
            @click="() => handleCancel(order)"
          >
            取消订单
          </button>
          <button
            v-else-if="order.status === 'proof_submitted'"
            type="button"
            class="orders__button--primary"
            @click="() => goPay(order)"
          >
            追加凭证
          </button>
        </div>
      </div>
    </div>

    <empty-state v-else text="暂无订单" />

    <div class="orders__load-more" v-if="ordersStore.pagination.hasMore">
      <button type="button" @click="loadMore">加载更多</button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import StatusTag from '@/components/StatusTag.vue';
import EmptyState from '@/components/EmptyState.vue';
import { useOrdersStore } from '@/store/orders.js';
import { formatSlotRange } from '@/utils/time.js';

const router = useRouter();
const ordersStore = useOrdersStore();

const statusTabs = [
  { label: '全部', value: '' },
  { label: '待支付', value: 'pending' },
  { label: '待核验', value: 'proof_submitted' },
  { label: '已确认', value: 'paid' },
  { label: '已取消/过期', value: 'cancelled,expired' }
];

const activeStatus = ref('');

onMounted(async () => {
  await refreshList('');
});

function loadMore() {
  ordersStore.loadOrders();
}

async function refreshList(status) {
  activeStatus.value = status;
  await ordersStore.loadOrders({ reset: true, status });
}

function changeStatus(status) {
  refreshList(status);
}

function goDetail(orderId) {
  router.push({ name: 'order-detail', params: { orderId } });
}

function goPay(order) {
  router.push({ name: 'pay', params: { orderId: order.id } });
}

async function handleCancel(order) {
  const confirm = window.confirm('确定要取消该订单吗？');
  if (!confirm) return;
  try {
    await ordersStore.cancel(order.id);
  } catch (error) {
    // 错误提示在 store 中处理
  }
}

function formatSlot(start, end) {
  return formatSlotRange(start, end);
}
</script>

<style scoped lang="scss">
.orders-page {
  min-height: 100vh;
  background-color: #f6f6f6;
  padding-bottom: 24px;
}

.orders__filters {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.orders__tab {
  padding: 6px 12px;
  border-radius: 999px;
  border: none;
  background-color: #e5e7eb;
  font-size: 13px;
  color: #4b5563;
}

.orders__tab--active {
  background-color: $color-primary;
  color: #ffffff;
}

.orders__item {
  margin-bottom: 12px;
}

.orders__item-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.orders__order-no {
  font-size: 14px;
  color: #111827;
}

.orders__row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 6px;
  font-size: 13px;
}

.orders__label {
  color: #6b7280;
}

.orders__value {
  color: #111827;
}

.orders__footer {
  display: flex;
  gap: 8px;
  justify-content: flex-end;
  margin-top: 8px;
}

.orders__footer button {
  border: none;
  border-radius: 16px;
  padding: 6px 12px;
  font-size: 12px;
}

.orders__button--warn {
  background-color: $color-danger;
  color: #ffffff;
}

.orders__button--primary {
  background-color: $color-primary;
  color: #ffffff;
}

.orders__load-more {
  display: flex;
  justify-content: center;
  margin: 16px 0;
}

.orders__load-more button {
  border: none;
  padding: 8px 16px;
  border-radius: 999px;
  background-color: $color-primary;
  color: #ffffff;
}
</style>
