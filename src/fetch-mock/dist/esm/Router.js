import Route from './Route.js';
import { isUrlMatcher, isFunctionMatcher } from './Matchers.js';
import { hasCredentialsInUrl } from './RequestUtils.js';
const responseConfigProps = [
    'body',
    'headers',
    'throws',
    'status',
    'redirectUrl',
];
function nameToOptions(options) {
    return typeof options === 'string' ? { name: options } : options;
}
function isPromise(response) {
    return typeof response.then === 'function';
}
function normalizeResponseInput(responseInput) {
    if (typeof responseInput === 'number') {
        return {
            status: responseInput,
        };
    }
    else if (typeof responseInput === 'string' ||
        shouldSendAsObject(responseInput)) {
        return {
            body: responseInput,
        };
    }
    return responseInput;
}
function shouldSendAsObject(responseInput) {
    if (responseConfigProps.some((prop) => prop in responseInput)) {
        if (Object.keys(responseInput).every((key) => responseConfigProps.includes(key))) {
            return false;
        }
        return true;
    }
    return true;
}
function throwSpecExceptions({ url, options: { headers, method, body }, }) {
    if (headers) {
        Object.entries(headers).forEach(([key]) => {
            if (/\s/.test(key)) {
                throw new TypeError('Invalid name');
            }
        });
    }
    if (hasCredentialsInUrl(url)) {
        throw new TypeError(`Request cannot be constructed from a URL that includes credentials: ${url}`);
    }
    if (['get', 'head'].includes(method) && body) {
        throw new TypeError('Request with GET/HEAD method cannot have body.');
    }
}
const resolveUntilResponseConfig = async (callLog) => {
    let response = callLog.route.config.response;
    while (true) {
        if (typeof response === 'function') {
            response = response(callLog);
        }
        else if (isPromise(response)) {
            response = await response;
        }
        else {
            return response;
        }
    }
};
export default class Router {
    constructor(fetchMockConfig, { routes, fallbackRoute } = {}) {
        this.config = fetchMockConfig;
        this.routes = routes || [];
        this.fallbackRoute = fallbackRoute;
    }
    needsToReadBody(request) {
        return Boolean(request && this.routes.some((route) => route.config.usesBody));
    }
    execute(callLog) {
        throwSpecExceptions(callLog);
        return new Promise(async (resolve, reject) => {
            const { url, options, request, pendingPromises } = callLog;
            if (callLog.signal) {
                const abort = () => {
                    const error = new DOMException('The operation was aborted.', 'AbortError');
                    const requestBody = request?.body || options?.body;
                    if (requestBody instanceof ReadableStream) {
                        if (requestBody.locked) {
                            requestBody.getReader().cancel(error);
                        }
                        else {
                            requestBody.cancel(error);
                        }
                    }
                    if (callLog?.response?.body) {
                        if (callLog.response.body.locked) {
                            callLog.response.body.getReader().cancel(error);
                        }
                        else {
                            callLog.response.body.cancel(error);
                        }
                    }
                    reject(error);
                };
                if (callLog.signal.aborted) {
                    abort();
                }
                callLog.signal.addEventListener('abort', abort);
            }
            if (this.needsToReadBody(request)) {
                options.body = await options.body;
            }
            const routesToTry = this.fallbackRoute
                ? [...this.routes, this.fallbackRoute]
                : this.routes;
            const route = routesToTry.find((route) => route.matcher(callLog));
            if (route) {
                try {
                    callLog.route = route;
                    const { response, responseOptions, responseInput } = await this.generateResponse(callLog);
                    const observableResponse = this.createObservableResponse(response, responseOptions, responseInput, url, pendingPromises);
                    callLog.response = response;
                    resolve(observableResponse);
                }
                catch (err) {
                    reject(err);
                }
            }
            else {
                reject(new Error(`fetch-mock: No response or fallback rule to cover ${(options && options.method) || 'GET'} to ${url}`));
            }
        });
    }
    async generateResponse(callLog) {
        const responseInput = await resolveUntilResponseConfig(callLog);
        if (responseInput instanceof Response) {
            return {
                response: responseInput.clone(),
                responseOptions: {},
                responseInput: {},
            };
        }
        const responseConfig = normalizeResponseInput(responseInput);
        if (responseConfig.throws) {
            throw responseConfig.throws;
        }
        return callLog.route.constructResponse(responseConfig);
    }
    createObservableResponse(response, responseConfig, responseInput, responseUrl, pendingPromises) {
        return new Proxy(response, {
            get: (originalResponse, name) => {
                if (responseInput.redirectUrl) {
                    if (name === 'url') {
                        return responseInput.redirectUrl;
                    }
                    if (name === 'redirected') {
                        return true;
                    }
                }
                else {
                    if (name === 'url') {
                        return responseUrl;
                    }
                    if (name === 'redirected') {
                        return false;
                    }
                }
                if (responseInput.status === 0) {
                    if (name === 'status')
                        return 0;
                    if (name === 'statusText')
                        return '';
                }
                if (typeof response[name] === 'function') {
                    return new Proxy(response[name], {
                        apply: (func, thisArg, args) => {
                            const result = func.apply(response, args);
                            if (result.then) {
                                pendingPromises.push(result.catch(() => undefined));
                            }
                            return result;
                        },
                    });
                }
                return originalResponse[name];
            },
        });
    }
    addRoute(matcher, response, nameOrOptions) {
        const config = {};
        if (isUrlMatcher(matcher)) {
            config.url = matcher;
        }
        else if (isFunctionMatcher(matcher)) {
            config.matcherFunction = matcher;
        }
        else {
            Object.assign(config, matcher);
        }
        if (typeof response !== 'undefined') {
            config.response = response;
        }
        if (nameOrOptions) {
            Object.assign(config, typeof nameOrOptions === 'string'
                ? nameToOptions(nameOrOptions)
                : nameOrOptions);
        }
        const route = new Route({
            ...this.config,
            ...config,
        });
        if (route.config.name &&
            this.routes.some(({ config: { name: existingName } }) => route.config.name === existingName)) {
            throw new Error('fetch-mock: Adding route with same name as existing route.');
        }
        if (route.config.waitFor) {
            const routeNamesToWaitFor = Array.isArray(route.config.waitFor)
                ? route.config.waitFor
                : [route.config.waitFor];
            const routesToAwait = [];
            routeNamesToWaitFor.forEach((routeName) => {
                const routeToAwait = this.routes.find(({ config: { name: existingName } }) => routeName === existingName);
                if (routeToAwait) {
                    routesToAwait.push(routeToAwait);
                }
                else {
                    throw new Error(`Cannot wait for route \`${routeName}\`: route of that name does not exist`);
                }
            });
            route.waitFor(routesToAwait);
        }
        this.routes.push(route);
    }
    setFallback(response) {
        if (this.fallbackRoute) {
            console.warn('calling fetchMock.catch() twice - are you sure you want to overwrite the previous fallback response');
        }
        this.fallbackRoute = new Route({
            matcherFunction: () => true,
            response: response || 'ok',
            ...this.config,
        });
        this.fallbackRoute.config.isFallback = true;
    }
    removeRoutes({ names, includeSticky, includeFallback, } = {}) {
        includeFallback = includeFallback ?? true;
        this.routes = this.routes.filter(({ config: { sticky, name } }) => {
            if (sticky && !includeSticky) {
                return true;
            }
            if (!names) {
                return false;
            }
            return !names.includes(name);
        });
        if (includeFallback) {
            delete this.fallbackRoute;
        }
    }
    modifyRoute(routeName, options) {
        const route = this.routes.find(({ config: { name } }) => name === routeName);
        if (!route) {
            throw new Error(`Cannot call modifyRoute() on route \`${routeName}\`: route of that name not found`);
        }
        if (route.config.sticky) {
            throw new Error(`Cannot call modifyRoute() on route \`${routeName}\`: route is sticky and cannot be modified`);
        }
        if ('name' in options) {
            throw new Error(`Cannot rename the route \`${routeName}\` as \`${options.name}\`: renaming routes is not supported`);
        }
        if ('sticky' in options) {
            throw new Error(`Altering the stickiness of route \`${routeName}\` is not supported`);
        }
        const newConfig = { ...route.config, ...options };
        Object.entries(options).forEach(([key, value]) => {
            if (value === null) {
                delete newConfig[key];
            }
        });
        route.init(newConfig);
    }
}
