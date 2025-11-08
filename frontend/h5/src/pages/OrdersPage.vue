<template>
  <div class="card orders">
    <header class="orders__header">
      <div>
        <h2 class="section-title">我的订单</h2>
        <p class="orders__desc">按状态筛选订单，支持查看详情、取消待支付订单或追加凭证。</p>
      </div>
      <select v-model="statusFilter" @change="load" class="orders__filter">
        <option value="">全部状态</option>
        <option value="pending">待支付</option>
        <option value="proof_submitted">待核验</option>
        <option value="paid">已支付</option>
        <option value="rejected">已驳回</option>
        <option value="cancelled">已取消</option>
        <option value="expired">已过期</option>
      </select>
    </header>

    <div v-if="!orders.length && !loading" class="orders__empty">
      <h3>暂无订单</h3>
      <p>前往预约页选择一个时段开始体验。</p>
      <router-link class="primary-btn" to="/">前往预约</router-link>
    </div>

    <div v-else class="orders__list">
      <article v-for="order in orders" :key="order.id" class="orders__item">
        <div class="orders__item-main">
          <div>
            <h3>{{ order.order_no }}</h3>
            <p class="orders__item-slot">{{ formatSlotRange(order.start_time, order.end_time) }}</p>
            <p class="orders__item-time">创建于 {{ formatFullTimestamp(order.created_at) }}</p>
          </div>
          <div class="orders__meta">
            <status-tag :status="order.status" />
            <p class="orders__amount">￥{{ (order.amount / 100).toFixed(2) }}</p>
          </div>
        </div>
        <div class="orders__actions">
          <router-link class="secondary-btn" :to="{ name: 'order-detail', params: { orderId: order.id } }">查看详情</router-link>
          <button
            v-if="order.status === 'pending'"
            class="secondary-btn"
            @click="cancel(order)"
          >
            取消订单
          </button>
          <router-link
            v-if="order.status === 'pending' || order.status === 'proof_submitted'"
            class="primary-btn"
            :to="{ name: 'pay', params: { orderId: order.id } }"
          >
            去支付 / 上传凭证
          </router-link>
        </div>
      </article>
    </div>

    <footer v-if="orders.length" class="orders__pagination">
      <button class="secondary-btn" :disabled="page <= 1" @click="prevPage">上一页</button>
      <span>第 {{ page }} 页 / 共 {{ totalPages }} 页</span>
      <button class="secondary-btn" :disabled="page >= totalPages" @click="nextPage">下一页</button>
    </footer>
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue';
import { useOrdersStore } from '@/stores/orders';
import { cancelOrder } from '@/services/orders';
import StatusTag from '@/components/StatusTag.vue';
import { notifyError, notifySuccess } from '@/utils/notify';
import { formatSlotRange, formatFullTimestamp } from '@/utils/time';

const store = useOrdersStore();

const statusFilter = ref('');
const loading = computed(() => store.loading);
const orders = computed(() => store.items);
const page = computed(() => store.pagination.page);
const totalPages = computed(() => Math.max(1, Math.ceil(store.pagination.total / store.pagination.pageSize)));

async function load() {
  try {
    await store.loadOrders({ status: statusFilter.value || undefined, page: page.value });
  } catch (error) {
    notifyError(error?.response?.data?.message || '加载订单失败');
  }
}

async function cancel(order) {
  if (!confirm(`确定取消订单 ${order.order_no} 吗？`)) return;
  try {
    await cancelOrder(order.id);
    notifySuccess('订单已取消');
    load();
  } catch (error) {
    notifyError(error?.response?.data?.message || '取消失败');
  }
}

function prevPage() {
  if (store.pagination.page <= 1) return;
  store.pagination.page -= 1;
  load();
}

function nextPage() {
  const total = totalPages.value;
  if (store.pagination.page >= total) return;
  store.pagination.page += 1;
  load();
}

onMounted(load);
</script>

<style scoped lang="scss">
@import '@/styles/variables.scss';

.orders {
  display: flex;
  flex-direction: column;
  gap: 32px;
}

.orders__header {
  display: flex;
  justify-content: space-between;
  gap: 24px;
  align-items: center;
}

.orders__desc {
  margin: 0;
  color: $neutral-500;
}

.orders__filter {
  padding: 10px 14px;
  border-radius: $border-radius-md;
  border: 1px solid $neutral-200;
  min-width: 180px;
}

.orders__empty {
  text-align: center;
  display: grid;
  gap: 12px;
}

.orders__list {
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.orders__item {
  border-radius: $border-radius-lg;
  border: 1px solid rgba(148, 163, 184, 0.2);
  background: rgba(255, 255, 255, 0.8);
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  box-shadow: 0 16px 38px rgba(15, 23, 42, 0.08);
}

.orders__item-main {
  display: flex;
  justify-content: space-between;
  gap: 24px;
}

.orders__item-slot,
.orders__item-time {
  margin: 4px 0 0;
  color: $neutral-500;
  font-size: 14px;
}

.orders__meta {
  display: flex;
  flex-direction: column;
  gap: 12px;
  align-items: flex-end;
}

.orders__amount {
  font-size: 20px;
  font-weight: 600;
}

.orders__actions {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.orders__pagination {
  display: flex;
  justify-content: center;
  gap: 16px;
  align-items: center;
  font-weight: 500;
}

@media (max-width: 768px) {
  .orders__header {
    flex-direction: column;
    align-items: flex-start;
  }

  .orders__item-main {
    flex-direction: column;
    align-items: flex-start;
  }

  .orders__meta {
    align-items: flex-start;
  }

  .orders__actions {
    flex-direction: column;
    align-items: stretch;
  }
}
</style>
