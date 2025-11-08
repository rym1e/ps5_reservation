<template>
  <div class="uploader">
    <div class="uploader__header">
      <p class="uploader__title">上传支付凭证</p>
      <p class="uploader__hint">最多 3 张，支持 JPG/PNG，单张不超过 5MB</p>
    </div>
    <div class="uploader__grid">
      <div v-for="(file, index) in previews" :key="file.id" class="uploader__item">
        <img :src="file.url" alt="凭证预览" />
        <button type="button" class="uploader__remove" @click="remove(index)">移除</button>
      </div>
      <label v-if="previews.length < max" class="uploader__add">
        <input
          ref="input"
          type="file"
          accept="image/*"
          multiple
          hidden
          @change="handleSelect"
        />
        <span>＋ 添加图片</span>
      </label>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref, watch } from 'vue';

const props = defineProps({
  modelValue: {
    type: Array,
    default: () => []
  },
  max: {
    type: Number,
    default: 3
  }
});

const emit = defineEmits(['update:modelValue']);

const input = ref(null);
const previews = reactive([]);

watch(
  () => props.modelValue,
  (files) => {
    previews.splice(0, previews.length, ...files.map((file, index) => ({ id: index, url: file.preview || URL.createObjectURL(file) })));
  },
  { immediate: true }
);

function handleSelect(event) {
  const files = Array.from(event.target.files || []);
  const merged = [...props.modelValue];
  for (const file of files) {
    if (!file.type.startsWith('image/')) continue;
    if (file.size > 5 * 1024 * 1024) {
      alert('单张图片不能超过 5MB');
      continue;
    }
    if (merged.length >= props.max) break;
    file.preview = URL.createObjectURL(file);
    merged.push(file);
  }
  emit('update:modelValue', merged);
  event.target.value = '';
}

function remove(index) {
  const next = [...props.modelValue];
  const [removed] = next.splice(index, 1);
  if (removed && removed.preview) {
    URL.revokeObjectURL(removed.preview);
  }
  emit('update:modelValue', next);
}
</script>

<style scoped lang="scss">
@import '@/styles/variables.scss';

.uploader {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.uploader__header {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.uploader__title {
  font-weight: 600;
  font-size: 16px;
}

.uploader__hint {
  font-size: 13px;
  color: $neutral-500;
}

.uploader__grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
  gap: 16px;
}

.uploader__item {
  position: relative;
  border-radius: $border-radius-md;
  overflow: hidden;
  box-shadow: 0 12px 24px rgba(15, 23, 42, 0.12);

  img {
    width: 100%;
    height: 160px;
    object-fit: cover;
  }
}

.uploader__remove {
  position: absolute;
  top: 8px;
  right: 8px;
  border: none;
  border-radius: $border-radius-sm;
  background: rgba(15, 23, 42, 0.65);
  color: #fff;
  padding: 4px 8px;
  cursor: pointer;
}

.uploader__add {
  border: 2px dashed rgba(79, 70, 229, 0.4);
  border-radius: $border-radius-md;
  color: $primary-color;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  cursor: pointer;
  min-height: 160px;
  background: rgba(255, 255, 255, 0.6);

  &:hover {
    background: rgba(79, 70, 229, 0.08);
  }
}
</style>
