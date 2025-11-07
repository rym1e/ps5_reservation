<template>
  <view class="proof-uploader">
    <view class="proof-uploader__list">
      <view v-for="(item, index) in proofs" :key="item.image_url || item.local" class="proof-uploader__item">
        <image class="proof-uploader__image" :src="item.image_url || item.local" mode="aspectFill" />
        <view class="proof-uploader__remove" @tap="() => handleRemove(index)">×</view>
      </view>
      <view
        v-if="proofs.length < max"
        class="proof-uploader__item proof-uploader__item--add"
        @tap="handleChoose"
      >
        <text class="proof-uploader__add">+</text>
        <text class="proof-uploader__hint">上传凭证</text>
      </view>
    </view>
    <text class="proof-uploader__tips">最多上传 {{ max }} 张，单张不超过 5MB</text>
  </view>
</template>

<script setup>
import { showError } from '@/utils/toast.js';

const props = defineProps({
  proofs: {
    type: Array,
    default: () => []
  },
  max: {
    type: Number,
    default: 3
  }
});

const emit = defineEmits(['upload', 'remove']);

function handleChoose() {
  if (props.proofs.length >= props.max) {
    showError('最多上传 3 张凭证');
    return;
  }
  const count = props.max - props.proofs.length;
  uni.chooseImage({
    count,
    sizeType: ['compressed'],
    success: (res) => {
      res.tempFilePaths.forEach((filePath) => {
        emit('upload', filePath);
      });
    },
    fail: () => {
      showError('选择图片失败');
    }
  });
}

function handleRemove(index) {
  emit('remove', index);
}
</script>

<style scoped lang="scss">
.proof-uploader__list {
  display: flex;
  gap: 16rpx;
}

.proof-uploader__item {
  position: relative;
  width: 160rpx;
  height: 160rpx;
  border-radius: 16rpx;
  background-color: #e5e7eb;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #6b7280;
}

.proof-uploader__item--add {
  flex-direction: column;
}

.proof-uploader__add {
  font-size: 48rpx;
  line-height: 1;
}

.proof-uploader__hint {
  font-size: 24rpx;
  margin-top: 8rpx;
}

.proof-uploader__image {
  width: 100%;
  height: 100%;
}

.proof-uploader__remove {
  position: absolute;
  top: 8rpx;
  right: 8rpx;
  width: 32rpx;
  height: 32rpx;
  border-radius: 999rpx;
  background-color: rgba(0, 0, 0, 0.65);
  color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24rpx;
}

.proof-uploader__tips {
  display: block;
  margin-top: 16rpx;
  font-size: 24rpx;
  color: $color-muted;
}
</style>
