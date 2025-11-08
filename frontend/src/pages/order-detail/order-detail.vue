<template>
  <div class="order-detail-page" v-if="order">
    <section class="section card">
      <div class="detail__header">
        <div>
          <div class="detail__order-no">订单号：{{ order.order_no }}</div>
          <div class="detail__time">创建时间：{{ order.created_at }}</div>
        </div>
        <status-tag :status="order.status" />
      </div>
    </section>

    <section class="section card">
      <div class="detail__block-title">预约信息</div>
      <div class="detail__row">
        <span class="detail__label">时段</span>
        <span class="detail__value">{{ formatSlot(order.start_time, order.end_time) }}</span>
      </div>
      <div class="detail__row">
        <span class="detail__label">金额</span>
        <span class="detail__value">¥{{ (order.amount / 100).toFixed(2) }}</span>
      </div>
      <div class="detail__row">
        <span class="detail__label">支付截止</span>
        <span class="detail__value">{{ order.expire_at }}</span>
      </div>
    </section>

    <section class="section card">
      <div class="detail__block-title">支付凭证</div>
      <div class="detail__proofs">
        <img
          v-for="proof in order.proofs || []"
          :key="proof.image_url"
          class="detail__proof"
          :src="proof.image_url"
          alt="支付凭证"
        />
      </div>
      <button v-if="order.status === 'pending'" type="button" class="detail__action" @click="goPay">去支付</button>
      <button v-else-if="order.status === 'proof_submitted'" type="button" class="detail__action" @click="goPay">
        追加凭证
      </button>
    </section>

    <section class="section card" v-if="order.status === 'pending'">
      <button type="button" class="detail__cancel" @click="handleCancel">取消订单</button>
    </section>
  </div>
</template>

<script setup>
import { computed, onMounted, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import StatusTag from '@/components/StatusTag.vue';
import { useOrdersStore } from '@/store/orders.js';
import { formatSlotRange } from '@/utils/time.js';

const route = useRoute();
const router = useRouter();
const ordersStore = useOrdersStore();

const order = computed(() => ordersStore.current);

onMounted(async () => {
  await fetchDetail();
});

watch(
  () => route.params.orderId,
  async () => {
    await fetchDetail();
  }
);

async function fetchDetail() {
  const orderId = Number(route.params.orderId);
  if (!orderId) return;
  await ordersStore.loadOrderDetail(orderId);
}

function formatSlot(start, end) {
  return formatSlotRange(start, end);
}

function goPay() {
  if (!order.value?.id) return;
  router.push({ name: 'pay', params: { orderId: order.value.id } });
}

async function handleCancel() {
  if (!order.value?.id) return;
  const confirmed = window.confirm('确定要取消该订单吗？');
  if (!confirmed) return;
  try {
    await ordersStore.cancel(order.value.id);
    await ordersStore.loadOrderDetail(order.value.id);
  } catch (error) {
    // 错误提示在 store 中处理
  }
}
</script>

<style scoped lang="scss">
.order-detail-page {
  min-height: 100vh;
  background-color: #f6f6f6;
  padding-bottom: 24px;
}

.detail__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.detail__order-no {
  font-size: 16px;
  font-weight: 600;
}

.detail__time {
  font-size: 13px;
  color: #6b7280;
  margin-top: 4px;
}

.detail__block-title {
  font-size: 15px;
  font-weight: 600;
  margin-bottom: 12px;
}

.detail__row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
  font-size: 14px;
}

.detail__label {
  color: #6b7280;
}

.detail__value {
  color: #111827;
}

.detail__proofs {
  display: flex;
  gap: 8px;
  margin-bottom: 12px;
  flex-wrap: wrap;
}

.detail__proof {
  width: 120px;
  height: 120px;
  border-radius: 8px;
  background-color: #f3f4f6;
  object-fit: cover;
}

.detail__action {
  border: none;
  background-color: $color-primary;
  color: #ffffff;
  padding: 8px 16px;
  border-radius: 999px;
}

.detail__cancel {
  border: none;
  background-color: $color-danger;
  color: #ffffff;
  padding: 8px 16px;
  border-radius: 999px;
}
</style>
