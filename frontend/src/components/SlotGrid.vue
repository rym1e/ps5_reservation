<template>
  <view class="grid">
    <view
      v-for="slot in slots"
      :key="slot.start_time"
      class="grid__item"
      :class="itemClass(slot)"
      @tap="select(slot)"
    >
      <text class="grid__time">{{ format(slot.start_time) }}</text>
      <text class="grid__status">{{ statusText(slot) }}</text>
    </view>
  </view>
</template>

<script setup>
import dayjs from 'dayjs';

const props = defineProps({
  slots: {
    type: Array,
    default: () => []
  },
  modelValue: {
    type: String,
    default: ''
  }
});

const emit = defineEmits(['update:modelValue', 'select']);

function select(slot) {
  if (!slot.available && !slot.mine) {
    uni.showToast({
      title: '时段不可用',
      icon: 'none'
    });
    return;
  }
  const newValue = props.modelValue === slot.start_time ? '' : slot.start_time;
  emit('update:modelValue', newValue);
  if (newValue) {
    emit('select', slot);
  }
}

function format(value) {
  return dayjs(value).format('MM-DD HH:mm');
}

function statusText(slot) {
  if (slot.mine) return '我已占用';
  return slot.available ? '可预约' : '已占用';
}

function itemClass(slot) {
  return {
    'grid__item--mine': slot.mine,
    'grid__item--disabled': !slot.available && !slot.mine,
    'grid__item--active': props.modelValue === slot.start_time
  };
}
</script>

<style scoped lang="scss">
@import '@/styles/base.scss';
.grid {
  display: grid;
  gap: 20rpx;
  grid-template-columns: repeat(2, 1fr);

  &__item {
    @extend .card;
    border: 2rpx solid transparent;
    gap: 12rpx;
    min-height: 140rpx;
    display: flex;
    flex-direction: column;
    justify-content: center;

    &--active {
      border-color: $primary-color;
      box-shadow: 0 8rpx 24rpx rgba(22, 119, 255, 0.2);
    }

    &--mine {
      border-color: $success-color;
      background: rgba(82, 196, 26, 0.08);
    }

    &--disabled {
      opacity: 0.4;
    }
  }

  &__time {
    font-size: 32rpx;
    font-weight: 600;
  }

  &__status {
    font-size: 26rpx;
    color: $sub-text-color;
  }
}
</style>
