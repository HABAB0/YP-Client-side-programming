import { api } from '@/shared/api.js'
import {useUserStore} from "@/entites/store/userStore.js";
import router from "@/router/index.js";

// const { userIsAuth } = useUserStore();

export const accountService = {
    auth: (data) =>
        api.post('login', data).then((res) => res.data)
            .then((data) => { localStorage.setItem('token', JSON.stringify(data.data.user_token))})
            .then(() => userIsAuth.value = true)
            .then(() => router.push('/')),

    register: (data) =>
        api.post('signup', data).then((res) => res.data)
            .then((data) => { localStorage.setItem('token', JSON.stringify(data.data.user_token))})
            .then(() => router.push('/auth'))  ,

    logout: () =>
        api.get('logout').then(() => userIsAuth.value = false),
}