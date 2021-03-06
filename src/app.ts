import sun from '../assets/images/icon-sun.svg';
import moon from '../assets/images/icon-moon.svg';
import Sortable from 'sortablejs';

enum THEMES {
    LIGHT = 'LIGHT',
    DARK = 'DARK',
}

const styles = {
    [THEMES.DARK]: {
        '--body-background': 'var(--very-dark-desaturated-blue)',
        '--body-color': 'var(--light-grayish-blue)',
        '--bg-header-small': 'var(--dark-bg-image-small)',
        '--bg-header-large': 'var(--dark-bg-image-large)',
        '--todo-card-bg-color': 'var(--very-dark-grayish-blue-hover)',
        '--todo-card-bg-color-hover': 'var(--very-dark-grayish-blue)',
        '--todo-card__action-filter': 'var(--dark-action-filter)',
        '--todo-card-border-color': 'var(--very-dark-grayish-blue)',
    },
    [THEMES.LIGHT]: {
        '--body-background': 'var(--very-light-gray)',
        '--body-color': 'var(--very-dark-grayish-blue)',
        '--bg-header-small': 'var(--light-bg-image-small)',
        '--bg-header-large': 'var(--light-bg-image-large)',
        '--todo-card-bg-color': 'var(--very-light-gray)',
        '--todo-card-bg-color-hover': 'var(--light-grayish-blue-hover)',
        '--todo-card__action-filter': 'var(--light-action-filter)',
        '--todo-card-border-color': 'var(--very-light-grayish-blue)',
    },
}
type todoItem = {
    id: number,
    text: string,
    done: boolean
}

let theme = localStorage.getItem('theme') ?? THEMES.LIGHT,
    filter = localStorage.getItem('filter') ?? 'all';

document.querySelector('.header__icon')?.addEventListener('click', e => {
    theme = theme === THEMES.LIGHT ? THEMES.DARK : THEMES.LIGHT;
    renderTheme();
})

let todoItems: todoItem[] = localStorage.getItem('todoItems')
                            ? JSON.parse(localStorage.getItem('todoItems')!) 
                            : [
    { id: 0, text: 'Complete online JavaScript course', done: true },
    { id: 1, text: 'Jog around the park 3x', done: false },
    { id: 2, text: '10 minutes meditation', done: false },
    { id: 3, text: 'Read for 1 hour', done: false },
    { id: 4, text: 'Pick up groceries', done: false },
    { id: 5, text: 'Complete Todo App on Frontend Mentor', done: false }
];

const todoListElm = document.getElementById('todo-list') as HTMLDivElement;
const TodoItem = (item: todoItem) => {
    const todoCard = document.createElement('div');
    todoCard.className = 'todo-card';
    todoCard.draggable = true;

    const todoItem = document.createElement('div');
    todoItem.className = 'todo-item';
    todoItem.innerHTML = `
        <label class="todo-item__checkbox">
            <input type="checkbox" name="checkbox"/>
            <div class="checkbox">
                <div class="checkbox--checked"></div>
            </div>
        </label>
        <div class="todo-item__text${item.done ? ' todo-item__text--done' : ''}">${item.text}</div>
    `;
    (todoItem.children[0].children[0] as HTMLInputElement).checked = item.done;

    todoItem.addEventListener('click', e => {
        e.preventDefault();
        const ind = todoItems.findIndex((elm: todoItem) => elm.id === item.id);
        todoItems[ind].done = todoItems[ind].done ? false : true;
        renderItems();
    });

    const todoAction = document.createElement('div');
    todoAction.className = 'todo-card__action';
    todoAction.innerHTML = `<div class="close-icon"></div>`;
    todoAction.addEventListener('click', e => {
        todoItems = todoItems.filter((elm: todoItem) => elm.id !== item.id);
        renderItems();
    });

    todoCard.append(todoItem, todoAction);
    return todoCard;
}

document.getElementById(filter)?.classList.add('todo-card__toolbar--active'); //* add filter button effect
document.querySelector('.toolbar>.todo-card')?.addEventListener('click', e => {
    if (e.target === e.currentTarget) return;
    const toolbarCard = e.currentTarget as HTMLDivElement;

    for (let ind in toolbarCard.children)
        if (typeof toolbarCard.children[ind] === 'object') {
            toolbarCard.children[ind].classList.remove('todo-card__toolbar--active')
        }
    const target = e.target as HTMLDivElement;
    target.classList.add('todo-card__toolbar--active');
    filter = target.id;
    localStorage.setItem('filter', filter);
    renderItems();
});

let timer;
const spinnerElm = document.getElementById('spinner') as HTMLDivElement;
const addTodoElm = document.getElementById('add-todo') as HTMLInputElement;
addTodoElm.addEventListener('input', e => {
    spinnerElm.classList.remove('action--checked');
    clearTimeout(timer);
    spinnerElm.classList.add('loader-icon');
    timer = setTimeout(() => {
        spinnerElm.classList.remove('loader-icon');
        if ((e.target as HTMLInputElement).value)
            spinnerElm.classList.add('action--checked');
        timer = null;
    }, 2000);
});

document.getElementById('add-todo-item')?.addEventListener('submit', e => {
    e.preventDefault();
    if (addTodoElm.value && !timer) {
        todoItems.push({ id: todoItems.length, text: addTodoElm.value, done: false });
        addTodoElm.value = '';
        spinnerElm.classList.remove('action--checked');
        renderItems();
    }
});

renderTheme();
renderItems();


function renderTheme() {
    const icon = (document.querySelector('.header__icon img') as HTMLImageElement);
    icon.src = theme === THEMES.LIGHT ? moon : sun;

    Object.keys(styles[theme]).forEach(key => document.documentElement.style.setProperty(key, styles[theme][key]));
    localStorage.setItem('theme', theme);
}

function renderItems() {
    todoListElm.innerHTML = '';
    localStorage.setItem('todoItems', JSON.stringify(todoItems));

    const filterList = todoItems.filter((item: todoItem) =>
        filter === 'active'
            ? !item.done
            : filter === 'completed'
                ? item.done : true);
    filterList.forEach((item: todoItem) => todoListElm.appendChild(TodoItem(item)));

    //* add todo control card
    const todoControl = document.createElement('div');
    todoControl.className = 'todo-card todo-list__control';
    todoControl.innerHTML = `<div class="todo-card__control">${filterList.length} items left</div><div class="todo-card__control todo-card__btn">Clear Completed</div>`;
    todoControl.children[1].addEventListener('click', e => {
        todoItems = todoItems.filter((elm: todoItem) => !elm.done);
        renderItems();
    });
    todoListElm.appendChild(todoControl);

    // add drag and drop effect
    document.querySelectorAll('.todo-list').forEach( (card:any) => {
        if (true) {
            new Sortable(card, {
                group: "shared",
                // filter: '.todo-list__control',
                animation: 150,
                ghostClass: "blue-background-class"
            });
        }
    })
}