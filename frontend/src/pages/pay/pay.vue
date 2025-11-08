<template>
  <scroll-view class="page" scroll-y>
    <view class="page-padding" v-if="order">
      <view class="card order-info">
        <text class="order-info__no">订单号：{{ order.order_no }}</text>
        <text class="order-info__amount">金额：¥{{ (order.amount / 100).toFixed(2) }}</text>
        <text class="order-info__hint">请在备注中填写订单号</text>
      </view>

      <view class="card qr">
        <image class="qr__image" :src="order.pay_qr_url" mode="aspectFit" />
        <view class="qr__countdown" v-if="expireAt">
          <text>支付剩余时间：</text>
          <countdown :expire-at="expireAt" @expire="handleExpire" />
        </view>
      </view>

      <view class="card uploader">
        <text class="uploader__title">上传支付凭证（最多3张）</text>
        <proof-uploader v-model="files" v-model:note-value="note" />
        <button class="uploader__btn" type="primary" :loading="uploading" :disabled="!files.length || uploading" @tap="submit">
          提交凭证
        </button>
      </view>
    </view>
  </scroll-view>
</template>

<script setup>
import { ref } from 'vue';
import { onLoad } from '@dcloudio/uni-app';
import Countdown from '@/components/Countdown.vue';
import ProofUploader from '@/components/ProofUploader.vue';
import { getOrderDetail, uploadProof } from '@/services/orders.api';
import { showToast } from '@/utils/toast';

const order = ref(null);
const expireAt = ref(0);
const files = ref([]);
const note = ref('');
const uploading = ref(false);
let orderId = null;

async function loadDetail() {
  if (!orderId) return;
  const detail = await getOrderDetail(orderId);
  order.value = detail;
  expireAt.value = detail.expire_at ? new Date(detail.expire_at).getTime() : 0;
}

async function submit() {
  if (!orderId || !files.value.length) return;
  uploading.value = true;
  try {
    await uploadProof(orderId, files.value, note.value);
    showToast('提交成功，等待核验', 'success');
    files.value = [];
    note.value = '';
    await loadDetail();
  } catch (error) {
    showToast(error.message || '上传失败');
  } finally {
    uploading.value = false;
  }
}

function handleExpire() {
  showToast('订单已过期');
  uni.showModal({
    title: '提示',
    content: '订单已过期，请重新预约',
    showCancel: false,
    success: () => {
      uni.switchTab({ url: '/pages/index/index' });
    }
  });
}

onLoad((options) => {
  orderId = options.orderId;
  loadDetail();
});
</script>

<style scoped lang="scss">
@import '@/styles/base.scss';
.page {
  min-height: 100vh;
  background: $bg-color;
}

.order-info {
  gap: 16rpx;
  margin-bottom: 24rpx;

  &__no {
    font-size: 32rpx;
  }

  &__amount {
    font-size: 36rpx;
    font-weight: 600;
  }

  &__hint {
    color: $danger-color;
  }
}

.qr {
  @extend .flex-column;
  @extend .flex-center;
  gap: 20rpx;
  margin-bottom: 24rpx;

  &__image {
    width: 400rpx;
    height: 400rpx;
  }

  &__countdown {
    display: flex;
    align-items: center;
    gap: 12rpx;
  }
}

.uploader {
  gap: 24rpx;

  &__title {
    font-weight: 600;
  }

  &__btn {
    margin-top: 12rpx;
  }
}
</style>
