import Router from './Router.js';
import Route from './Route.js';
import CallHistory from './CallHistory.js';
import * as requestUtils from './RequestUtils.js';
export const defaultFetchMockConfig = {
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
export class FetchMock {
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
        this.router = new Router(this.config, {
            routes: router ? [...router.routes] : [],
            fallbackRoute: router ? router.fallbackRoute : null,
        });
        this.callHistory = new CallHistory(this.config, this.router);
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
        Route.defineMatcher(matcher);
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
const fetchMock = new FetchMock({
    ...defaultFetchMockConfig,
});
export default fetchMock;
