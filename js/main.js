Vue.component('task', {
    props: {
        tasks: Array,
    },
    template: `
    <div>
        <div v-for="task in tasks">
            {{ task.name }}
            <label>
                <input type="checkbox" v-model="task.checked">
            </label>
        </div>
    </div>   
 `,
    data() {
        return {
        }
    },
    methods: {},
    computed: {},
    mounted() {}
})

Vue.component('column', {
    props: {
        cards: Array
    },
    template: `
    <div class="column__container" >
        <div v-for="column in columns" class="column__item">
            {{ column.title }}
            <div v-for="card in cards" class="card__item">
                <div v-if="column.id == card.table">
                    {{ card.title }}
                    <task :tasks="card.tasks" ></task>
                </div>
            </div>
        </div>
    </div>   
 `,
    data() {
        return {
            columns: [
                {title: 'Первый'},
                {title: 'Второй'},
                {title: 'Третий'},
            ]
        }
    },
    methods: {},
    computed: {},
    mounted() {}
})

let app = new Vue({
    el: '#app',
    data: {
        cards: [
            {title: 'Сейчас', table: '1',
                tasks: [
                    {name: '1', checked: false},
                    {name: '2', checked: false}
                ]},
            {title: 'Завтра' , table: '0',
                tasks: [
                    {name: 'это', checked: false},
                ]},
        ]
    },
})
