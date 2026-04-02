import { CoreFramework } from '../core/framework.js';

const { UI, AppNavigator, AppStore, EventManager, Component } = CoreFramework;

// Initialize app state
AppStore.updateData({
    tasks: [],
    view: 'all'
});

// Register routes
AppNavigator.registerPath('/', () => {
    AppStore.updateData({ view: 'all' });
});

AppNavigator.registerPath('/active', () => {
    AppStore.updateData({ view: 'active' });
});

AppNavigator.registerPath('/completed', () => {
    AppStore.updateData({ view: 'completed' });
});

AppNavigator.registerPath('/about', () => {
  var about = new About()
  about.mount(document.getElementById('app'));
});

AppNavigator.registerPath('/bateekha', () => {
    const page = new crazyPage();
    page.mount(document.getElementById('app'));
});

function createTaskId() {
    return '_' + Math.random().toString(36).substr(2, 9);
}


class About extends Component {
    render() {
        return UI.createNode({
            tag: 'div',
            children: [
                UI.createNode({
                    tag: 'h1',
                    children: ['About The project!!!']
                })
            ]
        });
    }
}


// Task App Component Class
class TaskApp extends Component {
    constructor(props) {
        super(props);
        this.state = AppStore.getData();
        
        // Subscribe to store changes
        AppStore.subscribe(data => {
            this.setState(data);
        });
    }

    componentDidMount() {
        this.attachEventListeners();
    }

    getVisibleTasks() {
        const { tasks, view } = this.state;
        if (view === 'all') return tasks;
        if (view === 'active') return tasks.filter(t => !t.completed);
        if (view === 'completed') return tasks.filter(t => t.completed);
        return tasks;
    }

    addTask() {
        const input = document.getElementById('new-task');
        const value = input ? input.value.trim() : '';

        if (value !== '') {
            const newTask = { 
                id: createTaskId(), 
                title: value, 
                completed: false 
            };
            AppStore.updateData({
                tasks: [...this.state.tasks, newTask]
            });
            if (input) input.value = '';
        }
    }

    toggleTask(id) {
        const tasks = this.state.tasks.map(task =>
            task.id === id ? { ...task, completed: !task.completed } : task
        );
        AppStore.updateData({ tasks });
    }

    deleteTask(id) {
        AppStore.updateData({
            tasks: this.state.tasks.filter(task => task.id !== id)
        });
    }

    updateTaskTitle(id, newTitle) {
        const tasks = this.state.tasks.map(task =>
            task.id === id ? { ...task, title: newTitle } : task
        );
        AppStore.updateData({ tasks });
    }

    clearCompleted() {
        AppStore.updateData({
            tasks: this.state.tasks.filter(task => !task.completed)
        });
    }

    toggleAllTasks() {
        const allCompleted = this.state.tasks.every(t => t.completed);
        const tasks = this.state.tasks.map(task => ({
            ...task,
            completed: !allCompleted
        }));
        AppStore.updateData({ tasks });
    }

    attachEventListeners() {
        EventManager.attachHandler(document, 'click', (e) => {
            if (e.target.tagName === 'BUTTON') {
                const text = e.target.textContent;
                
                if (text === 'All') {
                    AppNavigator.goTo('/');
                } else if (text === 'Active') {
                    AppNavigator.goTo('/active');
                } else if (text === 'Completed') {
                    AppNavigator.goTo('/completed');
                } else if (text === 'Add Task') {
                    this.addTask();
                } else if (text === 'Clear Done') {
                    this.clearCompleted();
                } else if (text === '✔️') {
                    this.toggleAllTasks();
                } else if (text === 'Delete') {
                    const taskSpan = e.target.parentNode.querySelector('span');
                    if (taskSpan) {
                        const id = taskSpan.dataset.taskId;
                        this.deleteTask(id);
                    }
                }
            }
        });

        EventManager.attachHandler(document, 'keydown', (e) => {
            if (e.key === 'Enter' && e.target.id === 'new-task') {
                this.addTask();
            }
        });

        EventManager.attachHandler(document, 'dblclick', (e) => {
            if (e.target.tagName === 'SPAN' && e.target.dataset.taskId) {
                const span = e.target;
                const originalTitle = span.textContent.trim();
                span.contentEditable = true;
                span.focus();

                const saveEdit = () => {
                    const newTitle = span.textContent.trim();
                    if (newTitle !== '') {
                        this.updateTaskTitle(span.dataset.taskId, newTitle);
                    } else {
                        span.textContent = originalTitle;
                    }
                    span.contentEditable = false;
                };

                const onBlur = () => {
                    span.textContent = originalTitle;
                    span.contentEditable = false;
                    span.removeEventListener('blur', onBlur);
                    span.removeEventListener('keydown', onEnter);
                };

                const onEnter = (evt) => {
                    if (evt.key === 'Enter') {
                        evt.preventDefault();
                        saveEdit();
                        span.removeEventListener('blur', onBlur);
                        span.removeEventListener('keydown', onEnter);
                    }
                };

                span.addEventListener('blur', onBlur);
                span.addEventListener('keydown', onEnter);
            }
        });
    }

    render() {
        const { tasks, view } = this.state;
        const visibleTasks = this.getVisibleTasks();
        const activeCount = tasks.filter(t => !t.completed).length;

        const taskItems = visibleTasks.map(task =>
            UI.createNode({
                tag: 'li',
                key: task.id,
                attrs: { class: task.completed ? 'completed' : '' },
                children: [
                    UI.createNode({
                        tag: 'input',
                        attrs: {
                            type: 'checkbox',
                            checked: task.completed,
                            onchange: () => this.toggleTask(task.id)
                        }
                    }),
                    UI.createNode({
                        tag: 'span',
                        children: [task.title],
                        attrs: { 
                            contentEditable: 'false', 
                            'data-task-id': task.id 
                        }
                    }),
                    UI.createNode({
                        tag: 'button',
                        attrs: { class: 'remove-btn' },
                        children: ['Delete']
                    }),
                ]
            })
        );

        const filterControls = tasks.length > 0 ? UI.createNode({
            tag: 'filters',
            children: [
                UI.createNode({
                    tag: 'p',
                    children: [`${activeCount} item${activeCount === 1 ? '' : 's'} left`]
                }),
                UI.createNode({
                    tag: 'div',
                    children: [
                        UI.createNode({
                            tag: 'button',
                            id: 'all-btn',
                            attrs: { class: view === 'all' ? 'active' : '' },
                            children: ['All']
                        }),
                        UI.createNode({
                            tag: 'button',
                            id: 'active-btn',
                            attrs: { class: view === 'active' ? 'active' : '' },
                            children: ['Active']
                        }),
                        UI.createNode({
                            tag: 'button',
                            id: 'completed-btn',
                            attrs: { class: view === 'completed' ? 'active' : '' },
                            children: ['Completed']
                        }),
                        UI.createNode({
                            tag: 'button',
                            id: 'clear-btn',
                            children: ['Clear Done']
                        })
                    ]
                })
            ]
        }) : '';

        const firstRowChildren = [];
        
        if (tasks.length > 0) {
            firstRowChildren.push(
                UI.createNode({
                    tag: 'button',
                    children: ['✔️'],
                    attrs: { class: 'select-all' }
                })
            );
        }
        
        firstRowChildren.push(
            UI.createNode({
                tag: 'button',
                children: ['Add Task']
            })
        );

        const children = [
            UI.createNode({
                tag: 'h1',
                children: ['Task App']
            }),
            UI.createNode({
                tag: 'input',
                attrs: { 
                    type: 'text', 
                    id: 'new-task', 
                    placeholder: 'Enter a new task' 
                }
            }),
            UI.createNode({
                tag: 'div',
                attrs: { class: 'first-row' },
                children: firstRowChildren
            })
        ];

        if (tasks.length > 0) {
            children.push(filterControls);
        }

        children.push(
            UI.createNode({
                tag: 'ul',
                children: taskItems
            })
        );

        return UI.createNode({
            tag: 'div',
            children: children
        });
    }
}

class crazyPage extends Component {
    render() {
        return UI.createNode({
            tag: 'div',
            children: [
                UI.createNode({
                    tag: 'h1',
                    children: ['FFFFFFFFFFFFFFFFFFFFFF ********* FFFFFFFFFFFFFFFFFFFFF']
                }),
                UI.createNode({
                    tag: 'button',
                    attrs: { onclick: () => AppNavigator.goTo('/') },
                    children: ['← Back to Tasks']
                })
            ]
        });
    }
}

// Initialize and mount the app
const app = new TaskApp();
app.mount(document.getElementById('app'));