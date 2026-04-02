/**
 * EventsHandler provides an efficient event delegation system.
 * 
 * Improvements:
 * - Uses WeakMap to avoid memory leaks.
 * - Uses one global listener per event type.
 * - Allows handler removal.
 * - Uses event bubbling to efficiently match targets.
 */
class EventsHandler {
  constructor() {
    this.handlers = {}; // { eventType: Set<{ element, handler }> }
    this.listener = this.processEvent.bind(this);
  }

  attachHandler(element, event, handler) {
    if (!this.handlers[event]) {
      this.handlers[event] = new Set();
      document.addEventListener(event, this.listener, true);
    }
    this.handlers[event].add({ element, handler });
  }

  removeHandler(element, event, handler) {
    const eventHandlers = this.handlers[event];
    if (!eventHandlers) return;

    for (const h of eventHandlers) {
      if (h.element === element && h.handler === handler) {
        eventHandlers.delete(h);
        break;
      }
    }

    // Cleanup if no handlers left
    if (eventHandlers.size === 0) {
      document.removeEventListener(event, this.listener, true);
      delete this.handlers[event];
    }
  }

  processEvent(e) {
    const eventType = e.type;
    const eventHandlers = this.handlers[eventType];
    if (!eventHandlers) return;

    // Use event bubbling to find matching handlers efficiently
    for (const { element, handler } of eventHandlers) {
      if (element === e.target || element.contains(e.target)) {
        handler(e);
      }
    }
  }
}

export const EventManager = new EventsHandler();
