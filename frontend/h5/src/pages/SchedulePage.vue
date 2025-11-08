<template>
  <div class="card schedule">
    <div class="schedule__header">
      <h2 class="section-title">选择预约时段</h2>
      <div class="schedule__actions">
        <button class="secondary-btn" @click="refreshSlots" :disabled="slotsLoading">
          刷新可预约时段
        </button>
        <button class="secondary-btn" v-if="!auth.user" @click="openLogin">登录以继续</button>
        <button class="secondary-btn" v-else @click="auth.logout">退出登录</button>
      </div>
    </div>
    <p class="schedule__sub">展示当前起 72 小时内的整点时段。不可预约时段会以灰色显示。</p>

    <div v-if="unpaidLimitReached" class="schedule__warning">
      您有未完成的订单，请先处理后再预约。
    </div>

    <slot-grid
      v-model="selectedSlot"
      :slots="slotsStore.slots"
      class="schedule__grid"
    />

    <footer class="schedule__footer">
      <div class="schedule__summary" v-if="selectedSlot">
        <p>已选时段：{{ selectedSlotText }}</p>
        <p v-if="pricePerHour !== null">金额：￥{{ pricePerHour.toFixed(2) }}</p>
      </div>
      <button
        class="primary-btn"
        :disabled="!canSubmit"
        @click="createOrder"
      >
        创建预约并生成订单
      </button>
    </footer>
  </div>
  <teleport to="body">
    <div v-if="showLogin" class="login-modal__backdrop">
      <div class="login-modal">
        <h3>输入登录凭证</h3>
        <p>请输入后端提供的登录 code 或测试口令，以换取 Token。</p>
        <input v-model="loginCode" placeholder="例如：mock-code-123" />
        <div class="login-modal__actions">
          <button class="secondary-btn" @click="closeLogin">取消</button>
          <button class="primary-btn" :disabled="!loginCode" @click="submitLogin">登录</button>
        </div>
      </div>
    </div>
  </teleport>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import SlotGrid from '@/components/SlotGrid.vue';
import { useSlotsStore } from '@/stores/slots';
import { useAuthStore } from '@/stores/auth';
import { createReservation, fetchOrders } from '@/services/orders';
import { fetchSettings } from '@/services/settings';
import { notifyError, notifySuccess } from '@/utils/notify';
import { formatSlotRange } from '@/utils/time';

const slotsStore = useSlotsStore();
const auth = useAuthStore();
const router = useRouter();
const selectedSlot = ref('');
const slotsLoading = computed(() => slotsStore.loading);
const pricePerHour = ref(null);

const unpaidLimitReached = ref(false);
const showLogin = ref(false);
const loginCode = ref('');

const canSubmit = computed(() => !!selectedSlot.value && !unpaidLimitReached.value && !!auth.token);

const selectedSlotText = computed(() => {
  if (!selectedSlot.value) return '';
  const slot = slotsStore.slots.find((item) => item.start_time === selectedSlot.value);
  return slot ? formatSlotRange(slot.start_time, slot.end_time) : '';
});

async function refreshSlots() {
  try {
    await slotsStore.loadSlots();
  } catch (error) {
    notifyError(error?.response?.data?.message || '获取可预约时段失败');
  }
}

async function loadSettings() {
  try {
    const data = await fetchSettings();
    if (data.price_per_hour !== undefined) {
      pricePerHour.value = Number(data.price_per_hour) / 100;
    }
  } catch (error) {
    // ignore optional failure
    console.warn('load settings failed', error);
  }
}

async function createOrder() {
  if (!canSubmit.value) return;
  try {
    const data = await createReservation(selectedSlot.value);
    notifySuccess('预约创建成功，已生成订单');
    router.push({ name: 'pay', params: { orderId: data.order.id }, state: { order: data.order } });
  } catch (error) {
    notifyError(error?.response?.data?.message || '创建预约失败');
  }
}

function openLogin() {
  showLogin.value = true;
}

function closeLogin() {
  showLogin.value = false;
  loginCode.value = '';
}

async function submitLogin() {
  if (!loginCode.value) return;
  try {
    await auth.login(loginCode.value);
    notifySuccess('登录成功');
    closeLogin();
    checkUnfinished();
  } catch (error) {
    notifyError(error?.response?.data?.message || '登录失败');
  }
}

async function checkUnfinished() {
  if (!auth.token) return;
  try {
    const data = await fetchOrders({ status: 'pending,proof_submitted' });
    unpaidLimitReached.value = Array.isArray(data?.items) && data.items.length > 0;
  } catch (error) {
    console.warn('check unfinished orders failed', error);
  }
}

onMounted(async () => {
  await Promise.all([refreshSlots(), loadSettings()]);
  if (auth.token) {
    checkUnfinished();
  }
});
</script>

<style scoped lang="scss">
@import '@/styles/variables.scss';

.schedule {
  display: flex;
  flex-direction: column;
  gap: 32px;
}

.schedule__header {
  display: flex;
  justify-content: space-between;
  gap: 24px;
  align-items: center;
}

.schedule__sub {
  margin: 0;
  font-size: 15px;
  color: $neutral-500;
}

.schedule__actions {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.schedule__grid {
  margin-top: 8px;
}

.schedule__footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
}

.schedule__summary {
  display: flex;
  flex-direction: column;
  gap: 4px;
  font-weight: 500;
}

.schedule__warning {
  padding: 12px 16px;
  border-radius: $border-radius-md;
  background: rgba(249, 115, 22, 0.12);
  color: $warning-color;
}

.login-modal__backdrop {
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.42);
  display: grid;
  place-items: center;
  z-index: 1200;
}

.login-modal {
  width: min(420px, 90vw);
  background: #fff;
  border-radius: $border-radius-lg;
  padding: 32px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  box-shadow: 0 24px 60px rgba(15, 23, 42, 0.22);

  input {
    padding: 12px 14px;
    border-radius: $border-radius-md;
    border: 1px solid $neutral-200;
    font-size: 16px;
  }
}

.login-modal__actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}

@media (max-width: 768px) {
  .schedule__footer {
    flex-direction: column;
    align-items: stretch;
  }
}
</style>
