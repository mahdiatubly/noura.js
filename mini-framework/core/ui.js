class ElementBuilder {
    createNode({ tag, attrs = {}, children = [] }) {
        const node = document.createElement(tag);

        for (let key in attrs) {
            if (key.startsWith('on')) {
                node.addEventListener(key.substring(2).toLowerCase(), attrs[key]);
            } else if (key in node) {
                node[key] = attrs[key];
            } else {
                node.setAttribute(key, attrs[key]);
            }
        }

        if (!Array.isArray(children)) {
            children = [children];
        }

        children.forEach(child => {
            if (typeof child === 'string' || typeof child === 'number') {
                node.appendChild(document.createTextNode(child));
            } else if (child instanceof HTMLElement) {
                node.appendChild(child);
            } else {
                node.appendChild(this.createNode(child));
            }
        });

        return node;
    }

    display(node, container) {
        container.innerHTML = '';
        container.appendChild(node);
    }
}

export const UI = new ElementBuilder();