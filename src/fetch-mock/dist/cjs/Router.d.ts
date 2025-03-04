import Route, { UserRouteConfig, RouteResponse, RouteResponseConfig, ModifyRouteConfig } from './Route.js';
import { RouteMatcher } from './Matchers.js';
import { FetchMockConfig } from './FetchMock.js';
import type { CallLog } from './CallHistory.js';
export type ResponseConfigProp = 'body' | 'headers' | 'throws' | 'status' | 'redirectUrl';
export type RemoveRouteOptions = {
    includeSticky?: boolean;
    includeFallback?: boolean;
    names?: string[];
};
export default class Router {
    routes: Route[];
    config: FetchMockConfig;
    fallbackRoute: Route;
    constructor(fetchMockConfig: FetchMockConfig, { routes, fallbackRoute }?: {
        routes?: Route[];
        fallbackRoute?: Route;
    });
    needsToReadBody(request: Request): boolean;
    execute(callLog: CallLog): Promise<Response>;
    generateResponse(callLog: CallLog): Promise<{
        response: Response;
        responseOptions: ResponseInit;
        responseInput: RouteResponseConfig;
    }>;
    createObservableResponse(response: Response, responseConfig: ResponseInit, responseInput: RouteResponseConfig, responseUrl: string, pendingPromises: Promise<unknown>[]): Response;
    addRoute(matcher: RouteMatcher | UserRouteConfig, response?: RouteResponse, nameOrOptions?: UserRouteConfig | string): void;
    setFallback(response?: RouteResponse): void;
    removeRoutes({ names, includeSticky, includeFallback, }?: RemoveRouteOptions): void;
    modifyRoute(routeName: string, options: ModifyRouteConfig): void;
}
