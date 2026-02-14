<script setup>


import {accountService} from "@/entites/api/user.service.js";
import {useUserStore} from "@/entites/store/userStore.js";

const logout = () => {
  accountService.logout()
}

const store = useUserStore()
</script>

<template>
<div class="header">
  <router-link
      :to="{ name: 'catalog' }"
      class="link"
  >
    Каталог товаров
  </router-link>
  <div
    v-show="!store.userIsAuth"
  >
    <router-link
        :to="{ name: 'register' }"
        class="link"
    >
      Регистрация
    </router-link>
  </div>
  <div
      v-show="!store.userIsAuth"
  >
    <router-link
        :to="{ name: 'auth' }"
        class="link"
    >
      Вход
    </router-link>
  </div>
  <div
      v-show="store.userIsAuth"
  >
    <a
        class="link"
        @click="logout"
    >
      Выход
    </a>
  </div>
  <router-link
      :to="{ name: 'cart' }"
      class="link"
      v-show="store.userIsAuth"
  >
    Корзина
  </router-link>
  <div
      v-show="store.userIsAuth"
  >
    <router-link
        :to="{ name: 'orders' }"
        class="link"
    >
      Оформленные заказы
    </router-link>
  </div>
</div>
</template>

<style scoped>
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: linear-gradient(125deg, var(--bg-header) 0%, var(--bg-header-alt) 100%);
  padding: 32px 60px;
  border-radius: 0 0 85px 25px;
  box-shadow:
      0 8px 25px rgba(0, 0, 0, 0.12),
      inset 0 -3px 10px rgba(255, 255, 255, 0.4);
  position: relative;
  overflow: visible;
  margin-bottom: 30px;
}

.header::before,
.header::after {
  content: "";
  position: absolute;
  border-radius: 50%;
  background: rgba(0, 0, 0, 0.04);
  z-index: 0;
}

.header::before {
  width: 90px;
  height: 90px;
  top: 25%;
  right: 8%;
  transform: rotate(25deg);
}

.header::after {
  width: 60px;
  height: 60px;
  bottom: 15%;
  left: 12%;
  transform: rotate(-15deg);
}

.header > * {
  position: relative;
  z-index: 1;
}

.link {
  color: var(--link);
  text-decoration: none;
  font-size: 36px;
  font-weight: 600;
  padding: 8px 12px;
  border-radius: 18px 36px 18px 36px;
  transition: all 0.35s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  position: relative;
  display: inline-block;
  letter-spacing: -0.5px;
  text-shadow: 0 1px 1px rgba(255, 255, 255, 0.7);
  cursor: pointer;
}

.link:hover {
  color: var(--link-hover);
  transform: translateY(-3px) scale(1.03);
  background: rgba(255, 255, 255, 0.35);
  box-shadow:
      0 4px 12px rgba(255, 111, 0, 0.25),
      inset 0 1px 0 rgba(255, 255, 255, 0.6);
  text-shadow: 0 2px 3px rgba(0, 0, 0, 0.1);
}

.link:hover::after {
  content: "";
  position: absolute;
  bottom: -8px;
  left: 50%;
  width: 70%;
  height: 5px;
  background:
      radial-gradient(circle at 20% 50%, transparent 48%, var(--link-hover) 50%),
      radial-gradient(circle at 80% 50%, transparent 48%, var(--link-hover) 50%);
  background-size: 12px 100%;
  background-repeat: repeat-x;
  transform: translateX(-50%);
  border-radius: 0 0 8px 8px;
}

@keyframes bananaPop {
  0% { opacity: 0; transform: translateY(10px) rotate(-15deg) scale(0.7); }
  50% { transform: translateY(-5px) rotate(12deg) scale(1.1); }
  70% { transform: translateY(2px) rotate(-5deg) scale(0.95); }
  100% { opacity: 1; transform: translateY(0) rotate(0) scale(1); }
}

.link.router-link-exact-active {
  color: var(--link-hover);
  font-weight: 800;
  animation: gentleSway 2.5s ease-in-out infinite;
}

@keyframes gentleSway {
  0%, 100% { transform: rotate(0deg); }
  25% { transform: rotate(-1.5deg); }
  75% { transform: rotate(1.5deg); }
}

/* Адаптивность */
@media (max-width: 1024px) {
  .header {
    padding: 28px 40px;
    border-radius: 0 0 70px 20px;
  }
  .link {
    font-size: 30px;
  }
  .link:hover::before {
    font-size: 24px;
    top: -28px;
    right: -24px;
  }
}

@media (max-width: 768px) {
  .header {
    flex-wrap: wrap;
    gap: 15px;
    padding: 24px 30px;
    border-radius: 0 0 60px 15px;
  }
  .link {
    font-size: 26px;
    padding: 6px 10px;
  }
  .link:hover::before {
    display: none;
  }
  .link:hover::after {
    height: 3px;
    bottom: -6px;
  }
}
</style>