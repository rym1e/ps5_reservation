<template>
  <div class="card detail" v-if="order">
    <header class="detail__header">
      <div>
        <h2 class="section-title">订单详情</h2>
        <p class="detail__desc">查看预约信息、支付状态与凭证记录。</p>
      </div>
      <status-tag :status="order.status" />
    </header>

    <section class="detail__section">
      <h3>基础信息</h3>
      <div class="detail__grid">
        <div>
          <span>订单号</span>
          <strong>{{ order.order_no }}</strong>
        </div>
        <div>
          <span>预约时段</span>
          <strong>{{ formatSlotRange(order.start_time, order.end_time) }}</strong>
        </div>
        <div>
          <span>金额</span>
          <strong>￥{{ (order.amount / 100).toFixed(2) }}</strong>
        </div>
        <div>
          <span>创建时间</span>
          <strong>{{ formatFullTimestamp(order.created_at) }}</strong>
        </div>
      </div>
    </section>

    <section class="detail__section">
      <h3>状态流转</h3>
      <ul class="detail__timeline">
        <li v-for="item in timeline" :key="item.label">
          <span class="detail__timeline-label">{{ item.label }}</span>
          <span class="detail__timeline-value">{{ item.value || '—' }}</span>
        </li>
      </ul>
    </section>

    <section class="detail__section" v-if="order.proofs && order.proofs.length">
      <h3>支付凭证</h3>
      <div class="detail__proofs">
        <figure v-for="proof in order.proofs" :key="proof.id">
          <img :src="proof.image_url" alt="支付凭证" />
          <figcaption>{{ proof.note || '无备注' }}</figcaption>
        </figure>
      </div>
    </section>

    <footer class="detail__footer">
      <router-link class="secondary-btn" :to="{ name: 'orders' }">返回列表</router-link>
      <router-link
        v-if="order.status === 'pending' || order.status === 'proof_submitted'"
        class="primary-btn"
        :to="{ name: 'pay', params: { orderId: order.id } }"
      >
        去支付 / 上传凭证
      </router-link>
    </footer>
  </div>
  <div v-else class="card detail detail--empty">
    <h2>订单不存在</h2>
    <router-link class="primary-btn" to="/">返回预约页</router-link>
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import StatusTag from '@/components/StatusTag.vue';
import { useOrdersStore } from '@/stores/orders';
import { formatSlotRange, formatFullTimestamp } from '@/utils/time';
import { notifyError } from '@/utils/notify';

const route = useRoute();
const store = useOrdersStore();
const order = ref(null);

const timeline = computed(() => {
  if (!order.value) return [];
  return [
    { label: '订单创建', value: formatFullTimestamp(order.value.created_at) },
    { label: '凭证上传', value: order.value.proof_submitted_at ? formatFullTimestamp(order.value.proof_submitted_at) : '' },
    { label: '管理员核验', value: order.value.verified_at ? formatFullTimestamp(order.value.verified_at) : '' },
    { label: '过期时间', value: order.value.expire_at ? formatFullTimestamp(order.value.expire_at) : '' }
  ];
});

async function load() {
  try {
    const data = await store.loadOrderDetail(route.params.orderId);
    order.value = data;
  } catch (error) {
    notifyError(error?.response?.data?.message || '加载订单失败');
  }
}

onMounted(load);
</script>

<style scoped lang="scss">
@import '@/styles/variables.scss';

.detail {
  display: flex;
  flex-direction: column;
  gap: 32px;
}

.detail__header {
  display: flex;
  justify-content: space-between;
  gap: 24px;
  align-items: center;
}

.detail__desc {
  margin: 0;
  color: $neutral-500;
}

.detail__section {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.detail__grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 16px;

  div {
    background: rgba(255, 255, 255, 0.75);
    border-radius: $border-radius-md;
    padding: 16px;
    display: flex;
    flex-direction: column;
    gap: 6px;

    span {
      font-size: 13px;
      color: $neutral-500;
    }

    strong {
      font-size: 18px;
    }
  }
}

.detail__timeline {
  list-style: none;
  padding: 0;
  margin: 0;
  display: grid;
  gap: 12px;
}

.detail__timeline-label {
  font-weight: 600;
}

.detail__timeline-value {
  color: $neutral-500;
}

.detail__proofs {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;

  figure {
    border-radius: $border-radius-md;
    overflow: hidden;
    background: #fff;
    box-shadow: 0 12px 28px rgba(15, 23, 42, 0.12);

    img {
      width: 100%;
      display: block;
    }

    figcaption {
      padding: 12px 16px;
      font-size: 14px;
      color: $neutral-500;
    }
  }
}

.detail__footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}

.detail--empty {
  text-align: center;
  align-items: center;
}
</style>
