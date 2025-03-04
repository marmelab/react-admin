import { NormalizedRequestOptions } from './RequestUtils.js';
import { RouteMatcher } from './Matchers.js';
import Route, { RouteConfig, RouteName } from './Route.js';
import Router from './Router.js';
import type { FetchMockConfig } from './FetchMock.js';
export type Matched = 'matched';
export type Unmatched = 'unmatched';
export type CallHistoryFilter = RouteName | Matched | Unmatched | boolean | RouteMatcher;
export type CallLog = {
    args: unknown[];
    url: string;
    options: NormalizedRequestOptions;
    request?: Request;
    signal?: AbortSignal;
    route?: Route;
    response?: Response;
    expressParams?: {
        [x: string]: string;
    };
    queryParams?: URLSearchParams;
    pendingPromises: Promise<unknown>[];
};
declare class CallHistory {
    callLogs: CallLog[];
    config: FetchMockConfig;
    router: Router;
    constructor(config: FetchMockConfig, router: Router);
    recordCall(callLog: CallLog): void;
    clear(): void;
    flush(waitForResponseMethods?: boolean): Promise<void>;
    calls(filter?: CallHistoryFilter, options?: RouteConfig): CallLog[];
    called(filter?: CallHistoryFilter, options?: RouteConfig): boolean;
    lastCall(filter?: CallHistoryFilter, options?: RouteConfig): CallLog | undefined;
    done(routeNames?: RouteName | RouteName[]): boolean;
}
export default CallHistory;
