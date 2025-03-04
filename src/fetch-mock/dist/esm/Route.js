var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _Route_instances, _a, _Route_responseSubscriptions, _Route_validate, _Route_sanitize, _Route_generateMatcher, _Route_limit, _Route_delayResponse;
import { builtInMatchers } from './Matchers.js';
import statusTextMap from './StatusTextMap.js';
function isBodyInit(body) {
    return (body instanceof Blob ||
        body instanceof ArrayBuffer ||
        ArrayBuffer.isView(body) ||
        body instanceof DataView ||
        body instanceof FormData ||
        body instanceof ReadableStream ||
        body instanceof URLSearchParams ||
        body instanceof String ||
        typeof body === 'string' ||
        body === null);
}
function sanitizeStatus(status) {
    if (status === 0) {
        return 200;
    }
    if (!status) {
        return 200;
    }
    if ((typeof status === 'number' &&
        parseInt(String(status), 10) !== status &&
        status >= 200) ||
        status < 600) {
        return status;
    }
    throw new TypeError(`fetch-mock: Invalid status ${status} passed on response object.
To respond with a JSON object that has status as a property assign the object to body
e.g. {"body": {"status: "registered"}}`);
}
class Route {
    constructor(config) {
        _Route_instances.add(this);
        _Route_responseSubscriptions.set(this, void 0);
        this.init(config);
    }
    init(config) {
        this.config = config;
        __classPrivateFieldSet(this, _Route_responseSubscriptions, [], "f");
        __classPrivateFieldGet(this, _Route_instances, "m", _Route_sanitize).call(this);
        __classPrivateFieldGet(this, _Route_instances, "m", _Route_validate).call(this);
        __classPrivateFieldGet(this, _Route_instances, "m", _Route_generateMatcher).call(this);
        __classPrivateFieldGet(this, _Route_instances, "m", _Route_limit).call(this);
        __classPrivateFieldGet(this, _Route_instances, "m", _Route_delayResponse).call(this);
    }
    reset() { }
    waitFor(awaitedRoutes) {
        const { response } = this.config;
        this.config.response = Promise.all(awaitedRoutes.map((awaitedRoute) => new Promise((res) => awaitedRoute.onRespond(() => {
            res(undefined);
        })))).then(() => response);
    }
    onRespond(func) {
        __classPrivateFieldGet(this, _Route_responseSubscriptions, "f").push(func);
    }
    constructResponse(responseInput) {
        const responseOptions = this.constructResponseOptions(responseInput);
        const body = this.constructResponseBody(responseInput, responseOptions);
        const responsePackage = {
            response: new this.config.Response(body, responseOptions),
            responseOptions,
            responseInput,
        };
        __classPrivateFieldGet(this, _Route_responseSubscriptions, "f").forEach((func) => func());
        return responsePackage;
    }
    constructResponseOptions(responseInput) {
        const options = responseInput.options || {};
        options.status = sanitizeStatus(responseInput.status);
        options.statusText = statusTextMap[options.status];
        options.headers = new this.config.Headers(responseInput.headers);
        return options;
    }
    constructResponseBody(responseInput, responseOptions) {
        let body = responseInput.body;
        const bodyIsBodyInit = isBodyInit(body);
        if (!bodyIsBodyInit) {
            if (typeof body === 'undefined') {
                body = null;
            }
            else if (typeof body === 'object') {
                body = JSON.stringify(body);
                if (!responseOptions.headers.has('Content-Type')) {
                    responseOptions.headers.set('Content-Type', 'application/json');
                }
            }
            else {
                throw new TypeError('Invalid body provided to construct response');
            }
        }
        if (this.config.includeContentLength &&
            !responseOptions.headers.has('Content-Length') &&
            !(body instanceof ReadableStream) &&
            !(body instanceof FormData)) {
            let length = 0;
            if (body instanceof Blob) {
                length = body.size;
            }
            else if (body instanceof ArrayBuffer ||
                ArrayBuffer.isView(body) ||
                body instanceof DataView) {
                length = body.byteLength;
            }
            else if (body instanceof URLSearchParams) {
                length = body.toString().length;
            }
            else if (typeof body === 'string' || body instanceof String) {
                length = body.length;
            }
            responseOptions.headers.set('Content-Length', length.toString());
        }
        return body;
    }
    static defineMatcher(matcher) {
        _a.registeredMatchers.push(matcher);
    }
}
_a = Route, _Route_responseSubscriptions = new WeakMap(), _Route_instances = new WeakSet(), _Route_validate = function _Route_validate() {
    if (['matched', 'unmatched'].includes(this.config.name)) {
        throw new Error(`fetch-mock: Routes cannot use the reserved name \`${this.config.name}\``);
    }
    if (!('response' in this.config)) {
        throw new Error('fetch-mock: Each route must define a response');
    }
    if (!_a.registeredMatchers.some(({ name }) => name in this.config)) {
        throw new Error("fetch-mock: Each route must specify some criteria for matching calls to fetch. To match all calls use '*'");
    }
}, _Route_sanitize = function _Route_sanitize() {
    if (this.config.method) {
        this.config.method = this.config.method.toLowerCase();
    }
}, _Route_generateMatcher = function _Route_generateMatcher() {
    const activeMatchers = _a.registeredMatchers
        .filter(({ name }) => name in this.config)
        .map(({ matcher, usesBody }) => ({
        matcher: matcher(this.config),
        usesBody,
    }));
    this.config.usesBody = activeMatchers.some(({ usesBody }) => usesBody);
    this.matcher = (normalizedRequest) => activeMatchers.every(({ matcher }) => matcher(normalizedRequest));
}, _Route_limit = function _Route_limit() {
    if (!this.config.repeat) {
        return;
    }
    const originalMatcher = this.matcher;
    let timesLeft = this.config.repeat;
    this.matcher = (callLog) => {
        const match = timesLeft && originalMatcher(callLog);
        if (match) {
            timesLeft--;
            return true;
        }
    };
    this.reset = () => {
        timesLeft = this.config.repeat;
    };
}, _Route_delayResponse = function _Route_delayResponse() {
    if (this.config.delay) {
        const { response } = this.config;
        this.config.response = () => {
            return new Promise((res) => setTimeout(() => res(response), this.config.delay));
        };
    }
};
Route.registeredMatchers = [];
builtInMatchers.forEach(Route.defineMatcher);
export default Route;
