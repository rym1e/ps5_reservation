<template>
  <page-meta :page-style="pageStyle" />
  <router-view />
</template>

<script setup>
import { computed } from 'vue';

const pageStyle = computed(() => {
  return 'background-color:#f6f6f6;';
});
</script>

<style lang="scss">
page {
  font-family: 'PingFang SC', 'Helvetica Neue', Arial, sans-serif;
  background-color: #f6f6f6;
  color: #1a1a1a;
}
</style>
