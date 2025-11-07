<template>
  <view class="page">
    <scroll-view scroll-y class="orders__scroll" @scrolltolower="handleReachBottom">
      <view class="section card orders__filters">
        <view
          v-for="tab in statusTabs"
          :key="tab.value"
          :class="['orders__tab', tab.value === activeStatus ? 'orders__tab--active' : '']"
          @tap="() => changeStatus(tab.value)"
        >
          {{ tab.label }}
        </view>
      </view>

      <view class="section" v-if="ordersStore.list.length">
        <view v-for="order in ordersStore.list" :key="order.id" class="orders__item card">
          <view class="orders__item-header">
            <view class="orders__order-no">订单号：{{ order.order_no }}</view>
            <status-tag :status="order.status" />
          </view>
          <view class="orders__row">
            <text class="orders__label">时段</text>
            <text class="orders__value">{{ formatSlot(order.start_time, order.end_time) }}</text>
          </view>
          <view class="orders__row">
            <text class="orders__label">金额</text>
            <text class="orders__value">¥{{ (order.amount / 100).toFixed(2) }}</text>
          </view>
          <view class="orders__footer">
            <button size="mini" @tap="() => goDetail(order.id)">查看详情</button>
            <button
              v-if="order.status === 'pending'"
              size="mini"
              type="warn"
              @tap="() => handleCancel(order)"
            >
              取消订单
            </button>
            <button
              v-else-if="order.status === 'proof_submitted'"
              size="mini"
              type="primary"
              @tap="() => goPay(order)"
            >
              追加凭证
            </button>
          </view>
        </view>
      </view>

      <empty-state v-else text="暂无订单" />
    </scroll-view>
  </view>
</template>

<script setup>
import { ref } from 'vue';
import { onLoad } from '@dcloudio/uni-app';
import StatusTag from '@/components/StatusTag.vue';
import EmptyState from '@/components/EmptyState.vue';
import { useOrdersStore } from '@/store/orders.js';
import { formatSlotRange } from '@/utils/time.js';

const ordersStore = useOrdersStore();

const statusTabs = [
  { label: '全部', value: '' },
  { label: '待支付', value: 'pending' },
  { label: '待核验', value: 'proof_submitted' },
  { label: '已确认', value: 'paid' },
  { label: '已取消/过期', value: 'cancelled,expired' }
];

const activeStatus = ref('');

onLoad(async () => {
  await refreshList('');
});

function handleReachBottom() {
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
  uni.navigateTo({ url: `/pages/order-detail/order-detail?id=${orderId}` });
}

function goPay(order) {
  uni.navigateTo({ url: `/pages/pay/pay?orderId=${order.id}` });
}

async function handleCancel(order) {
  const confirm = await showConfirm('确定要取消该订单吗？');
  if (!confirm) return;
  try {
    await ordersStore.cancel(order.id);
  } catch (error) {
    // toast handled in store
  }
}

function formatSlot(start, end) {
  return formatSlotRange(start, end);
}

function showConfirm(content) {
  return new Promise((resolve) => {
    uni.showModal({
      title: '提示',
      content,
      success: (res) => resolve(res.confirm)
    });
  });
}
</script>

<style scoped lang="scss">
.page {
  min-height: 100vh;
  background-color: #f6f6f6;
}

.orders__scroll {
  height: 100vh;
}

.orders__filters {
  display: flex;
  gap: 16rpx;
}

.orders__tab {
  padding: 16rpx 24rpx;
  border-radius: 999rpx;
  background-color: #e5e7eb;
  font-size: 26rpx;
  color: #4b5563;
}

.orders__tab--active {
  background-color: $color-primary;
  color: #ffffff;
}

.orders__item {
  margin-bottom: 24rpx;
}

.orders__item-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16rpx;
}

.orders__order-no {
  font-size: 28rpx;
  color: #111827;
}

.orders__row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 12rpx;
  font-size: 26rpx;
}

.orders__label {
  color: #6b7280;
}

.orders__value {
  color: #111827;
}

.orders__footer {
  display: flex;
  gap: 16rpx;
  justify-content: flex-end;
  margin-top: 16rpx;
}
</style>
