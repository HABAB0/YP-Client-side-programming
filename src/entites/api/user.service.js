import { api } from '@/shared/api.js'
import {useUserStore} from "@/entites/store/userStore.js";
import router from "@/router/index.js";


export const accountService = {
    auth: (data) =>
        api.post('login', data).then((res) => res.data)
            .then((data) => { localStorage.setItem('token', data.data.user_token)})
            .then(() => {
                const { setAuth } = useUserStore()
                setAuth(true)})
            .then(() => router.push('/')),

    register: (data) =>
        api.post('signup', data).then((res) => res.data)
            .then((data) => { localStorage.setItem('token', data.data.user_token)})
            .then(() => {
                const { setAuth } = useUserStore()
                setAuth(true)})
            .then(() => router.push('/')),

    logout: () => {
        const { setAuth } = useUserStore()
        setAuth(false)
        localStorage.removeItem('token')
        router.push('/')
    }
}