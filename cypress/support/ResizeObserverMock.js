class ResizeObserverMock {
    constructor(callback) {
        this.callback = callback;
        this.elements = new Set();
        this.handleResize = this.handleResize.bind(this);
    }

    observe(element) {
        this.elements.add(element);
        this.trigger();
        window.addEventListener('resize', this.handleResize);
    }

    unobserve(element) {
        this.elements.delete(element);
    }

    disconnect() {
        this.elements.clear();
        window.removeEventListener('resize', this.handleResize);
    }

    handleResize() {
        this.trigger();
    }

    trigger() {
        if (this.elements.size == 0) return;

        const entries = Array.from(this.elements).map(e => ({
            target: e,
            contentRect: e.getBoundingClientRect(),
        }));

        requestAnimationFrame(() => {
            this.callback(entries, this);
        });
    }
}

export default ResizeObserverMock;
