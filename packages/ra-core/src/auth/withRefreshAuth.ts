import { AuthProvider, DataProvider } from '../types';

/**
 * A higher-order function which wraps a dataProvider or authProvider to handle refreshing authentication.
 * This is useful when the authentication service supports a refresh token mechanism.
 * The wrapped provider will call the refreshAuth function before calling any dataProvider methods and before
 * calling the authProvider checkAuth, getIdentity and getPermissions methods.
 *
 * The refreshAuth function should return a Promise that resolves when the authentication token has been refreshed.
 * It might throw an error if the refresh failed. In this case, react-admin will handle the error as usual.
 *
 * @param provider Either a dataProvider or an authProvider
 * @param refreshAuth A function that refreshes the authentication token if needed and returns a Promise.
 * @returns A wrapped dataProvider or authProvider.
 *
 * @example
 * import { withRefreshAuth } from 'react-admin';
 * import { jsonServerProvider } from 'ra-data-json-server';
 * import { authProvider } from './authProvider';
 * import { refreshAuth } from './refreshAuth';
 *
 * const dataProvider = withRefreshAuth(jsonServerProvider('http://localhost:3000'), refreshAuth);
 * const authProvider = withRefreshAuth(authProvider, refreshAuth);
 */
export const withRefreshAuth = <
    ProviderType extends AuthProvider | DataProvider
>(
    provider: ProviderType,
    refreshAuth: () => Promise<void>
): ProviderType => {
    const proxy = new Proxy(provider, {
        get(_, name) {
            const isDataProvider = provider.hasOwnProperty('getList');
            const shouldIntercept =
                isDataProvider ||
                AuthProviderInterceptedMethods.includes(name.toString());

            if (shouldIntercept) {
                return async (...args: any[]) => {
                    await refreshAuth();
                    return provider[name.toString()](...args);
                };
            }

            return provider[name.toString()];
        },
    });

    return proxy;
};

const AuthProviderInterceptedMethods = [
    'checkAuth',
    'getIdentity',
    'getPermissions',
];
