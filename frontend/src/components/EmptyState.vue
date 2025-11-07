<template>
  <div class="empty-state">
    <img class="empty-state__image" :src="image" alt="empty" />
    <p class="empty-state__text">{{ text }}</p>
  </div>
</template>

<script setup>
defineProps({
  <view class="empty-state">
    <image class="empty-state__image" :src="image" mode="aspectFit" />
    <text class="empty-state__text">{{ text }}</text>
  </view>
</template>

<script setup>
const props = defineProps({
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

  @extend .flex-center;
  flex-direction: column;
  padding: 80rpx 0;
  color: $color-muted;
}

.empty-state__image {
  width: 120px;
  height: 120px;
  margin-bottom: 12px;
}

.empty-state__text {
  font-size: 14px;
  width: 240rpx;
  height: 240rpx;
  margin-bottom: 24rpx;
}

.empty-state__text {
  font-size: 28rpx;
}
</style>
