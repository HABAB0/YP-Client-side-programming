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
                <input type="checkbox" v-model="task.checked" @change="onTaskCheck(task)" :disabled="columnId === 2">
            </label>
        </div>
        
        <div v-show="this.columnId != 2">
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
        blockColumn: Boolean,
        isBlock: Boolean,
    },
    template: `
<div class="column__container">
    <div 
        v-for="column in columns" 
        :key="column.id" 
        class="column__item"
        >
        <h3>{{ column.description }}</h3>
        <div v-show="blockColumn && column.id === 0" class="blocked-column">Столбец заблокирован для редактирования</div>
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
        
        <div 
            class="card__item" 
            v-for="(card, index) in column.cards" 
            :key="card.id"
            :draggable="!blockColumn"
            @dragstart="onDragStart($event, index, column.id)"
            @dragover.prevent="onDragOver($event, index, column.id)"
            @drop="onDrop($event, index, column.id)"
        >
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
            taskError: '',
            blockColumn: false,
            isBlocked: false,

            isDragging: false,
            draggedIndex: null,
            targetIndex: null,
            draggedColumnId: null
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
                tasks: tasks,
                isBlocked: this.isBlocked,
            };

            eventBus.$emit('card-add', {
                card: newCard,
                columnId: columnId
            });

            this.newCardTitle = '';
            this.newCardTasks = ['', '', ''];
            this.taskError = '';
        },

        onDragStart(event, index, columnId) {

            this.draggedIndex = index;
            this.draggedColumnId = columnId;
            this.isDragging = true;

            eventBus.$emit('drag-start', {
                draggedIndex: index,
                columnId: columnId
            });
        },

        onDragOver(event, index, columnId) {
            event.preventDefault();
            this.targetIndex = index;
        },

        onDrop(event, targetIndex, columnId) {

            event.preventDefault();

            if (this.draggedIndex === targetIndex) {
                this.resetDragState();
                return;
            }

            eventBus.$emit('card-reorder', {
                draggedIndex: this.draggedIndex,
                targetIndex: targetIndex,
                columnId: columnId
            });

            this.resetDragState();
        },

        resetDragState() {
            this.isDragging = false;
            this.draggedIndex = null;
            this.targetIndex = null;
            this.draggedColumnId = null;
        },
    },
    mounted() {
        eventBus.$on('block-column', blockColumn => {
            this.blockColumn = blockColumn;
        })
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
                    cards: []
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
            ],
            selectedItems: [],
            dragItem: null,
            dragColumn: ''
        }
},
methods: {
    addCard({card, columnId}) {
        const column = this.columns.find(column => column.id === columnId);
        column.cards.push(card);
        eventBus.$emit('save');
    },

    addTask({task, cardId, columnId}) {
        const column = this.columns.find(column => column.id === columnId);
        const card = column.cards.find(card => card.id === cardId);
        card.tasks.push(task);
        eventBus.$emit('save');
    },

    onTaskChecked({ cardId, columnId}) {
        this.checkCardProcent(cardId, columnId);
        eventBus.$emit('save');
    },

    checkCardProcent(cardId, currentColumnId) {
        let columnId = currentColumnId;

        while (columnId < 2) {
            const column = this.columns.find(column => column.id === columnId);
            const card = column.cards.find(card => card.id === cardId);
            const cardIndex = column.cards.findIndex(card => card.id === cardId);
            const secondColumn = this.columns.find(column => column.id === 1);
            const procent = (card.tasks.filter(t => t.checked).length / card.tasks.length) * 100;
            const firstColumn = this.columns.find(column => column.id === 0);

            let nextColumnId = columnId;

            if (procent === 100) {
                nextColumnId = 2;
            } else if (columnId === 0 && procent > 50) {
                nextColumnId = 1;
            } else if (columnId === 1 && procent <= 50){
                nextColumnId = 0;
            }

            const nextColumn = this.columns.find(column => column.id === nextColumnId);

            if (nextColumnId === columnId) break;

            if (nextColumn.maxCards && nextColumn.maxCards <= nextColumn.cards.length) {
                if (nextColumnId === 1) {
                    card.isBlocked = true;
                    this.columnBlock()
                    break
                }else {
                    break
                }
            }

            if (nextColumnId === 2){
                card.endTime = new Date().toLocaleString();
            }

            column.cards.splice(cardIndex, 1);

            nextColumn.cards.push(card);
            eventBus.$emit('save');


            const blockedCard = firstColumn.cards.find(card => card.isBlocked === true);
            const blockedCardIndex = firstColumn.cards.findIndex(card => card?.isBlocked === true);

            if (blockedCardIndex !== -1 && secondColumn.maxCards > secondColumn.cards.length ) {
                firstColumn.cards.splice(blockedCardIndex, 1);
                secondColumn.cards.push(blockedCard);
                blockedCard.isBlocked = false;
                eventBus.$emit('save');
            }

            columnId = nextColumnId;
            this.columnBlock();
            eventBus.$emit('save');
        }
    },


    columnBlock() {
        const firstColumn = this.columns.find(column => column.id === 0);
        const secondColumn = this.columns.find(column => column.id === 1);

        const fullSecondColumn = secondColumn.cards.length >= secondColumn.maxCards

        if (!fullSecondColumn) {
            eventBus.$emit('block-column', false);
            return;
        }

        if (firstColumn.cards.find(card => (card.tasks.filter(t => t.checked).length / card.tasks.length) * 100 > 50
        )) {
            eventBus.$emit('block-column', true);
        }else {
            eventBus.$emit('block-column', false);
        }
        eventBus.$emit('save');
    },

    dragCards({draggedIndex, targetIndex, columnId}) {

        const column = this.columns.find(column => column.id === columnId);
        if (!column) return;

        if (draggedIndex === targetIndex || draggedIndex < 0 || targetIndex < 0 || draggedIndex >= column.cards.length || targetIndex >= column.cards.length) {
            return;
        }

        const findCard = column.cards.splice(draggedIndex, 1);
        const draggedCard = findCard[0];

        column.cards.splice(targetIndex, 0, draggedCard);

        this.saveData();
    },

    saveData() {
        localStorage.setItem('columns', JSON.stringify(this.columns));
    }


},
    mounted() {
        const localStore = JSON.parse(localStorage.getItem('columns'));
        if (localStore) {
            this.columns = localStore;
        }

        eventBus.$on('card-add', this.addCard);
        eventBus.$on('task-add', this.addTask);
        eventBus.$on('task-checked', this.onTaskChecked);
        eventBus.$on('save', this.saveData);
        eventBus.$on('card-reorder', this.dragCards);
    },
})