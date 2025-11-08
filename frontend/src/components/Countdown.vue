<template>
  <view class="countdown">
    <text v-if="remaining > 0">{{ display }}</text>
    <text v-else>00:00</text>
  </view>
</template>

<script setup>
import { computed, onBeforeUnmount, ref, watch } from 'vue';

const props = defineProps({
  expireAt: {
    type: Number,
    required: true
  }
});

const emit = defineEmits(['expire']);
const now = ref(Date.now());
let timer = null;

const remaining = computed(() => Math.max(props.expireAt - now.value, 0));

const display = computed(() => {
  const totalSeconds = Math.floor(remaining.value / 1000);
  const minutes = `${Math.floor(totalSeconds / 60)}`.padStart(2, '0');
  const seconds = `${totalSeconds % 60}`.padStart(2, '0');
  return `${minutes}:${seconds}`;
});

watch(remaining, (val) => {
  if (val === 0) {
    stop();
    emit('expire');
  }
});

function tick() {
  now.value = Date.now();
}

function start() {
  stop();
  timer = setInterval(tick, 1000);
  tick();
}

function stop() {
  if (timer) {
    clearInterval(timer);
    timer = null;
  }
}

start();

onBeforeUnmount(() => {
  stop();
});
</script>

<style scoped lang="scss">
@import '@/styles/base.scss';
.countdown {
  font-size: 32rpx;
  font-weight: 600;
  color: $danger-color;
}
</style>
