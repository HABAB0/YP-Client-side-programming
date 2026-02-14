<script setup>
import { ref, computed, onMounted } from 'vue'
import {productService} from "@/entites/api/product.service.js";

const cartRecords = ref([])
const loading = ref(false)
const path = "http://lifestealer86.ru/"

const groupedCart = computed(() => {
  const map = new Map()

  for (const record of cartRecords.value) {
    const productId = record.product_id
    if (!map.has(productId)) {
      map.set(productId, {
        ...record,
        quantity: 0,
        cartItemIds: []
      })
    }
    const group = map.get(productId)
    group.quantity += 1
    group.cartItemIds.push(record.id)
  }

  return Array.from(map.values())
})

const loadCart = async () => {
  loading.value = true
  try {
    cartRecords.value = await productService.cart()
  } catch (error) {
    console.error('Ошибка загрузки корзины:', error)
  } finally {
    loading.value = false
  }
}

const plusQuantity = async (productId) => {
  try {
    await productService.cartAdd(productId)
    await loadCart()
  } catch (error) {
    console.error('Не удалось добавить товар:', error)
  }
}

const minusQuantity = async (productId) => {
  const group = groupedCart.value.find(group => group.if === productId)
  if (!group || group.quantity <= 1) {
    await removeProduct(productId)
    return
  }
  try {
    await productService.cartDelete(group.cartItemIds[0])
    await loadCart()
  } catch (error) {
    console.error('Не удалось уменьшить количество:', error)
  }
}

const removeProduct = async (productId) => {
  const group = groupedCart.value.find(group => group.id === productId)
  if (!group) return

  try {
    await (
        group.cartItemIds.map(id => productService.cartDelete(id))
    )
    await loadCart()
  } catch (error) {
    console.error('Ошибка удаления товара:', error)
  }
}

onMounted(() => {
  loadCart()
})
</script>

<template>
  <div class="cart-page">
    <p>Корзина</p>

    <div v-if="groupedCart.length === 0" class="empty-cart">
      Корзина пуста
      <router-link to="/catalog">Перейти в каталог</router-link>
    </div>

    <div v-else>
      <div class="cart-items">
        <div v-for="item in groupedCart" :key="item.id" class="cart-item">
          <img
              :src="path + item.image"
              :alt="item.name"
              class="item-image"
          />
          <div class="item-info">
            <h3>{{ item.name }}</h3>
            <p>{{ item.description }}</p>
            <div class="price">{{ item.price }} ₽</div>
          </div>
          <div class="item-controls">
          <button @click="minusQuantity(item.id)">–</button>
          <span>{{ item.quantity }}</span>
          <button @click="plusQuantity(item.id)">+</button>
          <button @click="removeProduct(item.id)" class="remove-btn">×</button>
        </div>
      </div>
    </div>
  </div>
</div>
</template>

<style scoped>
/* Стили как в предыдущем примере */
.cart-page {
  padding: 2rem;
  max-width: 900px;
  margin: 0 auto;
}

.empty-cart {
  text-align: center;
  font-size: 1.2rem;
  color: #666;
}

.cart-items {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.cart-item {
  display: flex;
  gap: 1rem;
  padding: 1rem;
  border: 1px solid #eee;
  border-radius: 12px;
  align-items: center;
}

.item-image {
  width: 80px;
  height: 80px;
  object-fit: cover;
  border-radius: 8px;
}

.item-info h3 {
  margin: 0 0 0.5rem 0;
  font-size: 1.1rem;
}

.price {
  font-weight: bold;
  color: #2E2929;
}

.item-controls {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-left: auto;
}

.item-controls button {
  width: 32px;
  height: 32px;
  border: 1px solid #ccc;
  background: white;
  border-radius: 50%;
  cursor: pointer;
  font-weight: bold;
}

.remove-btn {
  background: #ff6f00;
  color: white;
  border: none;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.order-btn {
  margin-top: 2rem;
  padding: 12px 24px;
  background: #FFCC00;
  border: none;
  border-radius: 10px;
  font-weight: 600;
  font-size: 1.1rem;
  cursor: pointer;
}
</style>