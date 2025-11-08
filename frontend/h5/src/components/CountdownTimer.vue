<template>
  <div class="countdown" :class="{ 'countdown--danger': remaining <= 60 }">
    距离支付超时：<strong>{{ display }}</strong>
  </div>
</template>

<script setup>
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue';
import dayjs from 'dayjs';
import { secondsToClock } from '@/utils/time';

const props = defineProps({
  expireAt: {
    type: String,
    required: true
  }
});

const emit = defineEmits(['expired']);
const remaining = ref(0);
let timer = null;

function tick() {
  const diff = dayjs(props.expireAt).diff(dayjs(), 'second');
  remaining.value = diff;
  if (diff <= 0) {
    stop();
    emit('expired');
  }
}

function start() {
  stop();
  tick();
  timer = setInterval(tick, 1000);
}

function stop() {
  if (timer) {
    clearInterval(timer);
    timer = null;
  }
}

const display = computed(() => secondsToClock(remaining.value));

onMounted(start);
onBeforeUnmount(stop);

watch(
  () => props.expireAt,
  () => {
    start();
  }
);
</script>

<style scoped lang="scss">
@import '@/styles/variables.scss';

.countdown {
  padding: 12px 16px;
  border-radius: $border-radius-md;
  border: 1px solid rgba(79, 70, 229, 0.25);
  background: rgba(79, 70, 229, 0.08);
  color: $primary-color;
  font-weight: 500;
}

.countdown--danger {
  border-color: rgba(220, 38, 38, 0.35);
  background: rgba(220, 38, 38, 0.1);
  color: $danger-color;
}

strong {
  font-size: 18px;
  margin-left: 4px;
}
</style>
