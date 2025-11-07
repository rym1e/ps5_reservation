<template>
  <div class="countdown">{{ display }}</div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount, watch } from 'vue';
import { diffInSeconds, formatCountdown } from '@/utils/time.js';
import { getServerTimestamp } from '@/services/http.js';

const props = defineProps({
  expireAt: {
    type: String,
    required: true
  }
});

const emit = defineEmits(['expire']);

const remainSeconds = ref(diffInSeconds(props.expireAt, getServerTimestamp()));
let timer = null;

const display = computed(() => formatCountdown(remainSeconds.value));

function tick() {
  const seconds = diffInSeconds(props.expireAt, getServerTimestamp());
  remainSeconds.value = seconds;
  if (seconds <= 0) {
    clearInterval(timer);
    emit('expire');
  }
}

onMounted(() => {
  tick();
  timer = setInterval(tick, 1000);
});

onBeforeUnmount(() => {
  if (timer) clearInterval(timer);
});

watch(
  () => props.expireAt,
  () => {
    if (timer) clearInterval(timer);
    tick();
    timer = setInterval(tick, 1000);
  }
);
</script>

<style scoped lang="scss">
.countdown {
  font-size: 18px;
  font-weight: 600;
  color: $color-danger;
}
</style>
