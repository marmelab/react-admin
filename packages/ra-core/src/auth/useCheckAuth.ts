import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { push } from 'connected-react-router';
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
 * @returns {Object} { login, logout, checkAuth, getPermissions } callbacks for the authProvider
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
 *         checkAuth(undefined, false)
 *              .then() => setAuthenticated(true))
 *              .catch(() => setAuthenticated(false));
 *     }, []);
 *     return authenticated ? <Bar /> : <BarNotAuthenticated />;
 * } // tip: use useAuthState() hook instead
 */
const useCheckAuth = (authParams: any = defaultAuthParams): CheckAuth => {
    const authProvider = useAuthProvider();
    const currentLocation = useSelector(
        (state: ReduxState) => state.router.location
    );
    const dispatch = useDispatch();
    const notify = useNotify();
    const logout = useLogout(authParams);

    const checkAuth = useCallback(
        (
            location: Location = currentLocation,
            logoutOnFailure = true,
            redirectTo = authParams.loginUrl
        ) =>
            authProvider(AUTH_CHECK, {
                location,
                ...authParams,
            }).catch(error => {
                if (logoutOnFailure) {
                    logout(redirectTo);
                    notify(
                        getErrorMessage(error, 'ra.auth.auth_check_error'),
                        'warning'
                    );
                }
                throw error;
            }),
        [authParams, authProvider, currentLocation, logout, notify]
    );

    const checkAuthWithoutAuthProvider = useCallback(
        (_, __) => Promise.resolve(),
        []
    );

    return authProvider ? checkAuth : checkAuthWithoutAuthProvider;
};

/**
 * Check if the current user is authenticated by calling the authProvider AUTH_CHECK verb.
 * Logs the user out on failure.
 *
 * @param {Location} location The path name to check auth for
 * @param {boolean} logoutOnFailure Whether the user should be logged out if the authProvider fails to authenticatde them. True by default.
 *
 * @return {Promise} Resolved to the authProvider response if the user passes the check, or rejected with an error otherwise
 */
type CheckAuth = (
    location?: Location,
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
