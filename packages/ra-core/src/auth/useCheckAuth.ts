import { useCallback } from 'react';
import { useSelector } from 'react-redux';
import { Location } from 'history';

import useAuthProvider, { defaultAuthParams } from './useAuthProvider';
import { AUTH_CHECK } from './types';
import useLogout from './useLogout';
import { ReduxState } from '../types';
import useNotify from '../sideEffect/useNotify';

/**
 * Get a callback for calling the authProvider with the AUTH_CHECK verb.
 * In case of rejection, redirects to the login page, displays a notification,
 * and throws an error.
 *
 * This is a low level hook. See those more specialized hooks
 * for common authentication tasks, based on useAuthCheck.
 *
 * @see useAuthenticated
 * @see useAuthState
 *
 * @param {Object} authParams Any params you want to pass to the authProvider
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
 *     const checkAuth = usecheckAuth();
 *     const [authenticated, setAuthenticated] = useState(true); // optimistic auth
 *     useEffect(() => {
 *         checkAuth(false)
 *              .then() => setAuthenticated(true))
 *              .catch(() => setAuthenticated(false));
 *     }, []);
 *     return authenticated ? <Bar /> : <BarNotAuthenticated />;
 * } // tip: use useAuthState() hook instead
 */
const useCheckAuth = (authParams: any = defaultAuthParams): CheckAuth => {
    const authProvider = useAuthProvider();
    const notify = useNotify();
    const logout = useLogout(authParams);

    const checkAuth = useCallback(
        (logoutOnFailure = true, redirectTo = authParams.loginUrl) =>
            authProvider(AUTH_CHECK, authParams).catch(error => {
                if (logoutOnFailure) {
                    logout(redirectTo);
                    notify(
                        getErrorMessage(error, 'ra.auth.auth_check_error'),
                        'warning'
                    );
                }
                throw error;
            }),
        [authParams, authProvider, logout, notify]
    );

    return authProvider ? checkAuth : checkAuthWithoutAuthProvider;
};

const checkAuthWithoutAuthProvider = (_, __) => Promise.resolve();

/**
 * Check if the current user is authenticated by calling the authProvider AUTH_CHECK verb.
 * Logs the user out on failure.
 *
 * @param {boolean} logoutOnFailure Whether the user should be logged out if the authProvider fails to authenticatde them. True by default.
 * @param {string} redirectTo The login form url. Defaults to '/login'
 *
 * @return {Promise} Resolved to the authProvider response if the user passes the check, or rejected with an error otherwise
 */
type CheckAuth = (
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
