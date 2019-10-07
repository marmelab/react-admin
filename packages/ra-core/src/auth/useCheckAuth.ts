import { useCallback } from 'react';

import useAuthProvider, { defaultAuthParams } from './useAuthProvider';
import useLogout from './useLogout';
import useNotify from '../sideEffect/useNotify';

/**
 * Get a callback for calling the authProvider.checkAuth() method.
 * In case of rejection, redirects to the login page, displays a notification,
 * and throws an error.
 *
 * This is a low level hook. See those more specialized hooks
 * for common authentication tasks, based on useAuthCheck.
 *
 * @see useAuthenticated
 * @see useAuthState
 *
 * @returns {Function} checkAuth callback
 *
 * @example
 *
 * import { useCheckAuth } from 'react-admin';
 *
 * const MyProtectedPage = () => {
 *     const checkAuth = useCheckAuth();
 *     useEffect(() => {
 *         checkAuth().catch(() => {});
 *     }, []);
 *     return <p>Private content: EZAEZEZAET</p>
 * } // tip: use useAuthenticated() hook instead
 *
 * const MyPage = () => {
 *     const checkAuth = useCheckAuth();
 *     const [authenticated, setAuthenticated] = useState(true); // optimistic auth
 *     useEffect(() => {
 *         checkAuth({}, false)
 *              .then() => setAuthenticated(true))
 *              .catch(() => setAuthenticated(false));
 *     }, []);
 *     return authenticated ? <Bar /> : <BarNotAuthenticated />;
 * } // tip: use useAuthState() hook instead
 */
const useCheckAuth = (): CheckAuth => {
    const authProvider = useAuthProvider();
    const notify = useNotify();
    const logout = useLogout();

    const checkAuth = useCallback(
        (
            params: any = {},
            logoutOnFailure = true,
            redirectTo = defaultAuthParams.loginUrl
        ) =>
            authProvider.checkAuth(params).catch(error => {
                if (logoutOnFailure) {
                    logout(
                        {},
                        error && error.redirectTo
                            ? error.redirectTo
                            : redirectTo
                    );
                    notify(
                        getErrorMessage(error, 'ra.auth.auth_check_error'),
                        'warning'
                    );
                }
                throw error;
            }),
        [authProvider, logout, notify]
    );

    return authProvider ? checkAuth : checkAuthWithoutAuthProvider;
};

const checkAuthWithoutAuthProvider = () => Promise.resolve();

/**
 * Check if the current user is authenticated by calling authProvider.checkAuth().
 * Logs the user out on failure.
 *
 * @param {Object} params The parameters to pass to the authProvider
 * @param {boolean} logoutOnFailure Whether the user should be logged out if the authProvider fails to authenticatde them. True by default.
 * @param {string} redirectTo The login form url. Defaults to '/login'
 *
 * @return {Promise} Resolved to the authProvider response if the user passes the check, or rejected with an error otherwise
 */
type CheckAuth = (
    params?: any,
    logoutOnFailure?: boolean,
    redirectTo?: string
) => Promise<any>;

const getErrorMessage = (error, defaultMessage) =>
    typeof error === 'string'
        ? error
        : typeof error === 'undefined' || !error.message
        ? defaultMessage
        : error.message;

export default useCheckAuth;
