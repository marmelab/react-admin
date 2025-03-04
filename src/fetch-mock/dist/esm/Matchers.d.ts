import { RouteConfig } from './Route.js';
import { CallLog } from './CallHistory.js';
export type URLMatcherObject = {
    begin?: string;
    end?: string;
    include?: string;
    glob?: string;
    express?: string;
    path?: string;
    regexp?: RegExp;
};
export type RouteMatcherUrl = string | RegExp | URL | URLMatcherObject;
export type RouteMatcherFunction = (callLog: CallLog) => boolean;
type MatcherGenerator = (route: RouteConfig) => RouteMatcherFunction;
export type RouteMatcher = RouteMatcherUrl | RouteMatcherFunction;
export type MatcherDefinition = {
    name: string;
    matcher: MatcherGenerator;
    usesBody?: boolean;
};
export declare const isUrlMatcher: (matcher: RouteMatcher | RouteConfig) => matcher is RouteMatcherUrl;
export declare const isFunctionMatcher: (matcher: RouteMatcher | RouteConfig) => matcher is RouteMatcherFunction;
export declare const builtInMatchers: MatcherDefinition[];
export {};
