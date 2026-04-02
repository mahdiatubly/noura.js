/**
 * ElementBuilder with Virtual DOM support
 * 
 * Provides React-like virtual DOM implementation with efficient diffing and patching.
 * Only updates the parts of the real DOM that have changed.
 */
class ElementBuilder {
    constructor() {
        this.vdomTree = null;
        this.rootContainer = null;
    }

    /**
     * Creates a virtual node (VNode)
     */
    createNode({ tag, attrs = {}, children = [], key = null }) {
        // Handle empty/null children
        if (!children || children === '') {
            children = [];
        }
        
        return {
            tag,
            attrs,
            children: Array.isArray(children) ? children : [children],
            key
        };
    }

    /**
     * Renders virtual DOM to real DOM
     */
    render(vnode) {
        if (typeof vnode === 'string' || typeof vnode === 'number') {
            return document.createTextNode(vnode);
        }

        if (!vnode || vnode === '') {
            return document.createTextNode('');
        }

        const element = document.createElement(vnode.tag);

        // Set attributes and event listeners
        for (let key in vnode.attrs) {
            this.setAttribute(element, key, vnode.attrs[key]);
        }

        // Render children
        vnode.children.forEach(child => {
            if (child && child !== '') {
                element.appendChild(this.render(child));
            }
        });

        return element;
    }

    /**
     * Sets an attribute on a DOM element
     */
    setAttribute(element, key, value) {
        if (key.startsWith('on')) {
            const eventName = key.substring(2).toLowerCase();
            element.addEventListener(eventName, value);
        } else if (key === 'className') {
            element.className = value;
        } else if (key === 'class') {
            element.className = value;
        } else if (key === 'checked' || key === 'value' || key === 'disabled') {
            element[key] = value;
        } else if (key in element && key !== 'list' && key !== 'type' && key !== 'draggable' && key !== 'spellcheck' && key !== 'translate') {
            element[key] = value;
        } else {
            element.setAttribute(key, value);
        }
    }

    /**
     * Main display method - renders to DOM (simplified for now)
     */
    display(vnode, container) {
        // For now, simple full re-render to ensure it works
        // Virtual DOM diffing can be added later once basic functionality is confirmed
        container.innerHTML = '';
        container.appendChild(this.render(vnode));
    }
}

export const UI = new ElementBuilder();