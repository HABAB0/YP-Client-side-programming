<script setup>
import { RouterLink, RouterView } from 'vue-router'
import HelloWorld from './components/HelloWorld.vue'
import AppHeader from "@/components/header/ui/AppHeader.vue";
</script>

<template>
  <div class="wrap">
    <app-header />
    <router-view />
  </div>
</template>

<style scoped>
.wrap {
  width: 100%;
  height: 100%;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}
</style>
