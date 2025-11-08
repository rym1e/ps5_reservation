import { createRouter, createWebHistory } from 'vue-router';

const ReservationPage = () => import('@/pages/index/index.vue');
const PayPage = () => import('@/pages/pay/pay.vue');
const OrdersPage = () => import('@/pages/orders/orders.vue');
const OrderDetailPage = () => import('@/pages/order-detail/order-detail.vue');

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', name: 'reservation', component: ReservationPage },
    { path: '/pay/:orderId', name: 'pay', component: PayPage, props: true },
    { path: '/orders', name: 'orders', component: OrdersPage },
    { path: '/orders/:orderId', name: 'order-detail', component: OrderDetailPage, props: true }
  ]
});

export default router;
