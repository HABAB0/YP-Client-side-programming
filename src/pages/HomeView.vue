<script setup>
import {onMounted, ref} from "vue";
import {productService} from "@/entites/api/product.service.js";

const products = ref()
const path = "http://lifestealer86.ru/"

onMounted(async() => {
   products.value = await productService.catalog()
  console.log(products)
})
</script>

<template>
  <main class="products__container">
    <div
      v-for="product in products"
      class=""
    >
      <p>{{ product.name }}</p>
      <p>{{ product.description }}</p>
      <img :src="path +  product.image">
      <p>{{ product.price }}</p>
      <button
      ></button>
    </div>
  </main>
</template>
<style scoped>
  .products__container {
    display: grid;
    grid-template-columns: repeat(4,1fr);
    padding: 20px;
    gap: 10px;
    justify-content: space-between;
  }
</style>
