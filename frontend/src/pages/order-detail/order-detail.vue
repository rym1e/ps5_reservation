<template>
  <scroll-view class="page" scroll-y>
    <view class="page-padding" v-if="detail">
      <view class="card header">
        <view class="header__top">
          <text class="header__no">订单号：{{ detail.order_no }}</text>
          <status-tag :status="detail.status" />
        </view>
        <text>创建时间：{{ formatDateTime(detail.created_at) }}</text>
        <text>金额：¥{{ (detail.amount / 100).toFixed(2) }}</text>
      </view>

      <view class="card section">
        <text class="section__title">预约信息</text>
        <text>时段：{{ formatDateTime(detail.start_time, 'MM-DD HH:mm') }} - {{ formatDateTime(detail.end_time, 'HH:mm') }}</text>
        <text>状态：{{ reservationStatus }}</text>
      </view>

      <view class="card section">
        <text class="section__title">支付信息</text>
        <text>订单状态：{{ statusText(detail.status) }}</text>
        <text v-if="detail.expire_at">支付截止：{{ formatDateTime(detail.expire_at) }}</text>
      </view>

      <view class="card section">
        <text class="section__title">支付凭证</text>
        <view class="proofs" v-if="detail.proofs && detail.proofs.length">
          <image
            v-for="item in detail.proofs"
            :key="item.image_url"
            class="proofs__image"
            :src="item.image_url"
            mode="aspectFill"
            @tap="preview(item.image_url)"
          />
        </view>
        <text v-else class="text-sub">暂无凭证</text>
      </view>

      <view class="actions">
        <button
          v-if="detail.status === 'pending'"
          type="warn"
          :loading="actionLoading"
          @tap="cancel"
        >取消订单</button>
        <button
          v-if="detail.status === 'pending' || detail.status === 'rejected'"
          type="primary"
          @tap="toPay"
        >去支付</button>
        <button
          v-if="detail.status === 'proof_submitted'"
          type="primary"
          @tap="toPay"
        >追加凭证</button>
      </view>
    </view>
  </scroll-view>
</template>

<script setup>
import { ref } from 'vue';
import { onLoad } from '@dcloudio/uni-app';
import StatusTag from '@/components/StatusTag.vue';
import { formatDateTime } from '@/utils/time';
import { getOrderDetail, cancelOrder } from '@/services/orders.api';
import { showToast } from '@/utils/toast';

const detail = ref(null);
const actionLoading = ref(false);
let orderId = null;

const statusMap = {
  pending: '待支付',
  proof_submitted: '待核验',
  paid: '已确认',
  rejected: '已驳回',
  cancelled: '已取消',
  expired: '已过期'
};

const reservationStatus = ref('');

function statusText(status) {
  return statusMap[status] || status;
}

async function loadDetail() {
  if (!orderId) return;
  const data = await getOrderDetail(orderId);
  detail.value = data;
  reservationStatus.value = data.reservation_status || statusText(data.status);
}

async function cancel() {
  if (!orderId) return;
  actionLoading.value = true;
  try {
    await cancelOrder(orderId);
    showToast('已取消');
    await loadDetail();
  } catch (error) {
    showToast(error.message || '取消失败');
  } finally {
    actionLoading.value = false;
  }
}

function preview(url) {
  uni.previewImage({ urls: [url] });
}

function toPay() {
  uni.navigateTo({ url: `/pages/pay/pay?orderId=${orderId}` });
}

onLoad((options) => {
  orderId = options.id;
  loadDetail();
});
</script>

<style scoped lang="scss">
@import '@/styles/base.scss';
.page {
  min-height: 100vh;
  background: $bg-color;
}

.header {
  gap: 16rpx;
  margin-bottom: 24rpx;

  &__top {
    display: flex;
    justify-content: space-between;
  }

  &__no {
    font-weight: 600;
  }
}

.section {
  margin-bottom: 24rpx;
  gap: 12rpx;

  &__title {
    font-weight: 600;
    font-size: 32rpx;
  }
}

.proofs {
  display: flex;
  gap: 16rpx;
  flex-wrap: wrap;

  &__image {
    width: 200rpx;
    height: 200rpx;
    border-radius: 12rpx;
  }
}

.actions {
  display: flex;
  flex-direction: column;
  gap: 20rpx;
  margin-bottom: 40rpx;
}
</style>
