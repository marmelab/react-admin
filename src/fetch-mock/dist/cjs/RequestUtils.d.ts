import type { CallLog } from './CallHistory.js';
interface DerivedRequestOptions {
    method: string;
    body?: string;
    headers?: {
        [key: string]: string;
    };
}
export type NormalizedRequestOptions = RequestInit | (RequestInit & DerivedRequestOptions);
export declare function hasCredentialsInUrl(url: string): boolean;
export declare function normalizeUrl(url: string | String | URL, allowRelativeUrls: boolean): string;
export declare function createCallLogFromUrlAndOptions(url: string | String | object, options: RequestInit): CallLog;
export declare function createCallLogFromRequest(request: Request, options: RequestInit): Promise<CallLog>;
export declare function getPath(url: string): string;
export declare function getQuery(url: string): string;
export declare function normalizeHeaders(headers: HeadersInit | {
    [key: string]: string | number;
}): {
    [key: string]: string;
};
export {};
