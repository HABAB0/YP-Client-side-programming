Vue.component('task', {
    props: {
        tasks: Array,
        cardId: Number,
        columnId: Number,
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
            if (this.newTaskName === '') {
                return;
            }

            const newTask = {
                name: this.newTaskName,
                checked: false
            };

            this.$emit('task-add', {
                task: newTask,
                cardId: this.cardId,
                columnId: this.columnId
            });

            this.newTaskName = '';
        }
    },
    computed: {},
    mounted() {}
})

Vue.component('column', {
    props: {
        columns: Array,
    },
    template: `
<div class="column__container">
    <div v-for="column in columns" :key="column.id" class="column__item">
        <h3>{{ column.description }}</h3>
         <span v-show="column.maxCards" class="card-count">({{ column.cards.length }} / {{ column.maxCards }})</span>
         <span v-show="column.maxCards === null" class="card-count">({{ column.cards.length }})</span>
         <div v-if="column.id === 0">
            <input 
                type="text" 
                v-model="newCardTitle" 
                placeholder="Введите название карточки"
            >
            
            <div v-for="(task, index) in newCardTasks" :key="index" class="task-input">
                    <input 
                        type="text" 
                        v-model="newCardTasks[index]" 
                        :placeholder="'Задача ' + (index + 1)"
                    >
                </div>
            <button @click="addCard(column.id)">Добавить карточку</button>
            <span v-if="taskError" class="error-message">{{ taskError }}</span>
        </div>
        
        <div class="card__item" v-for="card in column.cards" :key="card.id">
            {{ card.title }}
            <task 
                :tasks="card.tasks" 
                :cardId="card.id"
                :columnId="column.id"
                @task-add="addTask"
            ></task>
        </div>
    </div> 
</div>  
 `,
    data() {
        return {
            newCardTitle: '',
            newCardTasks: ['', '', ''],
            taskError: ''
        }
    },
    methods: {
        addCard(columnId) {
            if (this.newCardTitle === '') {
                this.taskError = 'Введите заголовок карточки';
                return;
            }

            if (this.newCardTasks.includes('')) {
                this.taskError = 'Введите все задачи карточки';
                return;
            }

            const tasks = this.newCardTasks.map(task => ({
                    name: task,
                    checked: false
                }));

            const newCard = {
                id: new Date().toISOString() + Math.random() * 1000,
                title: this.newCardTitle,
                tasks: tasks
            };

            this.$emit('card-add', {
                card: newCard,
                columnId: columnId
            });

            this.newCardTitle = '';
            this.newCardTasks = ['', '', ''];
            this.taskError = '';
        },
        addTask({task, cardId, columnId}) {
            this.$emit('task-add', {
                task: task,
                cardId: cardId,
                columnId: columnId
            });
        }
    },
    mounted() {
    }
})

let app = new Vue({
    el: '#app',
    data(){
        return {
            columns: [
                {
                    id: 0,
                    description: 'Первый',
                    maxCards: 3,
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
                    id: 1,
                    description: 'Второй',
                    maxCards: 5,
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
                    id: 2,
                    description: 'Третий',
                    maxCards: null,
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
        }
},
methods: {
    addCard({card, columnId}) {
        const column = this.columns.find(column => column.id === columnId);
        if (column.maxCards <= column.cards.length) {
            return(alert("Достигнуто максиальное количество карточек"));
        }else {
            column.cards.push(card);
        }
    },
    addTask({task, cardId, columnId}) {
        const column = this.columns.find(column => column.id === columnId);
            const card = column.cards.find(card => card.id === cardId);
                card.tasks.push(task);
    }
}
})