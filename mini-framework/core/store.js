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