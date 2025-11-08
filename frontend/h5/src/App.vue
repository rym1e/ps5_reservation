<template>
  <div class="app-shell">
    <header class="hero">
      <div class="container hero__content">
        <div>
          <p class="hero__eyebrow">PS5 预约管理</p>
          <h1>72 小时内一站式预约 · 支付 · 管理</h1>
          <p class="hero__subtitle">
            支持跨端预约、实时查看订单状态与支付凭证上传，提供桌面端更清晰的操作体验。
          </p>
        </div>
        <div class="hero__actions">
          <router-link to="/" class="primary-btn">前往预约</router-link>
          <router-link to="/orders" class="secondary-btn">查看我的订单</router-link>
        </div>
      </div>
    </header>
    <main class="main">
      <div class="container">
        <router-view />
      </div>
    </main>
    <ToastHost />
  </div>
</template>

<script setup>
import ToastHost from '@/components/ToastHost.vue';
</script>

<style scoped lang="scss">
@import '@/styles/variables.scss';

.app-shell {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.hero {
  background: radial-gradient(circle at 15% 20%, rgba(79, 70, 229, 0.3), rgba(79, 70, 229, 0) 60%),
    linear-gradient(120deg, rgba(79, 70, 229, 0.85), rgba(14, 116, 144, 0.85));
  color: #fff;
  padding: 48px 0 64px;
  box-shadow: inset 0 -1px 0 rgba(255, 255, 255, 0.2);
}

.hero__content {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 32px;
}

.hero__eyebrow {
  text-transform: uppercase;
  letter-spacing: 0.2em;
  font-size: 12px;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.7);
}

.hero h1 {
  margin: 12px 0;
  font-size: clamp(36px, 4vw, 48px);
  font-weight: 700;
}

.hero__subtitle {
  max-width: 480px;
  font-size: 16px;
  line-height: 1.6;
  color: rgba(255, 255, 255, 0.85);
}

.hero__actions {
  display: flex;
  gap: 16px;
  align-items: center;
  flex-wrap: wrap;
}

.main {
  flex: 1;
  padding: 48px 0 72px;
  margin-top: -32px;
}

@media (max-width: 960px) {
  .hero__content {
    flex-direction: column;
    align-items: flex-start;
  }

  .hero__actions {
    width: 100%;
  }
}
</style>
