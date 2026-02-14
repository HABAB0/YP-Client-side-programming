<script setup>

const path = "http://lifestealer86.ru/"
const props = withDefaults(defineProps(), {
  id: '',
  name: '',
  description: '',
  image: '',
  price: '',

})
</script>

<template>
  <div>
    <div class="product-card">
      <div class="product-image">
        <img :src="props.image">
      </div>
      {{ props.image }}
      <div class="product-info">
        <p class="product-name">{{ props.name }}</p>
        <p class="product-description">{{ props.description }}</p>
        <div class="product-price">{{ props.price }}</div>
        <button class="add-to-cart-btn">В корзину</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.product-card {
  max-width: 320px;
  background: #FFFFFF;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.08);
  transition: transform 0.2s, box-shadow 0.2s;
}

.product-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.12);
}

.product-image {
  width: 100%;
  height: 180px;
  background-color: #F5F0E6;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #9E9583;
  font-size: 14px;
}

.product-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.product-info {
  padding: 1.25rem;
}

.product-name {
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: #2E2929;
}

.product-description {
  font-size: 0.9rem;
  font-weight: 400;
  color: #6B6357;
  margin-bottom: 1rem;
  line-height: 1.5;
}

.product-price {
  font-size: 1.375rem;
  font-weight: 600;
  color: #2E2929;
  margin-bottom: 1rem;
}

.add-to-cart-btn {
  width: 100%;
  padding: 12px;
  font-family: 'Poppins', sans-serif;
  font-size: 1rem;
  font-weight: 600;
  color: #2E2929;
  background-color: #FFCC00;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  transition: background-color 0.2s, transform 0.15s;
}

.add-to-cart-btn:hover {
  background-color: #FFD733;
  transform: scale(1.02);
}

.add-to-cart-btn:active {
  transform: scale(1);
}
</style>