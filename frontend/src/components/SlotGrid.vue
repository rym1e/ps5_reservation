<template>
  <view class="slot-grid">
    <view v-for="group in grouped" :key="group.date" class="slot-grid__group">
      <view class="slot-grid__header">{{ group.date }}</view>
      <view class="slot-grid__items">
        <view
          v-for="slot in group.slots"
          :key="slot.start_time"
          :class="['slot-grid__item', itemClass(slot)]"
          @tap="() => handleSelect(slot)"
        >
          <text class="slot-grid__hour">{{ slotLabel(slot) }}</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { computed } from 'vue';

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

const grouped = computed(() => {
  const map = new Map();
  props.slots.forEach((slot) => {
    const date = new Date(slot.start_time);
    const label = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date
      .getDate()
      .toString()
      .padStart(2, '0')} (${['日', '一', '二', '三', '四', '五', '六'][date.getDay()]})`;
    if (!map.has(label)) {
      map.set(label, []);
    }
    map.get(label).push(slot);
  });
  return Array.from(map.entries()).map(([date, slots]) => ({ date, slots }));
});

function itemClass(slot) {
  if (slot.start_time === props.modelValue) return 'slot-grid__item--selected';
  if (slot.mine) return 'slot-grid__item--mine';
  if (!slot.available) return 'slot-grid__item--disabled';
  return 'slot-grid__item--available';
}

function slotLabel(slot) {
  const date = new Date(slot.start_time);
  return `${date.getHours().toString().padStart(2, '0')}:00`;
}

function handleSelect(slot) {
  if (!slot.available && !slot.mine) {
    uni.showToast({ title: '该时段已被占用', icon: 'none' });
    return;
  }
  const nextValue = slot.start_time === props.modelValue ? '' : slot.start_time;
  emit('update:modelValue', nextValue);
  emit('select', slot);
}
</script>

<style scoped lang="scss">
.slot-grid {
  display: flex;
  flex-direction: column;
  gap: 24rpx;
}

.slot-grid__group {
  @extend .card;
}

.slot-grid__header {
  font-size: 28rpx;
  font-weight: 600;
  margin-bottom: 24rpx;
}

.slot-grid__items {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 16rpx;
}

.slot-grid__item {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 96rpx;
  border-radius: 12rpx;
  background-color: $bg-muted;
  color: #1f2937;
  font-size: 28rpx;
}

.slot-grid__item--available {
  background-color: #e0f2fe;
  color: #0369a1;
}

.slot-grid__item--mine {
  background-color: #dbeafe;
  color: #1d4ed8;
}

.slot-grid__item--selected {
  background-color: $color-primary;
  color: #ffffff;
}

.slot-grid__item--disabled {
  background-color: #e5e7eb;
  color: #9ca3af;
}
</style>
