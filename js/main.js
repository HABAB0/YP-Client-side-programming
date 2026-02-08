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
        cards: Array,
        columns: Array
    },
    template: `
    <div class="column__container" >
        <div v-for="column in columns" class="column__item">
            <h3>{{ column.title }}</h3>
            
            <!-- Форма добавления карточки только для первой колонки -->
            <div v-if="column.id === '0'" class="add-card-form">
                <input 
                    type="text" 
                    v-model="newCardTitle" 
                    placeholder="Введите название карточки"
                    @keyup.enter="addCard"
                >
                <button @click="addCard">Добавить карточку</button>
            </div>
            
            <div class="card__item" v-for="card in cardsInColumns(column.id)">
                {{ card.title }}
                <task :tasks="card.tasks" ></task>
            </div>
        </div>
    </div>   
 `,
    data() {
        return {
            newCardTitle: ''
        }
    },
    methods: {
        cardsInColumns(columnId) {
            return this.cards.filter(card => card.table === columnId);
        },
        addCard() {
            if (this.newCardTitle === '') {
                return;
            }
            const newCard = {
                title: this.newCardTitle,
                table: '0',
                tasks: []
            };

            this.$emit('card-added', newCard);

            this.newCardTitle = '';
        }
    },
    computed: {},
    mounted() {}
})

let app = new Vue({
    el: '#app',
    data: {
        columns: [
            {id: '0', title: 'Первый'},
            {id: '1', title: 'Второй'},
            {id: '2', title: 'Третий'},
        ],
        cards: [
            { title: 'Сейчас', table: '1',
                tasks: [
                    {name: '1', checked: false},
                    {name: '2', checked: false}
                ]},
            { title: 'Завтра' , table: '0',
                tasks: [
                    {name: 'это', checked: false},
                ]},
        ]
    },
    methods: {
        addCard(newCard) {
            this.cards.push(newCard);
        }
    }
})