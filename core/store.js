/**
 * StoreManager provides a lightweight reactive state management system.
 *
 * It allows storing shared application data, updating it, and notifying subscribers
 * (e.g., UI components or other logic) when the data changes.
 *
 * Example usage:
 * 
 * AppStore.subscribe(data => {
 *   console.log('Updated data:', data);
 * });
 * 
 * AppStore.updateData({ user: 'Alice' });
 * 
 * const state = AppStore.getData();
 * console.log(state.user); // "Alice"
 */
class StoreManager {
    constructor() {
        this.data = {};
        this.subscribers = [];
    }

    updateData(newData) {
        this.data = { ...this.data, ...newData };
        this.notifySubscribers();
    }

    getData() {
        return this.data;
    }

    subscribe(callback) {
        this.subscribers.push(callback);
    }

    notifySubscribers() {
        this.subscribers.forEach(callback => callback(this.data));
    }
}

export const AppStore = new StoreManager();