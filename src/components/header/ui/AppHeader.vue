<script setup>

</script>

<template>
<div class="header">
  <router-link
      :to="{ name: 'catalog' }"
      class="link"
  >
    Каталог товаров
  </router-link>
  <div>
    <router-link
        :to="{ name: 'register' }"
        class="link"
    >
      Регистрация
    </router-link>
  </div>
  <div>
    <router-link
        :to="{ name: 'auth' }"
        class="link"
    >
      Вход
    </router-link>
  </div>
  <div>
    <router-link
        :to="{ name: 'logout' }"
        class="link"
    >
      Выход
    </router-link>
  </div>
  <router-link
      :to="{ name: 'cart' }"
      class="link"
  >
    Корзина
  </router-link>
  <router-link
      :to="{ name: 'orders' }"
      class="link"
  >
    Оформленные заказы
  </router-link>
</div>
</template>

<style scoped>
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: var(--bg-header);
  padding: 40px 60px;
}

.link {
  color: var(--link);
  text-decoration: none;
  cursor: pointer;
  font-size: 40px;
  transition: 0.3s;
}

.link:hover {
  color: var(--link-hover);
}
</style>