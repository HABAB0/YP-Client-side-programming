import { api } from '@/shared/api.js'
import {useUserStore} from "@/entites/store/userStore.js";

const { userIsAuth } = useUserStore()

export const accountService = {
    auth: (data) =>
        api.post('login', data).then((res) => res.data).then((data) => { localStorage.setItem('token', JSON.stringify(data.data.user_token))}).then(() => userIsAuth.value = true),

    register: (data) =>
        api.post('signup', data).then((res) => res.data).then((data) => { localStorage.setItem('token', JSON.stringify(data.data.user_token))} ),

    catalog: () =>
        api.get('products').then((res) => res.data),

    cartAdd: (data) =>
        api.post('cart/{product_id}', data).then((res) => res.data),

    cart: () =>
        api.get('products').then((res) => res.data),

    cartDelete: () =>
        api.delete('products{product_id}').then((res) => res.data),

    orderAdd: (data) =>
        api.post('order', data).then((res) => res.data),

    order: () =>
        api.get('order').then((res) => res.data),

    logout: () =>
        api.get('logout'),
}