<template>
  <view class="empty-state">
    <view class="empty-state__icon">🎮</view>
    <text class="empty-state__text">{{ text }}</text>
  </view>
</template>

<script setup>
const props = defineProps({
  text: {
    type: String,
    default: '暂无数据'
  }
});
</script>

<style scoped lang="scss">
@import '@/styles/base.scss';
.empty-state {
  @extend .flex-column;
  @extend .flex-center;
  padding: 64rpx 0;
  gap: 24rpx;
  color: $sub-text-color;

  &__icon {
    width: 200rpx;
    height: 200rpx;
    border-radius: 100rpx;
    background: rgba(0, 0, 0, 0.04);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 100rpx;
  }

  &__text {
    font-size: 28rpx;
  }
}
</style>
