/**
 * Component System with React-like state management
 * 
 * Features:
 * - Local component state
 * - Lifecycle methods
 * - Automatic re-rendering on state changes
 * - Props support
 */
import { UI } from './ui.js';

class Component {
    constructor(props = {}) {
        this.props = props;
        this.state = {};
        this._container = null;
        this._vnode = null;
        this._isMounted = false;
    }

    /**
     * Sets component state and triggers re-render
     */
    setState(newState) {
        if (typeof newState === 'function') {
            newState = newState(this.state);
        }

        const prevState = { ...this.state };
        this.state = { ...this.state, ...newState };

        if (this._isMounted) {
            this.componentWillUpdate(this.props, this.state, prevState);
            this._render();
            this.componentDidUpdate(this.props, this.state, prevState);
        }
    }

    /**
     * Updates component props and triggers re-render
     */
    setProps(newProps) {
        const prevProps = { ...this.props };
        this.props = { ...this.props, ...newProps };

        if (this._isMounted) {
            this.componentWillUpdate(this.props, this.state);
            this._render();
            this.componentDidUpdate(prevProps, this.state);
        }
    }

    /**
     * Forces component to re-render
     */
    forceUpdate() {
        if (this._isMounted) {
            this._render();
        }
    }

    /**
     * Internal render method
     */
    _render() {
        if (this._container) {
            const newVNode = this.render();
            UI.display(newVNode, this._container);
        }
    }

    /**
     * Mounts component to DOM container
     */
    mount(container) {
        this._container = container;
        this.componentWillMount();
        this._isMounted = true;
        this._render();
        this.componentDidMount();
    }

    /**
     * Unmounts component from DOM
     */
    unmount() {
        if (this._isMounted) {
            this.componentWillUnmount();
            this._isMounted = false;
            if (this._container) {
                this._container.innerHTML = '';
            }
        }
    }

    // Lifecycle methods (to be overridden)
    componentWillMount() {}
    componentDidMount() {}
    componentWillUpdate(props, state) {}
    componentDidUpdate(prevProps, prevState) {}
    componentWillUnmount() {}

    /**
     * Render method (must be overridden)
     */
    render() {
        throw new Error('Component render() method must be implemented');
    }
}

export { Component };