import { api } from '@/shared/api.js'

export const productService = {
    catalog: () =>
        api.get('products').then((res) => res.data.data),

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
}