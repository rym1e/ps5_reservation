<template>
  <view class="uploader">
    <view class="uploader__list">
      <view
        v-for="(item, idx) in files"
        :key="item.tempFilePath || item.url"
        class="uploader__item"
      >
        <image
          class="uploader__image"
          :src="item.tempFilePath || item.url"
          mode="aspectFill"
          @tap="previewImage(idx)"
        />
        <view class="uploader__remove" @tap="remove(idx)">×</view>
      </view>
      <view v-if="files.length < maxCount" class="uploader__picker" @tap="choose">
        <text class="uploader__picker-icon">＋</text>
        <text class="uploader__picker-text">上传凭证</text>
      </view>
    </view>
    <textarea
      class="uploader__note"
      placeholder="可填写付款备注或流水号"
      :value="note"
      @input="onNoteInput"
    />
  </view>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  modelValue: {
    type: Array,
    default: () => []
  },
  noteValue: {
    type: String,
    default: ''
  },
  maxCount: {
    type: Number,
    default: 3
  }
});

const emit = defineEmits(['update:modelValue', 'update:noteValue']);

const files = computed(() => props.modelValue);
const note = computed(() => props.noteValue);

function choose() {
  const remain = props.maxCount - files.value.length;
  uni.chooseImage({
    count: remain,
    sizeType: ['compressed'],
    success: (res) => {
      const oversize = res.tempFiles.find((f) => f.size > 5 * 1024 * 1024);
      if (oversize) {
        uni.showToast({
          title: '单张图片不能超过5MB',
          icon: 'none'
        });
        return;
      }
      emit('update:modelValue', [...files.value, ...res.tempFiles]);
    }
  });
}

function remove(index) {
  const list = files.value.slice();
  list.splice(index, 1);
  emit('update:modelValue', list);
}

function previewImage(index) {
  uni.previewImage({
    urls: files.value.map((item) => item.tempFilePath || item.url),
    current: index
  });
}

function onNoteInput(event) {
  emit('update:noteValue', event.detail.value);
}
</script>

<style scoped lang="scss">
@import '@/styles/base.scss';
.uploader {
  display: flex;
  flex-direction: column;
  gap: 24rpx;

  &__list {
    display: flex;
    flex-wrap: wrap;
    gap: 24rpx;
  }

  &__item {
    position: relative;
    width: 200rpx;
    height: 200rpx;
    border-radius: 16rpx;
    overflow: hidden;
  }

  &__image {
    width: 100%;
    height: 100%;
  }

  &__remove {
    position: absolute;
    top: 8rpx;
    right: 8rpx;
    background: rgba(0, 0, 0, 0.55);
    color: #fff;
    width: 40rpx;
    height: 40rpx;
    border-radius: 50%;
    text-align: center;
    line-height: 40rpx;
  }

  &__picker {
    width: 200rpx;
    height: 200rpx;
    border: 2rpx dashed #c1c7d0;
    border-radius: 16rpx;
    @extend .flex-column;
    @extend .flex-center;
    gap: 8rpx;
    color: $sub-text-color;
  }

  &__picker-icon {
    font-size: 48rpx;
  }

  &__picker-text {
    font-size: 24rpx;
  }

  &__note {
    width: 100%;
    background: #fff;
    min-height: 160rpx;
    border-radius: 16rpx;
    padding: 20rpx;
    box-sizing: border-box;
  }
}
</style>
