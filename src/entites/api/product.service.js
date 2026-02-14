import { api } from '@/shared/api.js'

export const productService = {
    catalog: () =>
        api.get('products').then((res) => res.data.data),

    cartAdd: (productId) =>
        api.post(`cart/${productId}`).then((res) => res.data),

    cart: () =>
        api.get('cart').then((res) => res.data.data),

    cartDelete: (productId) =>
        api.delete(`cart/${productId}`).then((res) => res.data),

    orderAdd: (data) =>
        api.post('order', data).then((res) => res.data),

    order: () =>
        api.get('order').then((res) => res.data),
}