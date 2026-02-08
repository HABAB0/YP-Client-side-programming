Vue.component('task', {
    props: {
        tasks: Array,
        cardIndex: Number
    },
    template: `
    <div class="task-container">
        <div v-for="(task, index) in tasks" :key="index" class="task-item">
            {{ task.name }}
            <label>
                <input type="checkbox" v-model="task.checked">
            </label>
        </div>
        
        <div >
            <input 
                type="text" 
                v-model="newTaskName" 
                placeholder="Введите задачу"
            >
            <button @click="addTask">Добавить задачу</button>
        </div>
    </div>   
 `,
    data() {
        return {
            newTaskName: ''
        }
    },
    methods: {
        addTask() {
            if (this.newTaskName.trim() === '') {
                return;
            }

            const newTask = {
                name: this.newTaskName,
                checked: false
            };

            this.$emit('task-add', {
                task: newTask,
                cardIndex: this.cardIndex
            });

            this.newTaskName = '';
        }
    },
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
        <div v-for="column in columns" :key="column.id" class="column__item">
            <h3>{{ column.title }}</h3>
            
            <div v-if="column.id === '0'">
                <input 
                    type="text" 
                    v-model="newCardTitle" 
                    placeholder="Введите название карточки"
                >
                <button @click="addCard">Добавить карточку</button>
            </div>
            
            <div class="card__item" v-for="(card, cardIndex) in cardsInColumns(column.id)" :key="cardIndex">
                {{ card.title }}
                <task 
                    :tasks="card.tasks" 
                    :cardIndex="getCardIndex(card)" 
                    @task-add="addTask"
                ></task>
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
        getCardIndex(card) {
            return this.cards.findIndex(index => index === card);
        },
        addCard() {
            if (this.newCardTitle.trim() === '') {
                return;
            }
            const newCard = {
                title: this.newCardTitle,
                table: '0',
                tasks: []
            };

            this.$emit('card-add', newCard);
            this.newCardTitle = '';
        },
        addTask({task, cardIndex}) {
            this.$emit('task-add', {task, cardIndex});
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
        },
        addTask({task, cardIndex}) {
            if (this.cards[cardIndex]) {
                this.cards[cardIndex].tasks.push(task);
            }
        }
    }
})