Vue.component('table', {
    props: {},
    template: `
 `,
    data() {
        return {}
    },
    methods: {},
    computed: {},
    mounted() {}
})

Vue.component('task', {
    props: {},
    template: `
    <div v-for="paragraph in paragraphs"class="paragraphs">
        <div class="paragraphs__item" >
            {{ paragraph.description }}
            <label>
                <input type="checkbox" v-model="paragraph.checked">
            </label>
        </div>
    </div>
 `,
    data() {
        return {}
    },
    methods: {},
    computed: {},
    mounted() {}
})

let app = new Vue({
    el: '#app',
    data: {
    },
})
