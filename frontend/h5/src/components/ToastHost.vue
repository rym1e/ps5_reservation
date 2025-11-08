<template>
  <transition-group name="toast" tag="div" class="toast-host">
    <div
      v-for="toast in toasts"
      :key="toast.id"
      class="toast"
      :class="`toast--${toast.type}`"
    >
      {{ toast.message }}
    </div>
  </transition-group>
</template>

<script setup>
import { onMounted, onUnmounted, reactive } from 'vue';

const toasts = reactive([]);
let counter = 0;
let timerMap = new Map();

function pushToast({ type, message }) {
  const id = counter++;
  toasts.push({ id, type, message });
  const timer = setTimeout(() => removeToast(id), 3200);
  timerMap.set(id, timer);
}

function removeToast(id) {
  const index = toasts.findIndex((item) => item.id === id);
  if (index !== -1) {
    clearTimeout(timerMap.get(id));
    timerMap.delete(id);
    toasts.splice(index, 1);
  }
}

const handler = (event) => {
  pushToast(event.detail);
};

onMounted(() => {
  window.addEventListener('notify', handler);
});

onUnmounted(() => {
  window.removeEventListener('notify', handler);
  timerMap.forEach((timer) => clearTimeout(timer));
  timerMap.clear();
});
</script>

<style scoped lang="scss">
@import '@/styles/variables.scss';

.toast-host {
  position: fixed;
  top: 24px;
  right: 24px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  z-index: 1000;
}

.toast {
  min-width: 240px;
  padding: 14px 18px;
  border-radius: $border-radius-md;
  box-shadow: 0 10px 30px rgba(15, 23, 42, 0.18);
  color: #fff;
  font-weight: 500;
}

.toast--success {
  background: linear-gradient(135deg, #16a34a, #22c55e);
}

.toast--error {
  background: linear-gradient(135deg, #dc2626, #f97316);
}

.toast-enter-active,
.toast-leave-active {
  transition: all 0.25s ease;
}

.toast-enter-from,
.toast-leave-to {
  opacity: 0;
  transform: translateY(-16px);
}
</style>
