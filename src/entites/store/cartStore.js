import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useCartStore = defineStore('cart', () => {
    const cartItems = ref([])

    function addToCart(productId) {

        const haveProduct = cartItems.value.find(item => item.id === productId)
        if (haveProduct) {
            haveProduct.quantity += 1
        } else {
            cartItems.value.push({ id: productId, quantity: 1 })
        }
    }

    function clearCart() {
        cartItems.value = []
    }

    return { cartItems, addToCart, clearCart }
})