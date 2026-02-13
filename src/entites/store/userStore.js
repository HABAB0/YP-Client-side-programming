import { defineStore } from 'pinia'
import {ref} from "vue";
import { createPinia } from 'pinia'

export const useUserStore = defineStore( 'user', () => {
    const userIsAuth = ref(false)
    return { userIsAuth }
})