<template>
  <view class="page">
    <view v-if="order" class="section card">
      <view class="pay__section">
        <view class="pay__label">订单号</view>
        <view class="pay__value pay__value--row">
          <text>{{ order.order_no }}</text>
          <button class="pay__copy" size="mini" @tap="copyOrderNo">复制</button>
        </view>
      </view>
      <view class="pay__section">
        <view class="pay__label">金额</view>
        <view class="pay__value pay__amount">¥{{ (order.amount / 100).toFixed(2) }}</view>
      </view>
      <view class="pay__section">
        <view class="pay__label">请在转账备注填写订单号</view>
        <countdown :expire-at="order.expire_at" @expire="handleExpire" />
      </view>
    </view>

    <view v-if="order" class="section card">
      <view class="pay__label">收款二维码</view>
      <image class="pay__qr" :src="order.pay_qr_url" mode="aspectFit" />
    </view>

    <view v-if="order" class="section card">
      <view class="pay__label">上传支付凭证</view>
      <input
        class="pay__input"
        type="text"
        placeholder="可填写付款备注/流水号"
        v-model="note"
      />
      <proof-uploader :proofs="proofs" @upload="handleUpload" @remove="handleRemove" />
    </view>
  </view>
</template>

<script setup>
import { ref, computed } from 'vue';
import { onLoad } from '@dcloudio/uni-app';
import Countdown from '@/components/Countdown.vue';
import ProofUploader from '@/components/ProofUploader.vue';
import { useOrdersStore } from '@/store/orders.js';
import { showError, showSuccess } from '@/utils/toast.js';

const ordersStore = useOrdersStore();

const orderId = ref(null);
const note = ref('');
const proofs = ref([]);
const order = computed(() => ordersStore.current);

onLoad(async (options) => {
  if (!options?.orderId) {
    showError('缺少订单参数');
    return;
  }
  orderId.value = Number(options.orderId);
  await fetchDetail();
});

async function fetchDetail() {
  if (!orderId.value) return;
  await ordersStore.loadOrderDetail(orderId.value);
  proofs.value = (order.value?.proofs || []).map((item) => ({ image_url: item.image_url }));
}

async function handleUpload(filePath) {
  if (!orderId.value) return;
  try {
    await ordersStore.appendProof(orderId.value, filePath, note.value);
    await fetchDetail();
  } catch (error) {
    // toast handled in store
  }
}

function handleRemove() {
  showError('暂不支持删除凭证');
}

function handleExpire() {
  showError('订单已过期，请重新预约');
  setTimeout(() => {
    uni.switchTab({ url: '/pages/index/index' });
  }, 1200);
}

function copyOrderNo() {
  if (!order.value?.order_no) return;
  uni.setClipboardData({
    data: order.value.order_no,
    success: () => showSuccess('已复制订单号')
  });
}
</script>

<style scoped lang="scss">
.page {
  min-height: 100vh;
  background-color: #f6f6f6;
}

.pay__section {
  margin-bottom: 24rpx;
}

.pay__label {
  font-size: 28rpx;
  color: #111827;
  margin-bottom: 12rpx;
}

.pay__value {
  font-size: 32rpx;
  color: #1f2937;
}

.pay__value--row {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.pay__amount {
  font-weight: 600;
}

.pay__copy {
  margin-left: 16rpx;
}

.pay__qr {
  width: 100%;
  height: 400rpx;
  border-radius: 16rpx;
  background-color: #f3f4f6;
}

.pay__input {
  border: 1px solid #e5e7eb;
  border-radius: 12rpx;
  padding: 16rpx 24rpx;
  margin-bottom: 24rpx;
  font-size: 28rpx;
}
</style>
