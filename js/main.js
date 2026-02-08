Vue.component('task', {
    props: {
        tasks: Array,
        cardId: Number
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
                cardId: this.cardId
            });

            this.newTaskName = '';
        }
    },
    computed: {},
    mounted() {}
})

Vue.component('column', {
    props: {
        column: Object
    },
    template: `
    <div class="column__item">
        <h3>{{ column.title }}</h3>
        
        <div >
            <input 
                type="text" 
                v-model="newCardTitle" 
                placeholder="Введите название карточки"
            >
            <button @click="addCard">Добавить карточку</button>
        </div>
        
        <div class="card__item" v-for="(card, index) in column.cards" :key="index">
            {{ card.title }}
            <task 
                :tasks="card.tasks" 
                :cardId="card.id" 
                @task-add="addTask"
            ></task>
        </div>
    </div>   
 `,
    data() {
        return {
            newCardTitle: ''
        }
    },
    methods: {
        addCard() {
            if (this.newCardTitle.trim() === '') {
                return;
            }

            const newCard = {
                // id надо както сделать
                title: this.newCardTitle,
                tasks: []
            };

            this.$emit('card-add', {
                card: newCard,
                columnId: this.column.id
            });

            this.newCardTitle = '';
        },
        addTask({task, cardId}) {
            this.$emit('task-add', {
                task: task,
                cardId: cardId,
                columnId: this.column.id
            });
        }
    },
    mounted() {}
})

let app = new Vue({
    el: '#app',
    data:
{
    columns: [
        {
            id: '0',
            title: 'Первый',
            cards: [
                {
                    id: 1,
                    title: 'Сейчас',
                    tasks: [
                        {name: 'Задача 1', checked: false},
                        {name: 'Задача 2', checked: false}
                    ]
                },
                {
                    id: 2,
                    title: 'Завтра',
                    tasks: [
                        {name: 'это', checked: false},
                    ]
                },
            ]
        },
        {
            id: '1',
            title: 'Второй',
            cards: [
                {
                    id: 3,
                    title: 'РВРП',
                    tasks: [
                        {name: '1', checked: false},
                        {name: '2', checked: false}
                    ]
                },
                {
                    id: 4,
                    title: 'Заввапратра',
                    tasks: [
                        {name: 'это', checked: false},
                    ]
                },
            ]
        },
        {
            id: '2',
            title: 'Третий',
            cards: [
                {
                    id: 5,
                    title: 'Сейапрвапчас',
                    tasks: [
                        {name: '1', checked: false},
                        {name: '2', checked: false}
                    ]
                },
                {
                    id: 6,
                    title: 'Заввпратра',
                    tasks: [
                        {name: 'это', checked: false},
                    ]
                },
            ]
        },
    ]
},
methods: {
    addCard({card, columnId}) {
        const column = this.columns.find(column => column.id === columnId);
        if (column) {
            column.cards.push(card);
        }
    },
    addTask({task, cardId, columnId}) {
        const column = this.columns.find(column => column.id === columnId);
        if (column) {
            const card = column.cards.find(card => card.id === cardId);
            if (card) {
                card.tasks.push(task);
            }
        }
    }
}
})