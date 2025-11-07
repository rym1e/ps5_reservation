<template>
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
  @extend .flex-center;
  flex-direction: column;
  padding: 80rpx 0;
  color: $color-muted;
}

.empty-state__image {
  width: 240rpx;
  height: 240rpx;
  margin-bottom: 24rpx;
}

.empty-state__text {
  font-size: 28rpx;
}
</style>
