class ResizeObserverMock {
    constructor(callback) {
        this.callback = callback;
        this.elements = new Set();
        this.handleResize = this.handleResize.bind(this);
        this._window = null;
        this._listening = false;
    }

    observe(element) {
        if (!this._window && element && element.ownerDocument) {
            this._window = element.ownerDocument.defaultView || null;
        }

        const win =
            this._window || (typeof window !== 'undefined' ? window : null);

        if (!this.elements) return;
        this.elements.add(element);

        if (!this._listening && win) {
            win.addEventListener('resize', this.handleResize);
            this._listening = true;
        }

        this.trigger();
    }

    unobserve(element) {
        this.elements.delete(element);
        const win =
            this._window || (typeof window !== 'undefined' ? window : null);
        if (this.elements.size === 0 && this._listening && win) {
            win.removeEventListener('resize', this.handleResize);
            this._listening = false;
        }
    }

    disconnect() {
        this.elements.clear();
        const win =
            this._window || (typeof window !== 'undefined' ? window : null);
        if (this._listening && win) {
            win.removeEventListener('resize', this.handleResize);
            this._listening = false;
        }
    }

    handleResize() {
        this.trigger();
    }

    trigger() {
        if (this.elements.size === 0) return;

        const entries = Array.from(this.elements).map(e => ({
            target: e,
            contentRect: e.getBoundingClientRect(),
        }));

        const win =
            this._window || (typeof window !== 'undefined' ? window : null);
        const raf =
            win && typeof win.requestAnimationFrame === 'function'
                ? win.requestAnimationFrame.bind(win)
                : typeof requestAnimationFrame === 'function'
                  ? requestAnimationFrame
                  : cb => setTimeout(cb, 0);

        raf(() => {
            this.callback(entries, this);
        });
    }
}

export default ResizeObserverMock;
