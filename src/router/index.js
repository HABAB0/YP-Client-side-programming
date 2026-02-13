import { createRouter, createWebHistory } from 'vue-router'
import { HomeView, RegisterPage, AuthPage, CartPage, OrderPage } from '@/pages/index.js'
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'catalog',
      component: HomeView,
      meta: { title: 'Каталог' },
    },
    {
      path: '/register',
      name: 'register',
      component: RegisterPage,
      meta: { title: 'Регистрация' },
    },
    {
      path: '/auth',
      name: 'auth',
      component: AuthPage,
      meta: { title: 'Вход' },
    },
    {
      path: '/cart',
      name: 'cart',
      component: CartPage,
      meta: { title: 'Корзина' },
    },
    {
      path: '/orders',
      name: 'orders',
      component: OrderPage,
      meta: { title: 'Заказы' },
    },
    {
      path: '/logout',
      name: 'logout',
      // component: () => import('../views/AboutView.vue'),
    },

  ],
})

export default router
