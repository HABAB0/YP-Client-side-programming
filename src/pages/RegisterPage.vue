<script setup>

import {reactive} from "vue";
import {accountService} from "@/entites/api/user.service.js";

const userData = reactive({
  fio: '',
  email: '',
  password: '',
})

const registerUser = () => {
  accountService.register(userData)
}

</script>

<template>
  <form @submit.prevent="registerUser">
    <p>Регистрация</p>
    <div>
      <label>
        ФИО:
        <input
            type="text"
            required
            v-model="userData.fio"
        >
      </label>
      <label>
        Почтa:
        <input
            type="email"
            required
            v-model="userData.email"
        >
      </label>
      <label>
        Пароль:
        <input
            type="password"
            required
            v-model="userData.password"
        >
      </label>
    </div>
    <button type="submit">Зарегистрироваться</button>
    <p>Уже есть аккаунт? <span><router-link :to="{ name: 'auth' }">Войти</router-link></span></p>
  </form>
</template>

<style scoped>
form {
  background: linear-gradient(135deg, var(--bg-header-alt) 0%, var(--bg-header) 100%);
  border-radius: 50px 20px 20px 50px;
  padding: 2.5rem;
  box-shadow:
      0 10px 30px rgba(255, 204, 0, 0.4),
      8px 8px 0 rgba(46, 41, 41, 0.1);
  max-width: 420px;
  margin: 2rem auto;
  position: relative;
  overflow: hidden;
  border: 3px solid rgba(255, 204, 0, 0.7);
}

form::before {
  content: "";
  position: absolute;
  top: -50%;
  right: -20%;
  width: 120%;
  height: 120%;
  background: radial-gradient(circle,
  rgba(255, 204, 0, 0.3) 0%,
  rgba(255, 255, 246, 0) 70%);
  transform: rotate(-15deg);
  z-index: 0;
}

form > * {
  position: relative;
  z-index: 1;
}

form p:first-of-type {
  font-size: 1.8rem;
  font-weight: bold;
  color: var(--link);
  margin-bottom: 1.5rem;
  text-shadow: 1px 1px 0 rgba(255, 255, 255, 0.7);
  letter-spacing: -0.5px;
}

form div {
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-bottom: 20px;
}

input[type="text"],
input[type="email"],
input[type="password"] {
  width: 100%;
  padding: 14px 20px;
  border: 2px solid var(--bg-header-alt);
  border-radius: 12px 30px 12px 30px; /* Асимметричные скругления */
  background: rgba(255, 255, 255, 0.85);
  font-size: 16px;
  color: var(--link);
  transition: all 0.3s ease;
  box-shadow: inset 0 2px 5px rgba(0,0,0,0.05);
}

input:focus {
  outline: none;
  border-color: var(--link-hover);
  box-shadow:
      0 0 0 3px rgba(255, 111, 0, 0.2),
      inset 0 1px 3px rgba(0,0,0,0.1);
  transform: scale(1.01);
}

button {
  background: linear-gradient(to bottom, #FFD700, #FFCC00);
  color: var(--link);
  border: none;
  padding: 16px;
  font-size: 18px;
  font-weight: bold;
  border-radius: 30px 15px 30px 15px;
  cursor: pointer;
  width: 100%;
  transition: all 0.3s ease;
  box-shadow:
      0 4px 0 #E6B400,
      0 6px 15px rgba(0,0,0,0.15);
  letter-spacing: 1px;
  position: relative;
  overflow: hidden;
}

button:hover {
  background: linear-gradient(to bottom, #FFA726, #FF6F00);
  transform: translateY(-2px);
  box-shadow:
      0 6px 0 #E66B00,
      0 8px 20px rgba(0,0,0,0.2);
}

button:active {
  transform: translateY(2px);
  box-shadow: 0 2px 0 #E66B00;
}

button:hover::after {
  opacity: 1;
  transform: rotate(10deg);
}

form p:last-child {
  margin-top: 20px;
  color: var(--link);
  font-size: 15px;
}

form a {
  color: var(--link);
  text-decoration: none;
  font-weight: bold;
  padding: 3px 8px;
  border-radius: 15px;
  transition: all 0.3s;
  display: inline-block;
}

form a:hover {
  color: var(--link-hover);
  background: rgba(255, 255, 246, 0.4);
  transform: translateX(3px);
  text-decoration: underline;
}

/* Анимация появления формы */
form {
  animation: bananaBounce 0.6s ease-out;
}

@keyframes bananaBounce {
  0% { transform: scale(0.95) rotate(-2deg); opacity: 0; }
  70% { transform: scale(1.03) rotate(1deg); }
  100% { transform: scale(1) rotate(0); opacity: 1; }
}
</style>