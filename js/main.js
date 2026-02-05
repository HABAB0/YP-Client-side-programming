Vue.component('task', {
    props: {

    },
    template: `
    <div>
         <div v-for="(paragraph, index) in paragraphs" class="paragraphs" :key="index">
            <label class="paragraphs__item" >
                {{ paragraph.name }}
                <input type="checkbox" v-model="paragraph.checked">
            </label>
        </div>
    </div>
    
 `,
    data() {
        return {
            paragraphs: [
                { name: 'это', checked: false },
                { name: 'то', checked: false },
                { name: 'четыре', checked: false }
            ]
        }
    },
    methods: {},
    computed: {},
    mounted() {}
})

Vue.component('column', {
    props: {},
    template: `
    <div class="tasks">
        <div v-for="task in tasks" class="tasks__container">
            <div class="tasks__item" >
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

let app = new Vue({
    el: '#app',
    data: {
    },
})
