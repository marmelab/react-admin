class HttpError extends Error {
    status;
    body;
    constructor(message, status, body: any = null) {
        super(message);
        this.status = status;
        this.body = body;
        Object.setPrototypeOf(this, HttpError.prototype);
        this.name = this.constructor.name;
        if (typeof Error.captureStackTrace === 'function') {
            Error.captureStackTrace(this, this.constructor);
        } else {
            this.stack = new Error(message).stack;
        }
        this.stack = new Error().stack;
    }
}

export default HttpError;
