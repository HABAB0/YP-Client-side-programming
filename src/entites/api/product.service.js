import { api } from '@/shared/api.js'
import {useUserStore} from "@/entites/store/userStore.js";

const { userIsAuth } = useUserStore()

export const productService = {
    auth: (data) =>
        api.post('login', data).then((res) => res.data).then((data) => { localStorage.setItem('token', JSON.stringify(data.data.user_token))}).then(() => userIsAuth.value = true),

    register: (data) =>
        api.post('signup', data).then((res) => res.data).then((data) => { localStorage.setItem('token', JSON.stringify(data.data.user_token))} ),

    logout: () =>
        api.get('logout').then(() => userIsAuth.value = false),
}