import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/pages/HomeView.vue'
import RegisterPage from "@/pages/RegisterPage.vue";
import AuthPage from "@/pages/AuthPage.vue";
import CartPage from "@/pages/CartPage.vue";
import OrderPage from "@/pages/OrderPage.vue";
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'catalog',
      component: HomeView,
    },
    {
      path: '/register',
      name: 'register',
      component: RegisterPage,
    },
    {
      path: '/auth',
      name: 'auth',
      component: AuthPage,
    },
    {
      path: '/cart',
      name: 'cart',
      component: CartPage,
    },
    {
      path: '/orders',
      name: 'orders',
      component: OrderPage,
    },
    {
      path: '/logout',
      name: 'logout',
      // component: () => import('../views/AboutView.vue'),
    },

  ],
})

export default router
