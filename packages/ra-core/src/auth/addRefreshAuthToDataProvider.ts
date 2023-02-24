import { DataProvider } from '../types';

/**
 * A higher-order function which wraps a dataProvider to handle refreshing authentication.
 * This is useful when the authentication service supports a refresh token mechanism.
 * The wrapped provider will call the refreshAuth function before calling any dataProvider methods.
 *
 * The refreshAuth function should return a Promise that resolves when the authentication token has been refreshed.
 * It might throw an error if the refresh failed. In this case, react-admin will handle the error as usual.
 *
 * @param provider A dataProvider
 * @param refreshAuth A function that refreshes the authentication token if needed and returns a Promise.
 * @returns A wrapped dataProvider.
 *
 * @example
 * import { addRefreshAuthToDataProvider } from 'react-admin';
 * import { jsonServerProvider } from 'ra-data-json-server';
 * import { refreshAuth } from './refreshAuth';
 *
 * const dataProvider = addRefreshAuthToDataProvider(jsonServerProvider('http://localhost:3000'), refreshAuth);
 */
export const addRefreshAuthToDataProvider = (
    provider: DataProvider,
    refreshAuth: () => Promise<void>
): DataProvider => {
    const proxy = new Proxy(provider, {
        get(_, name) {
            return async (...args: any[]) => {
                await refreshAuth();
                return provider[name.toString()](...args);
            };
        },
    });

    return proxy;
};
