import { RouteMatcherFunction, RouteMatcherUrl, MatcherDefinition } from './Matchers.js';
import type { FetchMockGlobalConfig, FetchImplementations } from './FetchMock.js';
import type { CallLog } from './CallHistory.js';
export type UserRouteSpecificConfig = {
    name?: RouteName;
    method?: string;
    headers?: {
        [key: string]: string | number;
    };
    missingHeaders?: string[];
    query?: {
        [key: string]: string;
    };
    params?: {
        [key: string]: string;
    };
    body?: object;
    matcherFunction?: RouteMatcherFunction;
    url?: RouteMatcherUrl;
    response?: RouteResponse | RouteResponseFunction;
    repeat?: number;
    delay?: number;
    waitFor?: RouteName | RouteName[];
    sticky?: boolean;
};
export type InternalRouteConfig = {
    usesBody?: boolean;
    isFallback?: boolean;
};
export type UserRouteConfig = UserRouteSpecificConfig & FetchMockGlobalConfig;
type Nullable<T> = {
    [K in keyof T]: T[K] | null;
};
export type ModifyRouteConfig = Omit<Nullable<UserRouteSpecificConfig>, 'name' | 'sticky'>;
export type RouteConfig = UserRouteConfig & FetchImplementations & InternalRouteConfig;
export type RouteResponseConfig = {
    body?: BodyInit | object;
    status?: number;
    headers?: {
        [key: string]: string;
    };
    throws?: Error;
    redirectUrl?: string;
    options?: ResponseInit;
};
export type ResponseInitUsingHeaders = {
    status: number;
    statusText: string;
    headers: Headers;
};
export type RouteResponseObjectData = RouteResponseConfig | object;
export type RouteResponseData = Response | number | string | RouteResponseObjectData;
export type RouteResponsePromise = Promise<RouteResponseData>;
export type RouteResponseFunction = (arg0: CallLog) => RouteResponseData | RouteResponsePromise;
export type RouteResponse = RouteResponseData | RouteResponsePromise | RouteResponseFunction;
export type RouteName = string;
declare class Route {
    #private;
    config: RouteConfig;
    matcher: RouteMatcherFunction;
    constructor(config: RouteConfig);
    init(config: RouteConfig | ModifyRouteConfig): void;
    reset(): void;
    waitFor(awaitedRoutes: Route[]): void;
    onRespond(func: () => void): void;
    constructResponse(responseInput: RouteResponseConfig): {
        response: Response;
        responseOptions: ResponseInit;
        responseInput: RouteResponseConfig;
    };
    constructResponseOptions(responseInput: RouteResponseConfig): ResponseInitUsingHeaders;
    constructResponseBody(responseInput: RouteResponseConfig, responseOptions: ResponseInitUsingHeaders): BodyInit;
    static defineMatcher(matcher: MatcherDefinition): void;
    static registeredMatchers: MatcherDefinition[];
}
export default Route;
