# 🌟 نورة.js Documentation

> Lightweight, Reactive, and Modular JavaScript Framework for Building SPAs

---

## 🚀 Overview

**نورة.js** is a minimal front-end JavaScript framework for building dynamic single-page applications (SPAs). Designed with clarity and simplicity in mind, it provides a declarative approach to building UI components, centralized state management, hash-based routing, and event delegation—all with zero dependencies.

---

## 📦 Core Components

### 1. `UI` – ElementBuilder

Used to create and render HTML nodes declaratively.

#### ✅ Usage

```js
const button = UI.createNode({
  tag: 'button',
  attrs: {
    className: 'btn',
    onClick: () => alert('Clicked!')
  },
  children: 'Click Me'
});

UI.display(button, document.getElementById('app'));
```

#### 🔧 Methods

* **`createNode({ tag, attrs, children })`**
  Creates an HTML element with attributes, events, and children.

* **`display(node, container)`**
  Renders the `node` inside the `container`, replacing previous content.

---

### 2. `AppStore` – StoreManager

Centralized and reactive state container for your app.

#### ✅ Usage

```js
AppStore.subscribe(state => {
  console.log('New State:', state);
});

AppStore.updateData({ user: 'Alice' });
```

#### 🔧 Methods

* **`updateData(newData)`**
  Merges new state into the existing state and notifies all subscribers.

* **`getData()`**
  Returns the current global state.

* **`subscribe(callback)`**
  Adds a function to be called whenever the state updates.

---

### 3. `AppNavigator` – AppRouter

Handles client-side navigation using hash-based routing (`#route`).

#### ✅ Usage

```js
AppNavigator.registerPath('home', () => UI.display(homeComponent, app));
AppNavigator.registerPath('404', () => UI.display(notFoundComponent, app));

AppNavigator.goTo('home');
```

#### 🔧 Methods

* **`registerPath(path, callback)`**
  Registers a route and associates it with a render function.

* **`processPathChange()`**
  Listens for `hashchange` and calls the appropriate handler or `404`.

* **`goTo(path)`**
  Programmatically navigate by updating the URL hash.

---

### 4. `EventManager` – EventsHandler

Simplifies DOM event binding using delegation.

#### ✅ Usage

```js
EventManager.attachHandler(button, 'click', () => {
  console.log('Button clicked!');
});
```

#### 🔧 Methods

* **`attachHandler(element, event, handler)`**
  Adds a delegated event listener to the document and tracks matching elements.

* **`processEvent(e)`**
  Internally invoked to dispatch the event to relevant handlers.

---

## 🧱 Complete Example

```js
const app = document.getElementById('app');

const homeComponent = UI.createNode({
  tag: 'div',
  children: [
    UI.createNode({ tag: 'h1', children: 'Welcome to نورة.js!' }),
    UI.createNode({
      tag: 'button',
      attrs: {
        onClick: () => AppNavigator.goTo('about')
      },
      children: 'Go to About'
    })
  ]
});

const aboutComponent = UI.createNode({
  tag: 'div',
  children: 'This is a minimal SPA framework.'
});

const notFoundComponent = UI.createNode({
  tag: 'div',
  children: '404 - Page not found'
});

AppNavigator.registerPath('home', () => UI.display(homeComponent, app));
AppNavigator.registerPath('about', () => UI.display(aboutComponent, app));
AppNavigator.registerPath('404', () => UI.display(notFoundComponent, app));

// Start router on initial load
AppNavigator.processPathChange();
```

---

## ⚙️ Philosophy

* **Declarative UI** — Create DOM structure from config.
* **Event Delegation** — Reduce performance cost of many listeners.
* **Reactive State** — Automatically respond to data changes.
* **Zero Dependencies** — Lightweight and portable.

---

## 📚 Planned Features

* ✅ Component system with lifecycle support
* ✅ Dynamic routes with parameters (`#user/:id`)
* ✅ Middleware for route/state guards
* ✅ Developer tools integration
* ✅ Hot-reload and file-based routing (future versions)

---

## 📜 API Summary

| Component      | Description                   |
| -------------- | ----------------------------- |
| `UI`           | Declarative DOM builder       |
| `AppStore`     | Global reactive state manager |
| `AppNavigator` | Hash-based router             |
| `EventManager` | Event delegation utility      |

---

## 🧾 License

**MIT** © 2025 **نورة.js** Team
Use freely in personal or commercial projects.

---

## 💬 Feedback & Contribution

We welcome your suggestions, ideas, and bug reports!

Want to contribute?
Open an issue or pull request on GitHub: [github.com/mahdiatubly/noura.js](https://github.com/mahdiatubly/noura.js)

---
