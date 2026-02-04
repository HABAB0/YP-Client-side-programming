Vue.component('table', {
    props: {},
    template: `
    <div>
        <div v-for="task in tasks" class="paragraphs">
            <div class="paragraphs__item" >
                {{ task }}
               <task></task>
            </div>
        </div>
    </div>
 `,
    data() {
        return {
            tasks: ['Делать', 'сделать']
        }
    },
    methods: {},
    computed: {},
    mounted() {}
})

Vue.component('task', {
    props: {},
    template: `
    <div>
        <div v-for="paragraph in paragraphs" class="paragraphs">
            <div class="paragraphs__item" >
                {{ paragraph }}
                <label>
                    <input type="checkbox" v-model="paragraph.checked">
                </label>
            </div>
        </div>
    </div>
    
 `,
    data() {
        return {
            paragraphs: ['это', 'то', 'чатыре'],

        }
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
