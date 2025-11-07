<template>
  <div class="pay-page" v-if="order">
    <section class="section card">
      <div class="pay__section">
        <div class="pay__label">订单号</div>
        <div class="pay__value pay__value--row">
          <span>{{ order.order_no }}</span>
          <button class="pay__copy" type="button" @click="copyOrderNo">复制</button>
        </div>
      </div>
      <div class="pay__section">
        <div class="pay__label">金额</div>
        <div class="pay__value pay__amount">¥{{ (order.amount / 100).toFixed(2) }}</div>
      </div>
      <div class="pay__section">
        <div class="pay__label">请在转账备注填写订单号</div>
        <countdown :expire-at="order.expire_at" @expire="handleExpire" />
      </div>
    </section>

    <section class="section card">
      <div class="pay__label">收款二维码</div>
      <img class="pay__qr" :src="order.pay_qr_url" alt="支付二维码" />
    </section>

    <section class="section card">
      <div class="pay__label">上传支付凭证</div>
      <input
        class="pay__input"
        type="text"
        placeholder="可填写付款备注/流水号"
        v-model="note"
      />
      <proof-uploader :proofs="proofs" @upload="handleUpload" @remove="handleRemove" />
    </section>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { useRouter } from 'vue-router';
import Countdown from '@/components/Countdown.vue';
import ProofUploader from '@/components/ProofUploader.vue';
import { useOrdersStore } from '@/store/orders.js';
import { showError, showSuccess } from '@/utils/toast.js';

const props = defineProps({
  orderId: {
    type: String,
    required: true
  }
});

const router = useRouter();
const ordersStore = useOrdersStore();

const note = ref('');
const proofs = ref([]);
const order = computed(() => ordersStore.current);

onMounted(async () => {
  await fetchDetail();
});

watch(
  () => props.orderId,
  () => {
    fetchDetail();
  }
);

async function fetchDetail() {
  const id = Number(props.orderId);
  if (!id) {
    showError('缺少订单参数');
    return;
  }
  await ordersStore.loadOrderDetail(id);
  proofs.value = (order.value?.proofs || []).map((item) => ({ image_url: item.image_url }));
}

async function handleUpload(file) {
  const id = Number(props.orderId);
  if (!id) return;
  try {
    await ordersStore.appendProof(id, file, note.value);
    await fetchDetail();
  } catch (error) {
    // 提示在 store 中处理
  }
}

function handleRemove() {
  showError('暂不支持删除凭证');
}

function handleExpire() {
  showError('订单已过期，请重新预约');
  setTimeout(() => {
    router.push({ name: 'reservation' });
  }, 1200);
}

async function copyOrderNo() {
  if (!order.value?.order_no) return;
  try {
    await navigator.clipboard.writeText(order.value.order_no);
    showSuccess('已复制订单号');
  } catch (error) {
    showError('复制失败，请手动复制订单号');
  }
}
</script>

<style scoped lang="scss">
.pay-page {
  min-height: 100vh;
  background-color: #f6f6f6;
}

.pay__section {
  margin-bottom: 12px;
}

.pay__label {
  font-size: 14px;
  color: #111827;
  margin-bottom: 6px;
}

.pay__value {
  font-size: 16px;
  color: #1f2937;
}

.pay__value--row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.pay__amount {
  font-weight: 600;
}

.pay__copy {
  border: none;
  background-color: $color-primary;
  color: #ffffff;
  padding: 4px 12px;
  border-radius: 16px;
  font-size: 12px;
}

.pay__qr {
  width: 100%;
  max-width: 320px;
  height: auto;
  border-radius: 8px;
  background-color: #f3f4f6;
}

.pay__input {
  width: 100%;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 8px 12px;
  margin-bottom: 12px;
  font-size: 14px;
}
</style>
