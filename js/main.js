const eventBus = new Vue();


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
            
            <div class="task-input">
                    <input 
                        type="text" 
                        v-model="newCardTask" 
                        placeholder="Задача"
                    >
                    <input 
                        type="date" 
                        v-model="newCardDeadline" 
                        placeholder="Дедлайн"
                        required
                    >
                </div>
            <button @click="addCard(column.id)">Добавить карточку</button>
            <span v-if="taskError" class="error-message">{{ taskError }}</span>
        </div>
        
        <div class="card__item" v-for="card in column.cards" :key="card.id">
            {{ card.title }}
            {{ card.createTime }}
            {{ card.deadline }}
            {{ card.task }}
            <button @click="deleteCard(card.id , column.id)">Х</button>
            <button v-show="column.id != 3" @click="changeColumn(card.id , column.id)">Переместить</button>
        </div>
    </div> 
</div>  
 `,
    data() {
        return {
            newCardTitle: '',
            newCardTask: '',
            newCardDeadline: '',
            taskError: '',
            createTime: '',
        }
    },
    methods: {

        addCard(columnId) {
            if (this.newCardTitle === '') {
                this.taskError = 'Введите заголовок карточки';
                return;
            }

            if (this.newCardTask === '') {
                this.taskError = 'Введите задачу карточки';
                return;
            }

            if (this.newCardDeadline === '') {
                this.taskError = 'Введите дедлайн карточки';
                return;
            }

            const column = this.columns.find(column => column.id === columnId);
            if (column.maxCards <= column.cards.length) {
                this.taskError = 'Достигнуто максимальное количество карточек';
                return;
            }

            const newCard = {
                id: new Date().toISOString() + Math.random() * 1000,
                title: this.newCardTitle,
                createTime: new Date().toLocaleString(),
                task: this.newCardTask,
                deadline: this.newCardDeadline,
            };

            eventBus.$emit('card-add', {
                card: newCard,
                columnId: columnId
            });

            this.newCardTitle = '';
            this.newCardTask = '';
            this.taskError = '';
        },

        deleteCard(cardId, columnId) {
            eventBus.$emit('delete-card', {cardId: cardId, columnId: columnId});
        },

        changeColumn(cardId, columnId) {
            eventBus.$emit('change-column', {cardId: cardId, columnId: columnId});
        }
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
                    description: 'Запланированные задачи',
                    maxCards: 3,
                    cards: []
                },
                {
                    id: 1,
                    description: 'Задачи в работе',
                    maxCards: 5,
                    cards: []
                },
                {
                    id: 2,
                    description: 'Тестирование',
                    maxCards: 5,
                    cards: []
                },
                {
                    id: 3,
                    description: 'Выполненные задачи',
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
            eventBus.$emit('save');
        },

        changeColumn({cardId, columnId}) {

            if (columnId === 3) {
                return;
            }

            const column = this.columns.find(column => column.id === columnId);
            const card = column.cards.find(card => card.id === cardId);
            const nextColumn = this.columns.find(column => column.id === columnId + 1);
            console.log(column);
            console.log(card);
            console.log(nextColumn);
            const cardIndex = column.cards.findIndex(card => card.id === cardId);
            column.cards.splice(cardIndex, 1);

            nextColumn.cards.push(card);

            eventBus.$emit('save');
        },

        deleteCard({id, columnId}) {
            const currentColumn = this.columns.find(column => column.id === columnId);
            if (currentColumn.cards){
                const deletedCard = currentColumn.cards.findIndex(card => card.id === id);
                currentColumn.cards.splice(deletedCard, 1);
            }
            eventBus.$emit('save');
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
        eventBus.$on('delete-card', this.deleteCard);
        eventBus.$on('save', this.saveData);
        eventBus.$on('change-column', this.changeColumn);

    },
})