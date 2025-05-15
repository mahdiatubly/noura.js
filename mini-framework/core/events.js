/**
 * EventsHandler provides a centralized event delegation system.
 *
 * It listens for events at the document level and delegates them
 * to registered handlers if the event target is within the specified element.
 *
 * This reduces the number of event listeners and improves performance
 * in applications with many interactive elements.
 *
 * Example:
 * EventManager.attachHandler(button, 'click', handleClick);
 */
class EventsHandler {
    constructor() {
        this.handlers = {};
    }

    attachHandler(element, event, handler) {
        if (!this.handlers[event]) {
            this.handlers[event] = [];
            document.addEventListener(event, this.processEvent.bind(this));
        }
        this.handlers[event].push({ element, handler });
    }

    processEvent(e) {
        const { type, target } = e;
        if (this.handlers[type]) {
            this.handlers[type].forEach(({ element, handler }) => {
                if (element.contains(target)) {
                    handler(e);
                }
            });
        }
    }
}

export const EventManager = new EventsHandler();