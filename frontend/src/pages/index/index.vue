<template>
  <div class="reservation-page">
    <section class="section card">
      <header class="index__header">
        <h1 class="index__title">选择预约时段</h1>
        <p class="index__subtitle">未来 72 小时内，每次预约 1 小时</p>
        <p class="index__tips">请在支付时备注订单号以便快速核验</p>
        <p v-if="hasActiveOrder" class="index__warning">您有未完成的订单，请先完成或取消后再预约。</p>
      </header>
    </section>

    <section class="section">
      <slot-grid :slots="slotsStore.slots" v-model="selectedSlot" @select="handleSlotSelect" />
    </section>

    <footer class="index__footer">
      <button class="index__button" :disabled="createDisabled" @click="handleCreate">
        <span v-if="creating">创建中...</span>
        <span v-else>{{ createButtonText }}</span>
      </button>
    </footer>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import SlotGrid from '@/components/SlotGrid.vue';
import { useAuthStore } from '@/store/auth.js';
import { useSlotsStore } from '@/store/slots.js';
import { useOrdersStore } from '@/store/orders.js';
import { showError, showInfo } from '@/utils/toast.js';

const router = useRouter();
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

onMounted(async () => {
  const authed = await authStore.ensureAuth();
  if (!authed) return;
  await slotsStore.loadSlots();
  await ordersStore.loadOrders({ reset: true, status: 'pending,proof_submitted' });
});

function handleSlotSelect(slot) {
  if (slot.mine) {
    showInfo('该时段由您占用');
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
    router.push({
      name: 'pay',
      params: { orderId: order.id },
      query: {
        expireAt: order.expire_at,
        orderNo: order.order_no
      }
    });
  } catch (error) {
    // 错误提示已在 store 中处理
  } finally {
    creating.value = false;
  }
}
</script>

<style scoped lang="scss">
.reservation-page {
  min-height: 100vh;
  background-color: #f6f6f6;
  padding-bottom: 72px;
}

.index__header {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.index__title {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
}

.index__subtitle {
  margin: 0;
  font-size: 14px;
  color: #4b5563;
}

.index__tips {
  margin: 0;
  font-size: 12px;
  color: $color-muted;
}

.index__warning {
  margin-top: 8px;
  padding: 8px;
  background-color: #fef3c7;
  color: #b45309;
  border-radius: 6px;
  font-size: 13px;
}

.index__footer {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  padding: 16px;
  background: linear-gradient(180deg, rgba(246, 246, 246, 0), #f6f6f6 60%);
  display: flex;
  justify-content: center;
}

.index__button {
  min-width: 240px;
  height: 48px;
  border: none;
  border-radius: 999px;
  background-color: $color-primary;
  color: #ffffff;
  font-size: 16px;
  font-weight: 600;
}

.index__button:disabled {
  background-color: #9ca3af;
  color: #ffffff;
}
</style>
