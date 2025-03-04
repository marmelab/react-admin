import Router, { RemoveRouteOptions } from './Router.js';
import { RouteName, UserRouteConfig, RouteResponse, ModifyRouteConfig } from './Route.js';
import { MatcherDefinition, RouteMatcher } from './Matchers.js';
import CallHistory from './CallHistory.js';
export type HardResetOptions = {
    includeSticky?: boolean;
};
export type FetchMockGlobalConfig = {
    includeContentLength?: boolean;
    matchPartialBody?: boolean;
    allowRelativeUrls?: boolean;
};
export type FetchImplementations = {
    fetch?: typeof fetch;
    Headers?: typeof Headers;
    Request?: typeof Request;
    Response?: typeof Response;
};
export type FetchMockConfig = FetchMockGlobalConfig & FetchImplementations;
export declare const defaultFetchMockConfig: FetchMockConfig;
export declare class FetchMock {
    config: FetchMockConfig;
    router: Router;
    callHistory: CallHistory;
    constructor(config: FetchMockConfig, router?: Router);
    createInstance(): FetchMock;
    fetchHandler(this: FetchMock, requestInput: string | URL | Request, requestInit?: RequestInit): Promise<Response>;
    route(matcher: UserRouteConfig): FetchMock;
    route(matcher: RouteMatcher, response: RouteResponse, options?: UserRouteConfig | string): FetchMock;
    catch(response?: RouteResponse): FetchMock;
    defineMatcher(matcher: MatcherDefinition): void;
    removeRoutes(options?: RemoveRouteOptions): FetchMock;
    removeRoute(routeName: string): FetchMock;
    modifyRoute(routeName: string, options: ModifyRouteConfig): this;
    clearHistory(): FetchMock;
    mockGlobal(this: FetchMock): FetchMock;
    unmockGlobal(this: FetchMock): FetchMock;
    hardReset(options?: HardResetOptions): FetchMock;
    spy(this: FetchMock, matcher?: RouteMatcher | UserRouteConfig, name?: RouteName): FetchMock;
    spyGlobal(this: FetchMock): FetchMock;
    sticky: {
        (this: FetchMock, matcher: UserRouteConfig): FetchMock;
        (this: FetchMock, matcher: RouteMatcher, response: RouteResponse, options?: UserRouteConfig | string): FetchMock;
    };
    once: {
        (this: FetchMock, matcher: UserRouteConfig): FetchMock;
        (this: FetchMock, matcher: RouteMatcher, response: RouteResponse, options?: UserRouteConfig | string): FetchMock;
    };
    any: (this: FetchMock, response: RouteResponse, options?: UserRouteConfig | string) => FetchMock;
    anyOnce: (this: FetchMock, response: RouteResponse, options?: UserRouteConfig | string) => FetchMock;
    get: {
        (this: FetchMock, matcher: UserRouteConfig): FetchMock;
        (this: FetchMock, matcher: RouteMatcher, response: RouteResponse, options?: UserRouteConfig | string): FetchMock;
    };
    getOnce: {
        (this: FetchMock, matcher: UserRouteConfig): FetchMock;
        (this: FetchMock, matcher: RouteMatcher, response: RouteResponse, options?: UserRouteConfig | string): FetchMock;
    };
    post: {
        (this: FetchMock, matcher: UserRouteConfig): FetchMock;
        (this: FetchMock, matcher: RouteMatcher, response: RouteResponse, options?: UserRouteConfig | string): FetchMock;
    };
    postOnce: {
        (this: FetchMock, matcher: UserRouteConfig): FetchMock;
        (this: FetchMock, matcher: RouteMatcher, response: RouteResponse, options?: UserRouteConfig | string): FetchMock;
    };
    put: {
        (this: FetchMock, matcher: UserRouteConfig): FetchMock;
        (this: FetchMock, matcher: RouteMatcher, response: RouteResponse, options?: UserRouteConfig | string): FetchMock;
    };
    putOnce: {
        (this: FetchMock, matcher: UserRouteConfig): FetchMock;
        (this: FetchMock, matcher: RouteMatcher, response: RouteResponse, options?: UserRouteConfig | string): FetchMock;
    };
    delete: {
        (this: FetchMock, matcher: UserRouteConfig): FetchMock;
        (this: FetchMock, matcher: RouteMatcher, response: RouteResponse, options?: UserRouteConfig | string): FetchMock;
    };
    deleteOnce: {
        (this: FetchMock, matcher: UserRouteConfig): FetchMock;
        (this: FetchMock, matcher: RouteMatcher, response: RouteResponse, options?: UserRouteConfig | string): FetchMock;
    };
    head: {
        (this: FetchMock, matcher: UserRouteConfig): FetchMock;
        (this: FetchMock, matcher: RouteMatcher, response: RouteResponse, options?: UserRouteConfig | string): FetchMock;
    };
    headOnce: {
        (this: FetchMock, matcher: UserRouteConfig): FetchMock;
        (this: FetchMock, matcher: RouteMatcher, response: RouteResponse, options?: UserRouteConfig | string): FetchMock;
    };
    patch: {
        (this: FetchMock, matcher: UserRouteConfig): FetchMock;
        (this: FetchMock, matcher: RouteMatcher, response: RouteResponse, options?: UserRouteConfig | string): FetchMock;
    };
    patchOnce: {
        (this: FetchMock, matcher: UserRouteConfig): FetchMock;
        (this: FetchMock, matcher: RouteMatcher, response: RouteResponse, options?: UserRouteConfig | string): FetchMock;
    };
}
declare const fetchMock: FetchMock;
export default fetchMock;
