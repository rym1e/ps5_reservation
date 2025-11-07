<template>
  <view :class="['status-tag', `status-tag--${status}`]">{{ text }}</view>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  status: {
    type: String,
    default: 'pending'
  }
});

const text = computed(() => {
  switch (props.status) {
    case 'pending':
      return '待支付';
    case 'proof_submitted':
      return '待核验';
    case 'paid':
    case 'confirmed':
      return '已确认';
    case 'rejected':
      return '已驳回';
    case 'cancelled':
      return '已取消';
    case 'expired':
      return '已过期';
    default:
      return '未知';
  }
});
</script>

<style scoped lang="scss">
.status-tag {
  display: inline-flex;
  align-items: center;
  padding: 4rpx 16rpx;
  border-radius: 999rpx;
  font-size: 24rpx;
  line-height: 1;
  color: #ffffff;
}

.status-tag--pending {
  background-color: $color-warning;
}

.status-tag--proof_submitted {
  background-color: #2563eb;
}

.status-tag--paid,
.status-tag--confirmed {
  background-color: $color-success;
}

.status-tag--rejected {
  background-color: $color-danger;
}

.status-tag--cancelled,
.status-tag--expired {
  background-color: $color-muted;
}
</style>
