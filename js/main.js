const eventBus = new Vue();


Vue.component('column', {
    props: {
        columns: Array,
        exportColumn: Object,
        cardDayDeadline: Boolean,
    },
    template: `
<div class="column-wrap">
    <div class="column__container">
        <div v-for="column in columns" :key="column.id" class="column__item">
            <h3>{{ column.description }}</h3>
             <span v-show="column.maxCards" class="card-count">({{ column.cards.length }} / {{ column.maxCards }})</span>
             <span v-show="column.maxCards === null" class="card-count">({{ column.cards.length }})</span>
             <button
                v-show="exportColumn.cards && column.cards.length > 0 && column.id === 3"
                @click="exportCards()"
                class="btn-export"
            >Экспортировать карточки</button>
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
                        >
                    </div>
                <button v-show="!cardDayDeadline" @click="addCard(column.id)" class="btn-export">Добавить карточку</button>
                <span v-show="cardDayDeadline">Превышен лимит карточек с дедлайном меньше 24 часов </span>
                <span v-show="taskError" class="error-message">{{ taskError }}</span>
            </div>
            
        <div class="card__item" v-for="card in column.cards" :key="card.id">
        <div class="card__header">
            <h4 class="card__title">{{ card.title }}</h4>
        </div>
    
        <div class="card__info">
            <div class="card__info-item">
                <span class="card__info-label">📅 Создано:</span>
                <span class="card__info-value">{{ card.createTime }}</span>
            </div>
            <div class="card__info-item">
                <span class="card__info-label">⏰ Дедлайн:</span>
                <span class="card__info-value">{{ card.deadline }}</span>
            </div>
            <div class="card__info-item">
                <span class="card__info-label">📝 Задача:</span>
                <span class="card__info-value">{{ card.task }}</span>
            </div>
        </div>
    
        <div v-show="card.editTime" class="card__edit-time">
            <span class="card__edit-icon">✏️</span>
            <span class="card__edit-label">Изменено:</span>
            <span class="card__edit-value">{{ card.editTime }}</span>
        </div>
    
        <div v-show="card.whyBack" class="card__why-back">
            <span class="card__back-icon">🔄</span>
            <span class="card__back-label">Причина возврата:</span>
            <span class="card__back-value">{{ card.whyBack }}</span>
        </div>
    
        <div v-show="column.id == 3" class="card__status">
            <div v-if="card.inTime" class="card__status-badge card__status-success">
                ✅ Задача сделана в срок
            </div>
            <div v-else class="card__status-badge card__status-late">
                ⏰ Задача просрочена
            </div>
        </div>
        <div v-show="column.id !== 3" class="card__actions">
            <button class="card__btn card__btn-delete" @click="deleteCard(card.id, column.id)">
                🗑️ Удалить
            </button>
            
            <button 
                class="card__btn card__btn-edit" 
                @click="openEditCard(card.id, column.id)" 
                v-show="!card.isRedact"
            >
                ✏️ Изменить
            </button>
       
            <button 
                v-show="column.id != 3" 
                class="card__btn card__btn-forward" 
                @click="changeColumn(card.id, column.id)"
            >
                ➡️ Вперёд
            </button>
        </div>
    
        <div v-show="card.isRedact" class="card__edit-form">
            <div class="card__edit-group">
                <label class="card__edit-label">Название:</label>
                <input 
                    type="text" 
                    v-model="editCardTitle" 
                    class="card__edit-input"
                    placeholder="Введите название карточки"
                >
            </div>
            
            <div class="card__edit-group">
                <label class="card__edit-label">Задача:</label>
                <input 
                    type="text" 
                    v-model="editCardTask" 
                    class="card__edit-input"
                    placeholder="Задача"
                >
            </div>
            
            <div class="card__edit-group">
                <label class="card__edit-label">Дедлайн:</label>
                <input 
                    type="date" 
                    v-model="editCardDeadline" 
                    class="card__edit-input"
                    placeholder="Дедлайн"
                >
            </div>
            
            <span v-if="editErrors" class="card__error">{{ editErrors }}</span>
            
            <div class="card__edit-buttons">
                <button class="card__btn card__btn-save" @click="editCard(card.id, column.id)">
                    💾 Сохранить
                </button>
                <button class="card__btn card__btn-cancel" @click="cancelEditCard(card.id, column.id)">
                    ❌ Отмена
                </button>
            </div>
        </div>
    
        <div v-show="column.id == 2" class="card__back-form">
            <div class="card__back-group">
                <label class="card__back-label">Причина возврата:</label>
                <input 
                    type="text" 
                    v-model="whyBack" 
                    class="card__back-input"
                    placeholder="Причина Возврата"
                >
            </div>
            
            <span v-if="whyBackError" class="card__error">{{ whyBackError }}</span>
            
            <button class="card__btn card__btn-back" @click="changeColumnBack(card.id, column.id)">
                ⬅️ Назад
            </button>
        </div>
    </div>
        </div>
    </div>
    <div v-show="exportColumn.cards" class="export-column">
        <div
            v-for="card in exportColumn.cards"
            :key="card.id"
            class="export-item"
        >
            <div class="card__header">
            <h4 class="card__title">{{ card.title }}</h4>
        </div>
    
        <div class="card__info">
            <div class="card__info-item">
                <span class="card__info-label">📅 Создано:</span>
                <span class="card__info-value">{{ card.createTime }}</span>
            </div>
            <div class="card__info-item">
                <span class="card__info-label">⏰ Дедлайн:</span>
                <span class="card__info-value">{{ card.deadline }}</span>
            </div>
            <div class="card__info-item">
                <span class="card__info-label">📝 Задача:</span>
                <span class="card__info-value">{{ card.task }}</span>
            </div>
        </div>
    
        <div v-show="card.editTime" class="card__edit-time">
            <span class="card__edit-icon">✏️</span>
            <span class="card__edit-label">Изменено:</span>
            <span class="card__edit-value">{{ card.editTime }}</span>
        </div>
    
        <div v-show="card.whyBack" class="card__why-back">
            <span class="card__back-icon">🔄</span>
            <span class="card__back-label">Причина возврата:</span>
            <span class="card__back-value">{{ card.whyBack }}</span>
        </div>
    
        <div v-if="card.inTime" class="card__status-badge card__status-success">
            ✅ Задача сделана в срок
        </div>
        <div v-else class="card__status-badge card__status-late">
            ⏰ Задача просрочена
        </div>
        </div>
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
            inTime: '',
            whyBack: '',
            whyBackError: '',
            isDayDeadline: false,

            editCardTitle: '',
            editCardTask: '',
            editCardDeadline: '',
            editErrors: ''
        }
    },
    computed: {
        nearDeadlineCardsCount() {
            let count = 0;

            this.columns.slice(0, 3).forEach(column => {
                if (!column.cards) return;

                column.cards.forEach(card => {

                    const timeSection = (new Date(card.deadline) - new Date()) / 3600000;

                    if (timeSection <= 24) {
                        count++;
                    }
                });
            });
            return count;
        },

        cardDayDeadline() {
            return this.nearDeadlineCardsCount >= 2;
        }
    },
    methods: {

        exportCards() {
            eventBus.$emit('card-export');
        },

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

            const today = new Date()

            const newCard = {
                id: new Date().toISOString() + Math.random() * 1000,
                title: this.newCardTitle,
                createTime: `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`,
                task: this.newCardTask,
                deadline: this.newCardDeadline,
                inTime: false,
                whyBack: this.whyBack,
                isRedact: false,
                isDayDeadline: this.isDayDeadline,
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
        },

        changeColumnBack(cardId, columnId) {
            if (this.whyBack === '') {
                this.whyBackError = 'Введите причину возврата';
                return;
            }
            const column = this.columns.find(column => column.id === columnId);
            const card = column.cards.find(card => card.id === cardId);
            card.whyBack = this.whyBack;
            this.whyBack = '';
            this.whyBackError = ''
            eventBus.$emit('change-column-back', {cardId: cardId, columnId: columnId});
        },


        openEditCard(cardId, columnId) {

            const column = this.columns.find(c => c.id === columnId);
            const card = column.cards.find(c => c.id === cardId);

            this.editCardTitle = card.title;
            this.editCardTask = card.task;
            this.editCardDeadline = card.deadline;
            this.editErrors = '';

            card.isRedact = true;
        },

        editCard(cardId, columnId) {

            const column = this.columns.find(c => c.id === columnId);
            const card = column.cards.find(c => c.id === cardId);

            if (this.editCardTitle === '') {
                this.editErrors = 'Введите заголовок карточки';
                return;
            }

            if (this.editCardTask === '') {
                this.editErrors = 'Введите задачу карточки';
                return;
            }

            if (this.editCardDeadline === '') {
                this.editErrors = 'Введите дедлайн карточки';
                return;
            }

            const editedCard = {
                id: card.id,
                title: this.editCardTitle,
                createTime: card.createTime,
                task: this.editCardTask,
                deadline: this.editCardDeadline,
                editTime: `${new Date().getFullYear()}-${new Date().getMonth() + 1}-${new Date().getDate()}`,
                inTime: card.inTime,
                whyBack: card.whyBack,
                isRedact: false
            };

            eventBus.$emit('edit-card-add', {
                card: editedCard,
                columnId: columnId
            });

            card.isRedact = false;
            this.editErrors = '';
        },

        cancelEditCard(cardId, columnId) {
            const column = this.columns.find(c => c.id === columnId);
            const card = column.cards.find(c => c.id === cardId);

            if (card) {
                card.isRedact = false;
            }

            this.editErrors = '';
        },
    },
})

let app = new Vue({
    el: '#app',
    data(){
        return {
            columns: [
                {
                    id: 0,
                    description: 'Запланированные задачи',
                    maxCards: null,
                    cards: []
                },
                {
                    id: 1,
                    description: 'Задачи в работе',
                    maxCards: null,
                    cards: []
                },
                {
                    id: 2,
                    description: 'Тестирование',
                    maxCards: null,
                    cards: []
                },
                {
                    id: 3,
                    description: 'Выполненные задачи',
                    maxCards: null,
                    cards: []
                },
            ],
            exportColumn: {
                cards: []
            },
            cardDayDeadline: false
        }
    },
    methods: {

        exportCards() {
            const fourthColumn = this.columns.find(column => column.id === 3);
            console.log(fourthColumn.cards);
            if (fourthColumn && fourthColumn.cards.length > 0) {
                this.exportColumn.cards = fourthColumn.cards;
                console.log(this.exportColumn.cards);
            }
            eventBus.$emit('save');
        },

        addCard({card, columnId}) {
            const column = this.columns.find(column => column.id === columnId);
            column.cards.push(card);
            eventBus.$emit('save');
        },

        changeColumn({cardId, columnId}) {


            const column = this.columns.find(column => column.id === columnId);
            const card = column.cards.find(card => card.id === cardId);
            const nextColumn = this.columns.find(column => column.id === columnId + 1);
            const cardIndex = column.cards.findIndex(card => card.id === cardId);
            const now = new Date()
            if (columnId === 3) {
                return;
            }

            column.cards.splice(cardIndex, 1);

            nextColumn.cards.push(card);

            eventBus.$emit('save');
        },

        changeColumnBack({cardId, columnId}) {

            if (columnId !== 2) {
                return;
            }
            const column = this.columns.find(column => column.id === columnId);
            const card = column.cards.find(card => card.id === cardId);
            const previousColumn = this.columns.find(column => column.id === columnId - 1);
            const cardIndex = column.cards.findIndex(card => card.id === cardId);

            column.cards.splice(cardIndex, 1);
            console.log(previousColumn.id)
            previousColumn.cards.push(card);
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

        editAddCard({card, columnId}) {
            const column = this.columns.find(c => c.id === columnId);
            const cardIndex = column.cards.findIndex(c => c.id === card.id);

            if (cardIndex !== -1) {
                column.cards.splice(cardIndex, 1, card);
            }

            this.saveData();
        },

        saveData() {
            localStorage.setItem('columns', JSON.stringify(this.columns));
            localStorage.setItem('exportColumn', JSON.stringify(this.exportColumn));
        }


    },
    mounted() {
        const localStore = JSON.parse(localStorage.getItem('columns'));
        const localStoreExport = (JSON.parse(localStorage.getItem('exportColumn')) || []);
        if (localStore) {
            this.columns = localStore;
            this.exportColumn = localStoreExport;
        }

        eventBus.$on('card-add', this.addCard);
        eventBus.$on('edit-card-add', this.editAddCard);
        eventBus.$on('delete-card', this.deleteCard);
        eventBus.$on('save', this.saveData);
        eventBus.$on('change-column', this.changeColumn);
        eventBus.$on('change-column-back', this.changeColumnBack);
        eventBus.$on('card-export', this.exportCards);
    },
})