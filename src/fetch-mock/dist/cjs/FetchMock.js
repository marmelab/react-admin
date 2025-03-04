"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FetchMock = exports.defaultFetchMockConfig = void 0;
const Router_js_1 = __importDefault(require("./Router.js"));
const Route_js_1 = __importDefault(require("./Route.js"));
const CallHistory_js_1 = __importDefault(require("./CallHistory.js"));
const requestUtils = __importStar(require("./RequestUtils.js"));
exports.defaultFetchMockConfig = {
    includeContentLength: true,
    matchPartialBody: false,
    Request: globalThis.Request,
    Response: globalThis.Response,
    Headers: globalThis.Headers,
    fetch: globalThis.fetch,
};
const defineShorthand = (shorthandOptions) => {
    function shorthand(matcher, response, options) {
        return this.route(matcher, response, Object.assign(options || {}, shorthandOptions));
    }
    return shorthand;
};
const defineGreedyShorthand = (shorthandOptions) => {
    return function (response, options) {
        return this.route('*', response, Object.assign(options || {}, shorthandOptions));
    };
};
class FetchMock {
    constructor(config, router) {
        this.sticky = defineShorthand({ sticky: true });
        this.once = defineShorthand({ repeat: 1 });
        this.any = defineGreedyShorthand({});
        this.anyOnce = defineGreedyShorthand({ repeat: 1 });
        this.get = defineShorthand({ method: 'get' });
        this.getOnce = defineShorthand({ method: 'get', repeat: 1 });
        this.post = defineShorthand({ method: 'post' });
        this.postOnce = defineShorthand({ method: 'post', repeat: 1 });
        this.put = defineShorthand({ method: 'put' });
        this.putOnce = defineShorthand({ method: 'put', repeat: 1 });
        this.delete = defineShorthand({ method: 'delete' });
        this.deleteOnce = defineShorthand({ method: 'delete', repeat: 1 });
        this.head = defineShorthand({ method: 'head' });
        this.headOnce = defineShorthand({ method: 'head', repeat: 1 });
        this.patch = defineShorthand({ method: 'patch' });
        this.patchOnce = defineShorthand({ method: 'patch', repeat: 1 });
        this.config = config;
        this.router = new Router_js_1.default(this.config, {
            routes: router ? [...router.routes] : [],
            fallbackRoute: router ? router.fallbackRoute : null,
        });
        this.callHistory = new CallHistory_js_1.default(this.config, this.router);
        this.fetchHandler = this.fetchHandler.bind(this);
        Object.assign(this.fetchHandler, { fetchMock: this });
    }
    createInstance() {
        return new FetchMock({ ...this.config }, this.router);
    }
    async fetchHandler(requestInput, requestInit) {
        let callLog;
        if (requestInput instanceof this.config.Request) {
            callLog = await requestUtils.createCallLogFromRequest(requestInput, requestInit);
        }
        else {
            callLog = requestUtils.createCallLogFromUrlAndOptions(requestInput, requestInit);
        }
        this.callHistory.recordCall(callLog);
        const responsePromise = this.router.execute(callLog);
        callLog.pendingPromises.push(responsePromise);
        return responsePromise;
    }
    route(matcher, response, options) {
        this.router.addRoute(matcher, response, options);
        return this;
    }
    catch(response) {
        this.router.setFallback(response);
        return this;
    }
    defineMatcher(matcher) {
        Route_js_1.default.defineMatcher(matcher);
    }
    removeRoutes(options) {
        this.router.removeRoutes(options);
        return this;
    }
    removeRoute(routeName) {
        this.router.removeRoutes({ names: [routeName] });
        return this;
    }
    modifyRoute(routeName, options) {
        this.router.modifyRoute(routeName, options);
        return this;
    }
    clearHistory() {
        this.callHistory.clear();
        return this;
    }
    mockGlobal() {
        globalThis.fetch = this.fetchHandler;
        return this;
    }
    unmockGlobal() {
        globalThis.fetch = this.config.fetch;
        return this;
    }
    hardReset(options) {
        this.clearHistory();
        this.removeRoutes(options);
        this.unmockGlobal();
        return this;
    }
    spy(matcher, name) {
        const boundFetch = this.config.fetch.bind(globalThis);
        if (matcher) {
            this.route(matcher, ({ args }) => boundFetch(...args), name);
        }
        else {
            this.catch(({ args }) => boundFetch(...args));
        }
        return this;
    }
    spyGlobal() {
        this.mockGlobal();
        return this.spy();
    }
}
exports.FetchMock = FetchMock;
const fetchMock = new FetchMock({
    ...exports.defaultFetchMockConfig,
});
exports.default = fetchMock;
