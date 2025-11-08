<template>
  <div class="card pay" v-if="order">
    <header class="pay__header">
      <div>
        <h2 class="section-title">订单支付</h2>
        <p class="pay__desc">请根据订单信息完成转账，并在下方上传支付凭证。</p>
      </div>
      <status-tag :status="order.status" />
    </header>

    <div class="pay__meta">
      <div class="pay__meta-item">
        <span>订单号</span>
        <strong>{{ order.order_no }}</strong>
        <button class="secondary-btn secondary-btn--sm" @click="copy(order.order_no)">复制</button>
      </div>
      <div class="pay__meta-item">
        <span>预约时段</span>
        <strong>{{ slotText }}</strong>
      </div>
      <div class="pay__meta-item">
        <span>支付金额</span>
        <strong class="pay__amount">￥{{ (order.amount / 100).toFixed(2) }}</strong>
      </div>
      <div class="pay__meta-item">
        <span>支付备注</span>
        <strong>请填写订单号：{{ order.order_no }}</strong>
      </div>
    </div>

    <countdown-timer :expire-at="order.expire_at" @expired="onExpired" />

    <section class="pay__qr" v-if="order.pay_qr_url">
      <div class="pay__qr-image">
        <img :src="order.pay_qr_url" alt="收款二维码" />
      </div>
      <div class="pay__qr-info">
        <h3>扫码支付说明</h3>
        <ul>
          <li>使用微信/支付宝扫描左侧二维码完成支付。</li>
          <li>请务必在备注中填写订单号，以便管理员核验。</li>
          <li>支付成功后，上传转账截图或输入流水号。</li>
        </ul>
      </div>
    </section>

    <section class="pay__proof">
      <h3>上传凭证</h3>
      <proof-uploader v-model="proofFiles" />
      <label class="pay__note-label">
        付款备注 / 流水号
        <input v-model="note" placeholder="可选填写，有助于管理员核对" />
      </label>
      <button class="primary-btn" :disabled="!canSubmitProof" @click="submitProof">提交凭证</button>
    </section>

    <footer class="pay__footer">
      <button class="secondary-btn" @click="goBack">返回预约页</button>
      <router-link class="secondary-btn" :to="{ name: 'orders' }">查看我的订单</router-link>
    </footer>
  </div>
  <div v-else class="card pay pay--empty">
    <h2>未找到订单</h2>
    <p>请返回预约页重新选择时段。</p>
    <router-link class="primary-btn" to="/">返回首页</router-link>
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import { fetchOrderDetail, uploadProof } from '@/services/orders';
import StatusTag from '@/components/StatusTag.vue';
import CountdownTimer from '@/components/CountdownTimer.vue';
import ProofUploader from '@/components/ProofUploader.vue';
import { notifyError, notifySuccess } from '@/utils/notify';
import { formatSlotRange } from '@/utils/time';

const route = useRoute();
const router = useRouter();
const auth = useAuthStore();

const order = ref(route.state?.order || null);
const proofFiles = ref([]);
const note = ref('');

const slotText = computed(() => {
  if (!order.value) return '';
  return formatSlotRange(order.value.start_time, order.value.end_time);
});

const canSubmitProof = computed(() => proofFiles.value.length > 0 && order.value && order.value.status !== 'expired');

async function copy(text) {
  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text);
    } else {
      const textarea = document.createElement('textarea');
      textarea.value = text;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
    }
    notifySuccess('复制成功');
  } catch (error) {
    notifyError('复制失败，请手动选择复制');
  }
}

async function loadOrder() {
  try {
    const data = await fetchOrderDetail(route.params.orderId);
    order.value = data;
  } catch (error) {
    notifyError(error?.response?.data?.message || '加载订单失败');
  }
}

async function submitProof() {
  if (!canSubmitProof.value) return;
  try {
    await uploadProof(order.value.id, { files: proofFiles.value, note: note.value });
    notifySuccess('凭证上传成功，等待管理员核验');
    proofFiles.value = [];
    note.value = '';
    loadOrder();
  } catch (error) {
    notifyError(error?.response?.data?.message || '上传失败');
  }
}

function goBack() {
  router.push('/');
}

function onExpired() {
  notifyError('订单已过期，请重新预约');
  loadOrder();
}

onMounted(() => {
  if (!order.value) {
    loadOrder();
  }
  if (!auth.token) {
    notifyError('请先登录再上传凭证');
  }
});
</script>

<style scoped lang="scss">
@import '@/styles/variables.scss';

.pay {
  display: flex;
  flex-direction: column;
  gap: 32px;
}

.pay__header {
  display: flex;
  justify-content: space-between;
  gap: 24px;
  align-items: center;
}

.pay__desc {
  margin: 0;
  color: $neutral-500;
}

.pay__meta {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 16px;
}

.pay__meta-item {
  background: rgba(255, 255, 255, 0.7);
  border-radius: $border-radius-md;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 6px;
  position: relative;

  span {
    font-size: 13px;
    color: $neutral-500;
  }

  strong {
    font-size: 18px;
  }
}

.pay__amount {
  font-size: 24px !important;
  color: $primary-color;
}

.secondary-btn--sm {
  position: absolute;
  top: 16px;
  right: 16px;
  padding: 6px 12px;
  font-size: 12px;
}

.pay__qr {
  display: grid;
  grid-template-columns: 240px 1fr;
  gap: 32px;
  align-items: center;
}

.pay__qr-image {
  border-radius: $border-radius-md;
  overflow: hidden;
  background: #fff;
  padding: 16px;
  box-shadow: 0 12px 32px rgba(15, 23, 42, 0.15);

  img {
    width: 100%;
    display: block;
  }
}

.pay__proof {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.pay__note-label {
  display: flex;
  flex-direction: column;
  gap: 6px;
  font-size: 14px;

  input {
    padding: 12px 14px;
    border-radius: $border-radius-md;
    border: 1px solid $neutral-200;
  }
}

.pay__footer {
  display: flex;
  justify-content: space-between;
  gap: 16px;
}

.pay--empty {
  text-align: center;
  align-items: center;
}

@media (max-width: 960px) {
  .pay__qr {
    grid-template-columns: 1fr;
  }

  .pay__footer {
    flex-direction: column;
    align-items: stretch;
  }
}
</style>
