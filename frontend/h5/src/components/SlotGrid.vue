<template>
  <div class="slot-grid">
    <div
      v-for="slot in slots"
      :key="slot.start_time"
      class="slot-card"
      :class="{
        'slot-card--mine': slot.mine,
        'slot-card--disabled': !slot.available && !slot.mine,
        'slot-card--selected': slot.start_time === modelValue
      }"
      @click="handleClick(slot)"
    >
      <p class="slot-card__date">{{ formatDate(slot.start_time) }}</p>
      <p class="slot-card__time">{{ formatTime(slot.start_time) }}</p>
      <p class="slot-card__status">{{ slotLabel(slot) }}</p>
    </div>
  </div>
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

function handleClick(slot) {
  if (!slot.available && !slot.mine) return;
  const nextValue = slot.start_time === props.modelValue ? '' : slot.start_time;
  emit('update:modelValue', nextValue);
  emit('select', nextValue);
}

function formatDate(startTime) {
  return dayjs(startTime).format('MM月DD日 周dd');
}

function formatTime(startTime) {
  return dayjs(startTime).format('HH:mm');
}

function slotLabel(slot) {
  if (slot.mine) return '我的预约';
  if (!slot.available) return '不可预约';
  return '可预约';
}
</script>

<style scoped lang="scss">
@import '@/styles/variables.scss';

.slot-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
  gap: 16px;
}

.slot-card {
  border-radius: $border-radius-md;
  padding: 16px;
  background: rgba(255, 255, 255, 0.75);
  border: 1px solid transparent;
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 18px 38px rgba(79, 70, 229, 0.15);
  }
}

.slot-card__date {
  font-size: 14px;
  color: $neutral-500;
  margin-bottom: 8px;
}

.slot-card__time {
  font-size: 28px;
  font-weight: 600;
  margin: 0;
}

.slot-card__status {
  margin-top: 12px;
  font-size: 13px;
  color: $neutral-700;
}

.slot-card--selected {
  border-color: $primary-color;
  background: linear-gradient(135deg, rgba(79, 70, 229, 0.15), rgba(14, 165, 233, 0.15));
}

.slot-card--mine {
  border-color: $success-color;
  background: linear-gradient(135deg, rgba(22, 163, 74, 0.12), rgba(22, 163, 74, 0.05));
}

.slot-card--disabled {
  cursor: not-allowed;
  color: $neutral-500;
  border-style: dashed;
  opacity: 0.6;

  &:hover {
    transform: none;
    box-shadow: none;
  }
}
</style>
