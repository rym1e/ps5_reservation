<template>
  <view class="page">
    <view class="section card">
      <view class="index__header">
        <view class="index__title">选择预约时段</view>
        <text class="index__subtitle">未来 72 小时内，每次预约 1 小时</text>
        <text class="index__tips">请在支付时备注订单号以便快速核验</text>
        <view v-if="hasActiveOrder" class="index__warning">您有未完成的订单，请先完成或取消后再预约。</view>
      </view>
    </view>

    <view class="section">
      <slot-grid :slots="slotsStore.slots" v-model="selectedSlot" @select="handleSlotSelect" />
    </view>

    <view class="index__footer">
      <button
        type="primary"
        class="index__button"
        :disabled="createDisabled"
        :loading="creating"
        @tap="handleCreate"
      >
        {{ createButtonText }}
      </button>
    </view>
  </view>
</template>

<script setup>
import { ref, computed } from 'vue';
import { onLoad } from '@dcloudio/uni-app';
import SlotGrid from '@/components/SlotGrid.vue';
import { useAuthStore } from '@/store/auth.js';
import { useSlotsStore } from '@/store/slots.js';
import { useOrdersStore } from '@/store/orders.js';
import { showError } from '@/utils/toast.js';

const authStore = useAuthStore();
const slotsStore = useSlotsStore();
const ordersStore = useOrdersStore();

const selectedSlot = ref('');
const creating = ref(false);

const hasActiveOrder = computed(() =>
  ordersStore.list.some((order) => ['pending', 'proof_submitted'].includes(order.status))
);

const createDisabled = computed(() => creating.value || !selectedSlot.value || hasActiveOrder.value);

const createButtonText = computed(() => {
  if (hasActiveOrder.value) return '您有未完成订单';
  if (!selectedSlot.value) return '请选择时段';
  return '立即预约';
});

onLoad(async () => {
  const authed = await authStore.ensureAuth();
  if (!authed) return;
  await slotsStore.loadSlots();
  await ordersStore.loadOrders({ reset: true, status: 'pending,proof_submitted' });
});

function handleSlotSelect(slot) {
  if (slot.mine) {
    uni.showToast({ title: '该时段由您占用', icon: 'none' });
  }
}

async function handleCreate() {
  if (createDisabled.value) return;
  creating.value = true;
  try {
    const response = await ordersStore.create(selectedSlot.value);
    const order = response?.order;
    if (!order) {
      showError('创建订单失败');
      return;
    }
    await ordersStore.loadOrders({ reset: true, status: 'pending,proof_submitted' });
    uni.navigateTo({
      url: `/pages/pay/pay?orderId=${order.id}&expireAt=${encodeURIComponent(order.expire_at)}&orderNo=${order.order_no}`
    });
  } catch (error) {
    // error toast handled in store
  } finally {
    creating.value = false;
  }
}
</script>

<style scoped lang="scss">
.page {
  min-height: 100vh;
  background-color: #f6f6f6;
}

.index__header {
  display: flex;
  flex-direction: column;
  gap: 12rpx;
}

.index__title {
  font-size: 36rpx;
  font-weight: 600;
}

.index__subtitle {
  font-size: 28rpx;
  color: #4b5563;
}

.index__tips {
  font-size: 24rpx;
  color: $color-muted;
}

.index__warning {
  margin-top: 16rpx;
  padding: 16rpx;
  background-color: #fef3c7;
  color: #b45309;
  border-radius: 12rpx;
  font-size: 26rpx;
}

.index__footer {
  position: sticky;
  bottom: 0;
  padding: 24rpx 32rpx 48rpx;
}

.index__button {
  height: 96rpx;
  line-height: 96rpx;
  border-radius: 999rpx;
  background-color: $color-primary;
}
</style>
