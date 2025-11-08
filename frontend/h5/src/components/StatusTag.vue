<template>
  <span class="badge" :class="`badge--${status}`">
    <span class="badge-dot" :style="{ background: colorMap[status] || '#64748b' }"></span>
    {{ textMap[status] || status }}
  </span>
</template>

<script setup>
const props = defineProps({
  status: {
    type: String,
    required: true
  }
});

const colorMap = {
  pending: '#f97316',
  proof_submitted: '#0ea5e9',
  paid: '#16a34a',
  confirmed: '#16a34a',
  rejected: '#dc2626',
  cancelled: '#94a3b8',
  expired: '#94a3b8'
};

const textMap = {
  pending: '待支付',
  proof_submitted: '待核验',
  paid: '已支付',
  confirmed: '已确认',
  rejected: '已驳回',
  cancelled: '已取消',
  expired: '已过期'
};
</script>

<style scoped lang="scss">
.badge--pending {
  background: rgba(249, 115, 22, 0.14);
}

.badge--proof_submitted {
  background: rgba(14, 165, 233, 0.14);
}

.badge--paid,
.badge--confirmed {
  background: rgba(22, 163, 74, 0.14);
}

.badge--rejected,
.badge--cancelled,
.badge--expired {
  background: rgba(148, 163, 184, 0.18);
}
</style>
