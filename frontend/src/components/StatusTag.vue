<template>
  <view :class="['status-tag', variantClass]">
    <text>{{ text }}</text>
  </view>
</template>

<script setup>
const props = defineProps({
  status: {
    type: String,
    required: true
  }
});

const map = {
  pending: { text: '待支付', class: 'status-tag--pending' },
  proof_submitted: { text: '待核验', class: 'status-tag--info' },
  paid: { text: '已确认', class: 'status-tag--success' },
  rejected: { text: '已驳回', class: 'status-tag--danger' },
  cancelled: { text: '已取消', class: 'status-tag--default' },
  expired: { text: '已过期', class: 'status-tag--default' }
};

const text = map[props.status]?.text || '未知状态';
const variantClass = map[props.status]?.class || 'status-tag--default';
</script>

<style scoped lang="scss">
@import '@/styles/base.scss';
.status-tag {
  padding: 4rpx 18rpx;
  border-radius: 999rpx;
  font-size: 24rpx;
  line-height: 1;
  color: #fff;

  &--pending {
    background: $warning-color;
  }

  &--info {
    background: #1890ff;
  }

  &--success {
    background: $success-color;
  }

  &--danger {
    background: $danger-color;
  }

  &--default {
    background: #bfbfbf;
  }
}
</style>
