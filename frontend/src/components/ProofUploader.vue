<template>
  <div class="proof-uploader">
    <div class="proof-uploader__list">
      <div v-for="(item, index) in proofs" :key="item.image_url || item.preview" class="proof-uploader__item">
        <img class="proof-uploader__image" :src="item.image_url || item.preview" alt="凭证预览" />
        <button type="button" class="proof-uploader__remove" @click="() => handleRemove(index)">×</button>
      </div>
      <label v-if="proofs.length < max" class="proof-uploader__item proof-uploader__item--add">
        <span class="proof-uploader__add">+</span>
        <span class="proof-uploader__hint">上传凭证</span>
        <input
          class="proof-uploader__input"
          type="file"
          accept="image/*"
          multiple
          @change="handleChoose"
        />
      </label>
    </div>
    <p class="proof-uploader__tips">最多上传 {{ max }} 张，单张不超过 5MB</p>
  </div>
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

function handleChoose(event) {
  const files = Array.from(event.target.files || []);
  event.target.value = '';
  if (!files.length) return;

  const remaining = props.max - props.proofs.length;
  files.slice(0, remaining).forEach((file) => {
    if (file.size > 5 * 1024 * 1024) {
      showError('单张图片不能超过 5MB');
    } else {
      emit('upload', file);
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
  gap: 8px;
  flex-wrap: wrap;
}

.proof-uploader__item {
  position: relative;
  width: 80px;
  height: 80px;
  border-radius: 8px;
  background-color: #e5e7eb;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #6b7280;
}

.proof-uploader__item--add {
  flex-direction: column;
  border: 1px dashed #cbd5f5;
  cursor: pointer;
}

.proof-uploader__input {
  position: absolute;
  inset: 0;
  opacity: 0;
  cursor: pointer;
}

.proof-uploader__add {
  font-size: 24px;
  line-height: 1;
}

.proof-uploader__hint {
  font-size: 12px;
  margin-top: 4px;
}

.proof-uploader__image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.proof-uploader__remove {
  position: absolute;
  top: 4px;
  right: 4px;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  border: none;
  background-color: rgba(0, 0, 0, 0.65);
  color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
}

.proof-uploader__tips {
  margin-top: 8px;
  font-size: 12px;
  color: $color-muted;
}
</style>
