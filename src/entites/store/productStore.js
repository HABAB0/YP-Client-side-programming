import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useUserStore = defineStore('user', () => {

    return { user, token, setUser, resetToken, resetUser, setToken }
})