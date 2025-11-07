<template>
  <view class="page" v-if="order">
    <view class="section card">
      <view class="detail__header">
        <view>
          <view class="detail__order-no">订单号：{{ order.order_no }}</view>
          <view class="detail__time">创建时间：{{ order.created_at }}</view>
        </view>
        <status-tag :status="order.status" />
      </view>
    </view>

    <view class="section card">
      <view class="detail__block-title">预约信息</view>
      <view class="detail__row">
        <text class="detail__label">时段</text>
        <text class="detail__value">{{ formatSlot(order.start_time, order.end_time) }}</text>
      </view>
      <view class="detail__row">
        <text class="detail__label">金额</text>
        <text class="detail__value">¥{{ (order.amount / 100).toFixed(2) }}</text>
      </view>
      <view class="detail__row">
        <text class="detail__label">支付截止</text>
        <text class="detail__value">{{ order.expire_at }}</text>
      </view>
    </view>

    <view class="section card">
      <view class="detail__block-title">支付凭证</view>
      <view class="detail__proofs">
        <image
          v-for="proof in order.proofs || []"
          :key="proof.image_url"
          class="detail__proof"
          :src="proof.image_url"
          mode="aspectFill"
        />
      </view>
      <button v-if="order.status === 'pending'" type="primary" @tap="goPay">去支付</button>
      <button v-else-if="order.status === 'proof_submitted'" type="primary" @tap="goPay">追加凭证</button>
    </view>

    <view class="section card" v-if="order.status === 'pending'">
      <button type="warn" @tap="handleCancel">取消订单</button>
    </view>
  </view>
</template>

<script setup>
import { computed } from 'vue';
import { onLoad } from '@dcloudio/uni-app';
import StatusTag from '@/components/StatusTag.vue';
import { useOrdersStore } from '@/store/orders.js';
import { formatSlotRange } from '@/utils/time.js';

const ordersStore = useOrdersStore();
const order = computed(() => ordersStore.current);
let orderId = null;

onLoad(async (options) => {
  orderId = Number(options?.id);
  if (!orderId) return;
  await ordersStore.loadOrderDetail(orderId);
});

function formatSlot(start, end) {
  return formatSlotRange(start, end);
}

function goPay() {
  uni.navigateTo({ url: `/pages/pay/pay?orderId=${order.value.id}` });
}

async function handleCancel() {
  const confirm = await showConfirm('确定要取消该订单吗？');
  if (!confirm) return;
  try {
    await ordersStore.cancel(order.value.id);
    await ordersStore.loadOrderDetail(order.value.id);
  } catch (error) {
    // toast handled in store
  }
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

.detail__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.detail__order-no {
  font-size: 32rpx;
  font-weight: 600;
}

.detail__time {
  font-size: 26rpx;
  color: #6b7280;
  margin-top: 8rpx;
}

.detail__block-title {
  font-size: 30rpx;
  font-weight: 600;
  margin-bottom: 24rpx;
}

.detail__row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 16rpx;
  font-size: 28rpx;
}

.detail__label {
  color: #6b7280;
}

.detail__value {
  color: #111827;
}

.detail__proofs {
  display: flex;
  gap: 16rpx;
  margin-bottom: 24rpx;
}

.detail__proof {
  width: 200rpx;
  height: 200rpx;
  border-radius: 16rpx;
  background-color: #f3f4f6;
}
</style>
