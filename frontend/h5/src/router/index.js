import { createRouter, createWebHistory } from 'vue-router';

const SchedulePage = () => import('@/pages/SchedulePage.vue');
const PayPage = () => import('@/pages/PayPage.vue');
const OrdersPage = () => import('@/pages/OrdersPage.vue');
const OrderDetailPage = () => import('@/pages/OrderDetailPage.vue');

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', name: 'schedule', component: SchedulePage },
    { path: '/pay/:orderId', name: 'pay', component: PayPage, props: true },
    { path: '/orders', name: 'orders', component: OrdersPage },
    { path: '/orders/:orderId', name: 'order-detail', component: OrderDetailPage, props: true }
  ]
});

export default router;
