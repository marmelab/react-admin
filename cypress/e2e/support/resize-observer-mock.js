// Mock ResizeObserver to prevent "ResizeObserver loop completed with undelivered notifications" errors
class ResizeObserverMock {
    constructor(callback) {
        this.callback = callback;
        this.observations = new Map();
    }

    observe(element) {
        this.observations.set(element, {});
        // Trigger initial callback
        this.callback([{ target: element }], this);
    }

    unobserve(element) {
        this.observations.delete(element);
    }

    disconnect() {
        this.observations.clear();
    }
}

// Replace the global ResizeObserver with our mock
if (window.ResizeObserver) {
    window.ResizeObserver = ResizeObserverMock;
}
