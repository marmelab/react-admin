import { AuthProvider } from '../types';

/**
 * A higher-order function which wraps an authProvider to handle refreshing authentication.
 * This is useful when the authentication service supports a refresh token mechanism.
 * The wrapped provider will call the refreshAuth function before
 * calling the authProvider checkAuth, getIdentity and getPermissions methods.
 *
 * The refreshAuth function should return a Promise that resolves when the authentication token has been refreshed.
 * It might throw an error if the refresh failed. In this case, react-admin will handle the error as usual.
 *
 * @param provider An authProvider
 * @param refreshAuth A function that refreshes the authentication token if needed and returns a Promise.
 * @returns A wrapped authProvider.
 *
 * @example
 * import { addRefreshAuthToAuthProvider } from 'react-admin';
 * import { authProvider } from './authProvider';
 * import { refreshAuth } from './refreshAuth';
 *
 * const authProvider = addRefreshAuthToAuthProvider(authProvider, refreshAuth);
 */
export const addRefreshAuthToAuthProvider = (
    provider: AuthProvider,
    refreshAuth: () => Promise<void>
): AuthProvider => {
    const proxy = new Proxy(provider, {
        get(_, name) {
            const shouldIntercept =
                AuthProviderInterceptedMethods.includes(name.toString()) &&
                provider[name.toString()] != null;

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
