const eventBus = new Vue();

Vue.component('task', {
    props: {
        tasks: Array,
        cardId: Number,
        columnId: Number,
        columns: Array,
    },
    template: `
    <div class="task-container">
        <div v-for="(task, index) in tasks" :key="index" class="task-item">
            {{ task.name }}
            <label>
                <input type="checkbox" v-model="task.checked" @change="onTaskCheck(task)">
            </label>
        </div>
        
        <div >
            <input 
                type="text" 
                v-model="newTaskName" 
                placeholder="Введите задачу"
            >
            <button @click="addTask">Добавить задачу</button>
            <span v-if="taskError" class="error-message">{{ taskError }}</span>
        </div>
    </div>   
 `,
    data() {
        return {
            newTaskName: '',
            taskError: ''
        }
    },
    methods: {
        onTaskCheck(task) {
            eventBus.$emit('task-checked', {
                task: task,
                cardId: this.cardId,
                columnId: this.columnId
            });
        },

        addTask() {
            if (this.newTaskName === '') {
                return;
            }

            const column = this.columns.find(column => column.id === this.columnId);
            const card = column.cards.find(card => card.id === this.cardId);

            if (card.tasks.length >= 5) {
                this.taskError = 'Максимальное количество задач';
                return;
            }

            const newTask = {
                name: this.newTaskName,
                checked: false
            };

            eventBus.$emit('task-add', {
                task: newTask,
                cardId: this.cardId,
                columnId: this.columnId
            });

            this.newTaskName = '';
            this.taskError =  '';
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
                        placeholder="Задача"
                    >
                </div>
            <button @click="addCard(column.id)">Добавить карточку</button>
            <span v-if="taskError" class="error-message">{{ taskError }}</span>
        </div>
        
        <div class="card__item" v-for="card in column.cards" :key="card.id">
            {{ card.title }}
            <div v-show="column.id === 2 && card.endTime != null">
                {{ card.endTime }}
            </div>
            <task 
                :tasks="card.tasks" 
                :cardId="card.id"
                :columnId="column.id"
                :columns="columns" 
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

            const column = this.columns.find(column => column.id === columnId);
            if (column.maxCards <= column.cards.length) {
                this.taskError = 'Достигнуто максимальное количество карточек';
                return;
            }

            const tasks = this.newCardTasks.map(task => ({
                    name: task,
                    checked: false
                }));

            const newCard = {
                id: new Date().toISOString() + Math.random() * 1000,
                title: this.newCardTitle,
                endTime: null,
                tasks: tasks
            };

            eventBus.$emit('card-add', {
                card: newCard,
                columnId: columnId
            });

            this.newCardTitle = '';
            this.newCardTasks = ['', '', ''];
            this.taskError = '';
        },
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
                            endTime: null,
                            tasks: [
                                {name: 'Задача 1', checked: false},
                                {name: 'Задача 2', checked: false}
                            ]
                        },
                        {
                            id: 2,
                            title: 'Завтра',
                            endTime: null,
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
                    cards: []
                },
                {
                    id: 2,
                    description: 'Третий',
                    maxCards: null,
                    cards: []
                },
            ]
        }
},
methods: {
    addCard({card, columnId}) {
        const column = this.columns.find(column => column.id === columnId);
        column.cards.push(card);
    },

    addTask({task, cardId, columnId}) {
        const column = this.columns.find(column => column.id === columnId);
        const card = column.cards.find(card => card.id === cardId);
        card.tasks.push(task);
    },

    onTaskChecked({ cardId, columnId}) {
        this.checkCardProgress(cardId, columnId);
    },

    checkCardProgress(cardId, currentColumnId) {
        let columnId = currentColumnId;

        while (columnId < 2) {
            const column = this.columns.find(column => column.id === columnId);
            const card = column.cards.find(card => card.id === cardId);

            const progress = (card.tasks.filter(t => t.checked).length / card.tasks.length) * 100;

            let nextColumnId = columnId;

            if (progress === 100) {
                nextColumnId = 2;
            } else if (columnId === 0 && progress > 50) {
                nextColumnId = 1;
            } else if (columnId === 1 && progress <= 50){
                nextColumnId = 0;
            }

            if (nextColumnId === columnId) break;

            if (nextColumnId === 2){
                card.endTime = new Date().toLocaleString();
            }

            const cardIndex = column.cards.findIndex(card => card.id === cardId);
            column.cards.splice(cardIndex, 1);

            const nextColumn = this.columns.find(column => column.id === nextColumnId);
            nextColumn.cards.push(card);

            columnId = nextColumnId;
        }
    }
},
    mounted() {
        eventBus.$on('card-add', this.addCard);
        eventBus.$on('task-add', this.addTask);
        eventBus.$on('task-checked', this.onTaskChecked);
    },
})