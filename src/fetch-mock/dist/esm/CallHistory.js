import { createCallLogFromUrlAndOptions, } from './RequestUtils.js';
import { isUrlMatcher } from './Matchers.js';
import Route from './Route.js';
const isName = (filter) => typeof filter === 'string' &&
    /^[\da-zA-Z-]+$/.test(filter) &&
    !['matched', 'unmatched'].includes(filter);
const isMatchedOrUnmatched = (filter) => typeof filter === 'boolean' ||
    ['matched', 'unmatched'].includes(filter);
class CallHistory {
    constructor(config, router) {
        this.callLogs = [];
        this.config = config;
        this.router = router;
    }
    recordCall(callLog) {
        this.callLogs.push(callLog);
    }
    clear() {
        this.callLogs.forEach(({ route }) => {
            if (route) {
                route.reset();
            }
        });
        this.callLogs = [];
    }
    async flush(waitForResponseMethods) {
        const queuedPromises = this.callLogs.flatMap((call) => call.pendingPromises);
        await Promise.allSettled(queuedPromises);
        if (waitForResponseMethods) {
            await Promise.resolve();
            await this.flush();
        }
    }
    calls(filter, options) {
        let calls = [...this.callLogs];
        if (typeof filter === 'undefined' && !options) {
            return calls;
        }
        if (isMatchedOrUnmatched(filter)) {
            if ([true, 'matched'].includes(filter)) {
                calls = calls.filter(({ route }) => !route.config.isFallback);
            }
            else if ([false, 'unmatched'].includes(filter)) {
                calls = calls.filter(({ route }) => Boolean(route.config.isFallback));
            }
            if (!options) {
                return calls;
            }
        }
        else if (isName(filter)) {
            calls = calls.filter(({ route: { config: { name }, }, }) => name === filter);
            if (!options) {
                return calls;
            }
        }
        else {
            if (isUrlMatcher(filter)) {
                options = { url: filter, ...(options || {}) };
            }
            else {
                options = { ...filter, ...(options || {}) };
            }
        }
        const { matcher } = new Route({
            response: 'ok',
            ...options,
        });
        calls = calls.filter(({ url, options }) => {
            return matcher(createCallLogFromUrlAndOptions(url, options));
        });
        return calls;
    }
    called(filter, options) {
        return Boolean(this.calls(filter, options).length);
    }
    lastCall(filter, options) {
        return this.calls(filter, options).pop();
    }
    done(routeNames) {
        let routesToCheck = this.router.routes;
        if (routeNames) {
            routeNames = Array.isArray(routeNames) ? routeNames : [routeNames];
            routesToCheck = this.router.routes.filter(({ config: { name } }) => routeNames.includes(name));
        }
        return routesToCheck
            .map((route) => {
            const calls = this.callLogs.filter(({ route: routeApplied }) => routeApplied === route);
            if (!calls.length) {
                console.warn(`Warning: ${route.config.name} not called`);
                return false;
            }
            const expectedTimes = route.config.repeat;
            if (!expectedTimes) {
                return true;
            }
            const actualTimes = calls.length;
            if (expectedTimes > actualTimes) {
                console.warn(`Warning: ${route.config.name} only called ${actualTimes} times, but ${expectedTimes} expected`);
                return false;
            }
            return true;
        })
            .every((isDone) => isDone);
    }
}
export default CallHistory;
