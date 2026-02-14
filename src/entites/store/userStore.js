import { defineStore } from 'pinia'
import {ref} from "vue";

export const useUserStore = defineStore( 'user', () => {
    const userIsAuth = ref(false)
    const token = localStorage.getItem('token')

    if (token) {
        setAuth(true)
    }else {
        setAuth(false)
    }

    function setAuth(status) {
        userIsAuth.value = status
        console.log(userIsAuth.value)
    }

    return { userIsAuth, setAuth }
})