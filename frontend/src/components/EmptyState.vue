<template>
  <div class="empty-state">
    <img class="empty-state__image" :src="image" alt="empty" />
    <p class="empty-state__text">{{ text }}</p>
  </div>
</template>

<script setup>
defineProps({
  text: {
    type: String,
    default: '暂无数据'
  },
  image: {
    type: String,
    default: '/static/empty.png'
  }
});
</script>

<style scoped lang="scss">
.empty-state {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  padding: 40px 0;
  color: $color-muted;
}

.empty-state__image {
  width: 120px;
  height: 120px;
  margin-bottom: 12px;
}

.empty-state__text {
  font-size: 14px;
}
</style>
