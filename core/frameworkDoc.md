# 🌟 نورة.js Documentation v2.0

> Lightweight, Reactive JavaScript Framework with Virtual DOM - Now React-like!

---

## 🚀 Overview

**نورة.js** has been upgraded with a **Virtual DOM** implementation and **React-like component system**! It now provides efficient DOM updates through diffing/patching, component-based architecture with local state management, and lifecycle methods - all while remaining lightweight and dependency-free.

---

## ✨ What's New in v2.0

### Virtual DOM
- **Efficient Updates**: Only modifies DOM elements that actually changed
- **Automatic Diffing**: Compares old and new virtual trees
- **Smart Patching**: Applies minimal changes to real DOM

### Component System
- **Class Components**: Full-featured components with lifecycle methods
- **Local State**: Each component manages its own state with `setState()`
- **Props**: Pass data between components
- **Lifecycle Hooks**: Control component behavior at different stages

---

## 📦 Core Components

### 1. `UI` – Virtual DOM ElementBuilder

Creates and efficiently renders HTML using Virtual DOM.

#### ✅ Usage

```js
const vnode = UI.createNode({
  tag: 'button',
  attrs: {
    className: 'btn',
    onClick: () => alert('Clicked!')
  },
  children: ['Click Me']
});

// First render - creates real DOM
UI.display(vnode, document.getElementById('app'));

// Subsequent renders - only updates what changed
UI.display(updatedVnode, document.getElementById('app'));
```

#### 🔧 Methods

* **`createNode({ tag, attrs, children, key })`**
  Creates a virtual node (VNode) - a lightweight JS object representing DOM

* **`display(vnode, container)`**
  Renders VNode to DOM. Uses Virtual DOM diffing for efficient updates.

* **`render(vnode)`**
  Converts a VNode to real DOM element

* **`diff(oldVNode, newVNode)`**
  Compares two VNodes and returns a patches object

* **`patch(node, patches)`**
  Applies patches to real DOM

---

### 2. `Component` – React-like Component Class

Build reusable, stateful components with lifecycle methods.

#### ✅ Usage

```js
import { Component } from './core/component.js';

class Counter extends Component {
  constructor(props) {
    super(props);
    this.state = { count: 0 };
  }

  componentDidMount() {
    console.log('Counter mounted!');
  }

  increment() {
    this.setState({ count: this.state.count + 1 });
  }

  render() {
    return UI.createNode({
      tag: 'div',
      children: [
        UI.createNode({
          tag: 'p',
          children: [`Count: ${this.state.count}`]
        }),
        UI.createNode({
          tag: 'button',
          attrs: { onClick: () => this.increment() },
          children: ['Increment']
        })
      ]
    });
  }
}

const counter = new Counter({ initialValue: 0 });
counter.mount(document.getElementById('app'));
```

#### 🔧 Component API

**State Management:**
* **`setState(newState)`** - Update state and trigger re-render
* **`setProps(newProps)`** - Update props and trigger re-render
* **`forceUpdate()`** - Force component to re-render

**Lifecycle Methods:**
* **`componentWillMount()`** - Before first render
* **`componentDidMount()`** - After first render
* **`componentWillUpdate(props, state)`** - Before updates
* **`componentDidUpdate(prevProps, prevState)`** - After updates
* **`componentWillUnmount()`** - Before component removal

**Required:**
* **`render()`** - Must return a VNode (must be implemented)

**Mounting:**
* **`mount(container)`** - Mount component to DOM
* **`unmount()`** - Remove component from DOM

---

### 3. `AppStore` – Global State Manager

Centralized reactive state for shared data across components.

#### ✅ Usage

```js
// Subscribe to state changes
AppStore.subscribe(state => {
  console.log('State updated:', state);
});

// Update state
AppStore.updateData({ user: 'Alice', count: 5 });

// Get current state
const state = AppStore.getData();
```

#### 🔧 Methods

* **`updateData(newData)`** - Merge new state and notify subscribers
* **`getData()`** - Get current state
* **`subscribe(callback)`** - Listen to state changes

---

### 4. `AppNavigator` – Hash-based Router

Client-side routing for single-page applications.

#### ✅ Usage

```js
AppNavigator.registerPath('/', () => {
  AppStore.updateData({ view: 'home' });
});

AppNavigator.registerPath('/test', () => {
  AppStore.updateData({ view: 'test' });
});

AppNavigator.goTo('/test');
```

#### 🔧 Methods

* **`registerPath(path, callback)`** - Register route handler
* **`processPathChange()`** - Handle hash changes
* **`goTo(path)`** - Navigate programmatically

---

### 5. `EventManager` – Event Delegation

Efficient event handling using delegation pattern.

#### ✅ Usage

```js
EventManager.attachHandler(document, 'click', (e) => {
  if (e.target.tagName === 'BUTTON') {
    console.log('Button clicked!');
  }
});
```

---

## 🧱 Complete Example

```js
import { CoreFramework } from './core/framework.js';
const { UI, Component, AppStore } = CoreFramework;

class TodoApp extends Component {
  constructor(props) {
    super(props);
    this.state = {
      todos: [],
      input: ''
    };
  }

  addTodo() {
    if (this.state.input.trim()) {
      this.setState({
        todos: [...this.state.todos, {
          id: Date.now(),
          text: this.state.input,
          completed: false
        }],
        input: ''
      });
    }
  }

  toggleTodo(id) {
    this.setState({
      todos: this.state.todos.map(todo =>
        todo.id === id 
          ? { ...todo, completed: !todo.completed }
          : todo
      )
    });
  }

  render() {
    return UI.createNode({
      tag: 'div',
      children: [
        UI.createNode({
          tag: 'h1',
          children: ['My Todos']
        }),
        UI.createNode({
          tag: 'input',
          attrs: {
            type: 'text',
            value: this.state.input,
            onkeyup: (e) => {
              this.setState({ input: e.target.value });
              if (e.key === 'Enter') this.addTodo();
            }
          }
        }),
        UI.createNode({
          tag: 'button',
          attrs: { onclick: () => this.addTodo() },
          children: ['Add']
        }),
        UI.createNode({
          tag: 'ul',
          children: this.state.todos.map(todo =>
            UI.createNode({
              tag: 'li',
              key: todo.id,
              attrs: {
                onclick: () => this.toggleTodo(todo.id),
                style: todo.completed ? 'text-decoration: line-through' : ''
              },
              children: [todo.text]
            })
          )
        })
      ]
    });
  }
}

const app = new TodoApp();
app.mount(document.getElementById('app'));
```

---

## ⚙️ How Virtual DOM Works

### 1. **Create Virtual Nodes**
```js
const vnode = UI.createNode({
  tag: 'div',
  children: ['Hello']
});
// Returns: { tag: 'div', attrs: {}, children: ['Hello'] }
```

### 2. **First Render**
```js
UI.display(vnode, container);
// Creates real DOM: <div>Hello</div>
```

### 3. **Update**
```js
const newVnode = UI.createNode({
  tag: 'div',
  children: ['World']
});
UI.display(newVnode, container);
// Diffs: finds text changed from 'Hello' to 'World'
// Patches: only updates text node, doesn't recreate div
```

### Benefits
- **Faster**: Only updates what changed
- **Efficient**: Minimizes expensive DOM operations
- **Smooth**: Enables smooth UI transitions

---

## 🎯 State Management Patterns

### Local Component State
Use for UI-specific state:
```js
this.setState({ isOpen: true });
```

### Global App State
Use for shared data:
```js
AppStore.updateData({ user: currentUser });
```

### Combining Both
```js
class UserProfile extends Component {
  constructor(props) {
    super(props);
    this.state = { editing: false }; // Local
    
    AppStore.subscribe(data => {
      this.setProps({ user: data.user }); // Global
    });
  }
}
```

---

## 🔄 Lifecycle Flow

```
1. constructor()
2. componentWillMount()
3. render()
4. componentDidMount()
   ↓ (state/props change)
5. componentWillUpdate()
6. render()
7. componentDidUpdate()
   ↓ (unmount)
8. componentWillUnmount()
```

---

## 📊 Performance Tips

1. **Use Keys**: Add `key` attribute to list items for efficient re-ordering
2. **Batch Updates**: Multiple `setState` calls are efficient
3. **Avoid Re-renders**: Only update state when necessary
4. **Pure Renders**: Make `render()` pure (no side effects)

---

## 🧪 Functional Components (Advanced)

```js
import { createComponent, useState } from './core/component.js';

const Counter = createComponent((props, state, setState) => {
  const [count, setCount] = useState(0);
  
  return UI.createNode({
    tag: 'div',
    children: [
      UI.createNode({ tag: 'p', children: [`Count: ${count}`] }),
      UI.createNode({
        tag: 'button',
        attrs: { onclick: () => setCount(count + 1) },
        children: ['Increment']
      })
    ]
  });
});
```

---

## 🎨 Philosophy

* **Virtual DOM** – Fast, efficient updates
* **Component-Based** – Reusable, composable UI
* **Reactive State** – Automatic UI updates
* **Zero Dependencies** – Lightweight and portable
* **React-Inspired** – Familiar API for developers

---

## 📚 API Summary

| Component       | Description                          |
| --------------- | ------------------------------------ |
| `UI`            | Virtual DOM renderer with diffing    |
| `Component`     | React-like component class           |
| `AppStore`      | Global reactive state manager        |
| `AppNavigator`  | Hash-based router                    |
| `EventManager`  | Event delegation utility             |
| `useState`      | Hook-like state for functional comps |
| `useEffect`     | Hook-like effects for side effects   |

---

## 🔮 What's Next

* ✅ Component composition & nesting
* ✅ Context API for deep prop passing
* ✅ Async component loading
* ✅ Dev tools for debugging
* ✅ Server-side rendering (SSR)
* ✅ Advanced hooks (useMemo, useCallback)

---

## 📜 License

**MIT** © 2025 **نورة.js** Team

---

---

## 📖 Simple Tutorial: Adding a New Page

### 🎯 Goal: Add a new page with just a header

This is the simplest example to get you started with creating new pages!

### Step 1: Register the Route

After your existing routes (around line 22), add:

```javascript
// Register the new page route
AppNavigator.registerPath('/mypage', () => {
    const myPage = new MyNewPage();
    myPage.mount(document.getElementById('app'));
});
```

**What this does:** Tells the router "when URL is `/mypage`, show MyNewPage component"

### Step 2: Create the Page Component

After the `createTaskId()` function (around line 28), add:

```javascript
// Create the new page component
class MyNewPage extends Component {
    render() {
        return UI.createNode({
            tag: 'div',
            children: [
                UI.createNode({
                    tag: 'h1',
                    children: ['Hello from My New Page! 👋']
                }),
                UI.createNode({
                    tag: 'p',
                    children: ['This is a brand new page!']
                }),
                UI.createNode({
                    tag: 'button',
                    attrs: {
                        onclick: () => AppNavigator.goTo('/'),
                        style: 'margin-top: 20px;'
                    },
                    children: ['← Back to Tasks']
                })
            ]
        });
    }
}
```

**What this does:** Creates the actual page with a header, paragraph, and back button

### Step 3: Add Navigation Button

In your main `TaskApp` render method, after the `h1` element, add:

```javascript
UI.createNode({
    tag: 'button',
    attrs: {
        onclick: () => AppNavigator.goTo('/mypage'),
        style: 'margin-bottom: 20px;'
    },
    children: ['Go to My Page →']
}),
```

**What this does:** Creates a button on your main page to navigate to the new page

### Step 4: Handle Button Click

In the `attachEventListeners()` method, add this case:

```javascript
else if (text === 'Go to My Page →') {
    AppNavigator.goTo('/mypage');
}
```

### 🎉 Done! 

Now you have:
- ✅ A new page at `/mypage`
- ✅ A button to navigate to it
- ✅ A back button to return

### 📍 Visual Summary

```
app.js structure:

1. Routes registration
   └─ Add new route here (/mypage)

2. Helper functions (createTaskId)
   └─ Add new page component here (MyNewPage)

3. TaskApp component
   └─ render() method
      └─ Add navigation button here
   └─ attachEventListeners()
      └─ Add button click handler here
```

---

## 💬 Feedback

GitHub: [github.com/mahdiatubly/noura.js](https://github.com/mahdiatubly/noura.js)