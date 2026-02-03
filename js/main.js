let eventBus = new Vue()

Vue.component('product', {
    props: {
        premium: {
            type: Boolean,
            required: true
        },

    },
    template: `
   <div class="product">
    <div class="product-image">
           <img :src="image" :alt="altText"/>
       </div>

       <div class="product-info">
           <h1>{{ title }}</h1>
           <p v-if="inStock">In stock</p>
           <p v-else>Out of Stock</p>
           <div
               class="color-box"
               v-for="(variant, index) in variants"
               :key="variant.variantId"
               :style="{ backgroundColor:variant.variantColor }"
               @mouseover="updateProduct(index)"
           ></div>
           
           <div style="position: relative; display: inline-block;">
           <button
               id="cartButton"
               v-on:click="addToCart"
               :disabled="!inStock"
               :class="{ disabledButton: !inStock }"
               @click="animation"
               style="position: relative; z-index: 1;"
           >
               Add to cart
           </button> 
           </div> 
       </div>           
       <div>
            <product-tabs :shipping="shipping" :details="details" :reviews="reviews"/>
       </div> 
   </div>
 `,
    data() {
        return {
            product: "Socks",
            brand: 'Vue Mastery',
            selectedVariant: 0,
            altText: "A pair of socks",
            details: ['80% cotton', '20% polyester', 'Gender-neutral'],
            variants: [
                {
                    variantId: 2234,
                    variantColor: 'green',
                    variantImage: "./assets/vmSocks-green-onWhite.jpg",
                    variantQuantity: 10
                },
                {
                    variantId: 2235,
                    variantColor: 'blue',
                    variantImage: "./assets/vmSocks-blue-onWhite.jpg",
                    variantQuantity: 5
                }
            ],
            reviews: [],
            inUse: false,
        }
    },
    methods: {
        addToCart() {
            this.$emit('add-to-cart', this.variants[this.selectedVariant].variantId);
        },
        updateProduct(index) {
            this.selectedVariant = index;
            console.log(index);
        },
        animation() {
            const img = document.createElement('img');
            img.src = this.image;
            img.alt = this.altText;
            img.classList.add('toTrash');

            const cartButton = document.getElementById('cartButton');
            const cart = document.getElementById('cart');

            const buttonPosition = cartButton.getBoundingClientRect();
            const cartPosition = cart.getBoundingClientRect();

            const cartPosX = cartPosition.left - buttonPosition.left;
            const cartPosY = cartPosition.top - buttonPosition.top;

            img.style.top = buttonPosition.top + 'px';
            img.style.left = buttonPosition.left + 'px';

            img.style.setProperty('--cartPosX', cartPosX + 'px');
            img.style.setProperty('--cartPosY', cartPosY + 'px');

            document.body.appendChild(img);

            img.addEventListener('animationend', () => {
                img.remove();
            });

        },
    },
    computed: {
        title() {
            return this.brand + ' ' + this.product;
        },
        image() {
            return this.variants[this.selectedVariant].variantImage;
        },
        inStock() {
            return this.variants[this.selectedVariant].variantQuantity
        },
        shipping() {
            if (this.premium) {
                return "Free";
            } else {
                return 2.99
            }
        },
    },
    mounted() {
        eventBus.$on('review-submitted', productReview => {
            this.reviews.push(productReview)
        })
    }
})

Vue.component('product-review', {
    template: `
    <div>
        <form class="review-form" @submit.prevent="onSubmit">
            <p v-if="errors.length">
            <b>Please correct the following error(s):</b>
                <ul>
                    <li v-for="error in errors">{{ error }}</li>
                </ul>
            </p>
        
            <p>
               <label for="name">Name:</label>
               <input id="name" v-model="name" placeholder="name">
            </p>
        
            <p>
               <label for="review">Review:</label>
               <textarea id="review" v-model="review"></textarea>
            </p>
        
            <p>
                <label for="rating">Rating:</label>
                <select id="rating" v-model.number="rating">
                     <option>5</option>
                     <option>4</option>
                     <option>3</option>
                     <option>2</option>
                     <option>1</option>
                </select>
            </p>
        
             <p>
               <input type="submit" value="Submit"> 
             </p>
        </form> 
        <button
            @click="saveComment"
        >
            Save comment
        </button> 
    </div>
 `,

    data() {
        return {
            name: null,
            review: null,
            rating: null,
            errors: [],
            commentData: [],
        }
    },

    methods:{
        onSubmit() {
            if(this.name && this.review && this.rating) {
                let productReview = {
                    name: this.name,
                    review: this.review,
                    rating: this.rating
                }
                eventBus.$emit('review-submitted', productReview)
                this.name = null
                this.review = null
                this.rating = null
                this.errors = []
            } else if (this.errors.length <= 0) {
                if(!this.name) this.errors.push("Name required.")
                if(!this.review) this.errors.push("Review required.")
                if(!this.rating) this.errors.push("Rating required.")
            }
        },
        saveComment() {
            if(this.name && this.review && this.rating) {
                let newComment = {
                    name: this.name,
                    review: this.review,
                    rating: this.rating
                }
                this.commentData.push(newComment)
                localStorage.setItem('commentData', JSON.stringify(this.commentData));
                eventBus.$emit('comment-submitted', this.commentData)
                this.name = null
                this.review = null
                this.rating = null
                this.errors = []
            } else if (this.errors.length <= 0) {
                if(!this.name) this.errors.push("Name required.")
                if(!this.review) this.errors.push("Review required.")
                if(!this.rating) this.errors.push("Rating required.")
            }
        },
    },
})

Vue.component('product-tabs', {
    props: {
        reviews: {
            type: Array,
            required: false
        },
        details: {
            type: Object,
        },
        shipping: {
            type: String
        },
    },

    template: `
    <div>   
        <ul>
            <span class="tab"
               :class="{ activeTab: selectedTab === tab }"
               v-for="(tab, index) in tabs"
               @click="selectedTab = tab"
            >
            {{ tab }}
            </span>
        </ul>
        <div v-show="selectedTab === 'Reviews'">
            <p v-if="!reviews.length">There are no reviews yet.</p>
            <ul>
                <li v-for="review in reviews">
                    <p>{{ review.name }}</p>
                    <p>Rating: {{ review.rating }}</p>
                    <p>{{ review.review }}</p>
                </li>
            </ul>
        </div>
        <div v-show="selectedTab === 'Make a Review'">
            <product-review></product-review>
        </div>
        <div v-show="selectedTab === 'Shipping'">
            <p>Shipping: {{ shipping }}</p>
        </div>
        <div v-show="selectedTab === 'Details'">
            <ul>
                <li v-for="detail in details">{{ detail }}</li>
            </ul>
        </div>
        <div v-show="selectedTab === 'Saved comments'">
            <p v-if="!showComment.length">There are no comments yet.</p>
            <ul>
                <li v-for="comment in showComment">
                    <p>{{ comment.name }}</p>
                    <p>Rating: {{ comment.rating }}</p>
                    <p>{{ comment.review }}</p>
                </li>
            </ul>
        </div>
    </div>
`,

    data() {
        return {
            tabs: ['Reviews', 'Make a Review', 'Shipping', 'Details', 'Saved comments'],
            selectedTab: 'Reviews',
            showComment: []
        }
    },
    methods: {
    },
    mounted() {
        this.showComment = (JSON.parse(localStorage.getItem('commentData')) || {})
        eventBus.$on('comment-submitted', commentData  => {
            this.showComment = commentData;
        })
    }
})

let app = new Vue({
    el: '#app',
    data: {
        premium: true,
        cart: []
    },

    methods: {
        updateCart(id) {
            this.cart.push(id);
        }
    }
})
