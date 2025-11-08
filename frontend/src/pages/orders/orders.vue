<template>
  <view class="page">
    <view class="tabs">
      <view
        v-for="tab in tabs"
        :key="tab.value"
        class="tabs__item"
        :class="{ 'tabs__item--active': currentStatus === tab.value }"
        @tap="changeStatus(tab.value)"
      >
        <text>{{ tab.label }}</text>
      </view>
    </view>

    <scroll-view scroll-y class="list">
      <view v-if="!ordersStore.list.length && !ordersStore.loading" class="page-padding">
        <empty-state text="暂无订单" />
      </view>
      <view v-else class="page-padding">
        <view v-for="item in ordersStore.list" :key="item.id" class="card order">
          <view class="order__header">
            <text class="order__no">{{ item.order_no }}</text>
            <status-tag :status="item.status" />
          </view>
          <view class="order__body">
            <text>时段：{{ formatDateTime(item.start_time, 'MM-DD HH:mm') }} - {{ formatDateTime(item.end_time, 'HH:mm') }}</text>
            <text>金额：¥{{ (item.amount / 100).toFixed(2) }}</text>
            <text>创建时间：{{ formatDateTime(item.created_at) }}</text>
          </view>
          <view class="order__actions">
            <button size="mini" @tap="goDetail(item.id)">查看详情</button>
            <button
              v-if="item.status === 'pending'"
              size="mini"
              type="warn"
              @tap="cancel(item.id)"
            >取消订单</button>
            <button
              v-if="item.status === 'pending' || item.status === 'rejected'"
              size="mini"
              type="primary"
              @tap="toPay(item.id)"
            >去支付</button>
            <button
              v-if="item.status === 'proof_submitted'"
              size="mini"
              type="primary"
              @tap="toPay(item.id)"
            >追加凭证</button>
          </view>
        </view>
      </view>
    </scroll-view>
  </view>
</template>

<script setup>
import { ref } from 'vue';
import { onShow } from '@dcloudio/uni-app';
import EmptyState from '@/components/EmptyState.vue';
import StatusTag from '@/components/StatusTag.vue';
import { useOrdersStore } from '@/store/orders';
import { cancelOrder } from '@/services/orders.api';
import { formatDateTime } from '@/utils/time';
import { showToast } from '@/utils/toast';

const tabs = [
  { label: '全部', value: 'all' },
  { label: '待支付', value: 'pending' },
  { label: '待核验', value: 'proof_submitted' },
  { label: '已确认', value: 'paid' }
];

const ordersStore = useOrdersStore();
const currentStatus = ref('all');

function changeStatus(value) {
  currentStatus.value = value;
  loadOrders();
}

async function loadOrders() {
  const status = currentStatus.value === 'all' ? undefined : currentStatus.value;
  await ordersStore.fetchList(status ? { status } : {});
}

async function cancel(id) {
  try {
    await cancelOrder(id);
    showToast('已取消');
    loadOrders();
  } catch (error) {
    showToast(error.message || '取消失败');
  }
}

function goDetail(id) {
  uni.navigateTo({ url: `/pages/order-detail/order-detail?id=${id}` });
}

function toPay(id) {
  uni.navigateTo({ url: `/pages/pay/pay?orderId=${id}` });
}

onShow(() => {
  loadOrders();
});
</script>

<style scoped lang="scss">
@import '@/styles/base.scss';
.page {
  display: flex;
  flex-direction: column;
  height: 100vh;
}

.tabs {
  display: flex;
  background: #fff;
  border-bottom: 1rpx solid #eee;

  &__item {
    flex: 1;
    text-align: center;
    padding: 24rpx 0;
    font-size: 28rpx;
    color: $sub-text-color;

    &--active {
      color: $primary-color;
      font-weight: 600;
      position: relative;

      &::after {
        content: '';
        position: absolute;
        bottom: 0;
        left: 25%;
        width: 50%;
        height: 6rpx;
        border-radius: 3rpx;
        background: $primary-color;
      }
    }
  }
}

.list {
  flex: 1;
  background: $bg-color;
}

.order {
  margin-bottom: 24rpx;
  display: flex;
  flex-direction: column;
  gap: 16rpx;

  &__header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  &__no {
    font-weight: 600;
  }

  &__body {
    display: flex;
    flex-direction: column;
    gap: 8rpx;
    color: $sub-text-color;
  }

  &__actions {
    display: flex;
    flex-wrap: wrap;
    gap: 16rpx;
  }
}
</style>
