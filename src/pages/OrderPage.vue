<script setup>
import {computed, onMounted, ref} from "vue";
import {productService} from "@/entites/api/product.service.js";

const orders = ref([])
const products = ref([])

const productMap = computed(() => {
  const map = new Map()
  products.value.forEach(p => map.set(p.id, p))
  return map
})

const enrichedOrders = computed(() => {
  return orders.value.map(order => ({
    ...order,
    items: order.products.map(productId => ({
      ...productMap.value.get(productId),
      quantity: 1
    }))
  }))
})


const loadOrders = async () => {
  try {
    const [ordersData, productsData] = await Promise.all([
      productService.order(),
      productService.catalog()
    ])
    orders.value = ordersData
    products.value = productsData
  } catch (error) {
    console.error(error)
}}

onMounted(() => {
  loadOrders()
})
  const path = "http://lifestealer86.ru/"

</script>

<template>
  <div class="orders-page">
    <h1 class="page-title">Мои заказы</h1>

    <div v-if="enrichedOrders.length === 0" class="empty-orders">
      <div class="empty-icon">🍌</div>
      <p>У вас пока нет заказов</p>
      <router-link to="/catalog" class="back-link">Перейти в каталог</router-link>
    </div>

    <div v-else class="orders-grid">
      <div v-for="order in enrichedOrders" :key="order.id" class="order-card">
        <div class="order-header">
          <p>Заказ</p>>
        </div>

        <div class="order-items">
          <div
              v-for="item in order.items"
              class="order-item"
          >
            <div class="item-image-wrapper">
              <img
                  v-if="item && item.image"
                  :src="path + item.image"
                  class="item-image"
              />
              <div v-else class="item-placeholder">
                <span>?</span>
              </div>
            </div>
            <div class="item-info">
              <h3 class="item-name">
                {{ item.name }}
              </h3>
              <p class="item-price">
                {{ item.quantity  }} × {{ item.price }} ₽
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.orders-page {
  padding: 2rem;
  max-width: 1400px;
  margin: 0 auto;
}

.page-title {
  text-align: center;
  font-size: 2.2rem;
  font-weight: 700;
  color: #2E2929;
  margin-bottom: 2.5rem;
  text-shadow: 0 2px 4px rgba(255, 204, 0, 0.2);
  position: relative;
}

.page-title::after {
  content: "";
  display: block;
  width: 80px;
  height: 4px;
  background: linear-gradient(to right, #FFCC00, #FF6F00);
  margin: 0.8rem auto;
  border-radius: 2px;
}

/* Сетка заказов */
.orders-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 2rem;
}

/* Карточка заказа */
.order-card {
  background: #ffffff;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 8px 25px rgba(255, 204, 0, 0.15);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  border: 1px solid #f0e6d2;
}

.order-card:hover {
  transform: translateY(-6px);
  box-shadow: 0 12px 30px rgba(255, 204, 0, 0.25);
}

.order-header {
  background: linear-gradient(135deg, #FFF9E6 0%, #FFECC6 100%);
  padding: 1.2rem 1.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 2px solid #FFD700;
}

.order-header h2 {
  margin: 0;
  font-size: 1.4rem;
  font-weight: 700;
  color: #2E2929;
}

.order-total-badge {
  background: #FFCC00;
  color: #2E2929;
  padding: 0.3rem 1rem;
  border-radius: 20px;
  font-weight: 700;
  font-size: 1.1rem;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
}

/* Список товаров в заказе */
.order-items {
  padding: 1.2rem;
}

.order-item {
  display: flex;
  gap: 1rem;
  padding: 0.8rem 0;
  border-bottom: 1px dashed #f0e6d2;
}

.order-item:last-child {
  border-bottom: none;
}

.item-image-wrapper {
  flex-shrink: 0;
  width: 70px;
  height: 70px;
  border-radius: 12px;
  overflow: hidden;
  background: #f9f5eb;
  display: flex;
  align-items: center;
  justify-content: center;
}

.item-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.item-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #aaa;
  font-size: 1.5rem;
  background: #f5f0e6;
}

.item-info {
  flex: 1;
}

.item-name {
  margin: 0 0 0.3rem 0;
  font-size: 1.05rem;
  font-weight: 600;
  color: #2E2929;
  line-height: 1.3;
}

.item-price {
  margin: 0;
  color: #6B6357;
  font-size: 0.95rem;
  font-weight: 500;
}

/* Пустая корзина */
.empty-orders {
  text-align: center;
  padding: 3rem 1rem;
  color: #777;
}

.empty-icon {
  font-size: 4rem;
  margin-bottom: 1rem;
  filter: drop-shadow(0 2px 4px rgba(0,0,0,0.1));
}

.empty-orders p {
  font-size: 1.3rem;
  margin-bottom: 1.5rem;
}

.back-link {
  display: inline-block;
  padding: 0.6rem 1.8rem;
  background: #FFCC00;
  color: #2E2929;
  text-decoration: none;
  border-radius: 12px;
  font-weight: 600;
  font-size: 1.1rem;
  transition: all 0.25s ease;
  box-shadow: 0 4px 10px rgba(255, 204, 0, 0.3);
}

.back-link:hover {
  background: #FFD733;
  transform: translateY(-2px);
  box-shadow: 0 6px 15px rgba(255, 204, 0, 0.4);
}

/* Адаптивность */
@media (max-width: 768px) {
  .orders-page {
    padding: 1.2rem;
  }

  .page-title {
    font-size: 1.8rem;
  }

  .orders-grid {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }

  .order-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.6rem;
  }

  .order-total-badge {
    align-self: flex-end;
  }
}
</style>