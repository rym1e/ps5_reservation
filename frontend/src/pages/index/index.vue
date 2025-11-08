<template>
  <scroll-view class="page" scroll-y>
    <view class="page-padding">
      <view class="card intro">
        <text class="intro__title">请选择预约时段</text>
        <text class="intro__desc">当前仅支持单小时预约，最多提前72小时</text>
      </view>

      <view v-if="unsettledOrder" class="card warning">
        <text class="warning__title">您有未完成订单</text>
        <text class="warning__desc">订单号：{{ unsettledOrder.order_no }}，状态：{{ unsettledOrder.status }}</text>
        <button class="warning__btn" type="warn" size="mini" @tap="goOrders">查看订单</button>
      </view>

      <slot-grid v-model="selected" :slots="slotsStore.slots" @select="onSelect" />
    </view>

    <view class="footer">
      <button class="footer__btn" type="primary" :loading="creating" :disabled="!selected || creating || unsettledOrder" @tap="createOrder">
        {{ unsettledOrder ? '处理未完成订单后再预约' : '预约所选时段' }}
      </button>
    </view>
  </scroll-view>
</template>

<script setup>
import { ref } from 'vue';
import { onShow } from '@dcloudio/uni-app';
import SlotGrid from '@/components/SlotGrid.vue';
import { useSlotsStore } from '@/store/slots';
import { useAuthStore } from '@/store/auth';
import { createReservation, listOrders } from '@/services/orders.api';
import { showToast } from '@/utils/toast';

const selected = ref('');
const creating = ref(false);
const unsettledOrder = ref(null);
const slotsStore = useSlotsStore();
const authStore = useAuthStore();

async function bootstrap() {
  await authStore.ensureLogin().catch(() => {
    showToast('需要登录后使用');
  });
  await slotsStore.load();
  const data = await listOrders({ status: 'pending,proof_submitted', page: 1, page_size: 1 });
  unsettledOrder.value = (data.items && data.items[0]) || null;
}

async function createOrder() {
  if (!selected.value || unsettledOrder.value) return;
  creating.value = true;
  try {
    const response = await createReservation(selected.value);
    showToast('预约成功，请尽快完成支付', 'success');
    uni.navigateTo({
      url: `/pages/pay/pay?orderId=${response.order.id}`
    });
  } catch (error) {
    showToast(error.message || '预约失败');
  } finally {
    creating.value = false;
  }
}

function onSelect(slot) {
  if (slot.mine) {
    showToast('该时段已由您预约');
  }
}

function goOrders() {
  uni.switchTab({ url: '/pages/orders/orders' });
}

onShow(() => {
  bootstrap();
});
</script>

<style scoped lang="scss">
@import '@/styles/base.scss';
.page {
  min-height: 100vh;
  background: $bg-color;
}

.intro {
  gap: 12rpx;

  &__title {
    font-size: 34rpx;
    font-weight: 600;
  }

  &__desc {
    color: $sub-text-color;
  }
}

.warning {
  margin-top: 32rpx;
  background: rgba(250, 173, 20, 0.15);
  border: 2rpx solid rgba(250, 173, 20, 0.4);
  gap: 12rpx;

  &__title {
    font-weight: 600;
  }

  &__desc {
    color: $sub-text-color;
  }

  &__btn {
    align-self: flex-start;
  }
}

.footer {
  position: sticky;
  bottom: 0;
  background: #ffffff;
  padding: 24rpx 32rpx env(safe-area-inset-bottom);
  box-shadow: 0 -8rpx 20rpx rgba(15, 35, 95, 0.08);

  &__btn {
    width: 100%;
  }
}
</style>
