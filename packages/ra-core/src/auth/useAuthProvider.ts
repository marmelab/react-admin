import { useCallback, useMemo, useContext } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { push } from 'connected-react-router';
import { Location } from 'history';

import AuthContext from './AuthContext';
import {
    AUTH_LOGIN,
    AUTH_CHECK,
    AUTH_LOGOUT,
    AUTH_GET_PERMISSIONS,
} from './types';
import { clearState } from '../actions/clearActions';
import { ReduxState } from '../types';
import useNotify from '../sideEffect/useNotify';

const defaultParams = {
    loginUrl: '/login',
    afterLoginUrl: '/',
};

const emptyArray = [];

interface AuthCallbacks {
    login: (params: any, pathName?: string) => Promise<any>;
    logout: (redirectTo: string) => Promise<any>;
    check: (
        location?: Location,
        logoutOnFailure?: boolean,
        redirectTo?: string
    ) => Promise<any>;
    getPermissions: (location?: Location) => Promise<any>;
}

/**
 * Hook for calling the authProvider.
 *
 * Returns a set of callbacks for each of the authProvider verbs.
 * These callbacks return a Promise for the authProvider response.
 *
 * - login: calls the AUTH_LOGIN verb and redirects to the previous
 *   authenticated page (or the home page) on success.
 *
 * - logout: calls the AUTH_LOGOUT verb, redirects to the login page,
 *   and clears the Redux state.
 *
 * - check: calls the AUTH_CHECK verb. In case of rejection,
 *   redirects to the login page, displays a notification, and throws an error.
 *
 * - getPermissions: calls the AUTH_GET_PERMISSIONS verb.
 *
 * This is a low level hook. See those more specialized hooks
 * for common authentication tasks, based on useAuthProvider.
 *
 * @see useAuthenticated
 * @see useAuthState
 * @see usePermissions
 *
 * @param {Object} authParams Any params you want to pass to the authProvider
 *
 * @returns {Object} { login, logout, checkAuth, getPermissions } callbacks for the authProvider
 *
 * @example
 *
 * import { useAuthProvider } from 'react-admin';
 *
 * const LoginButton = () => {
 *     const [loading, setLoading] = useState(false);
 *     const { login } = useAuthProvider();
 *     const handleClick = {
 *         setLoading(true);
 *         login({ username: 'john', password: 'p@ssw0rd' }, '/posts')
 *             .then(() => setLoading(false));
 *     }
 *     return <button onClick={handleClick}>Login</button>;
 * }
 *
 * const LogoutButton = () => {
 *     const { logout } = useAuthProvider();
 *     const handleClick = () => logout();
 *     return <button onClick={handleClick}>Logout</button>;
 * }
 *
 * const MyProtectedPage = () => {
 *     const { check } = useAuthProvider();
 *     useEffect(() => {
 *         check().catch(() => {});
 *     }, []);
 *     return <p>Private content: EZAEZEZAET</p>
 * } // tip: use useAuthenticated() hook instead
 *
 * const MyPage = () => {
 *     const { check } = useAuthProvider();
 *     const [authenticated, setAuthenticated] = useState(true); // optimistic auth
 *     useEffect(() => {
 *         check(undefined, false)
 *              .then() => setAuthenticated(true))
 *              .catch(() => setAuthenticated(false));
 *     }, []);
 *     return authenticated ? <Bar /> : <BarNotAuthenticated />;
 * } // tip: use useAuthState() hook instead
 */
const useAuthProvider = (authParams: any = defaultParams): AuthCallbacks => {
    const authProvider = useContext(AuthContext);
    const currentLocation = useSelector(
        (state: ReduxState) => state.router.location
    );
    const nextPathName =
        currentLocation.state && currentLocation.state.nextPathname;
    const dispatch = useDispatch();
    const notify = useNotify();

    /**
     * Log a user in by calling the authProvider AUTH_LOGIN verb
     *
     * @param {object} params Login parameters to pass to the authProvider. May contain username/email, password, etc
     * @param {string} pathName The path to redirect to after login. By default, redirects to the home page, or to the last page visited after deconnexion.
     *
     * @return {Promise} The authProvider response
     */
    const login = useCallback(
        (params, pathName = authParams.afterLoginUrl) =>
            authProvider(AUTH_LOGIN, { ...params, ...authParams }).then(ret => {
                dispatch(push(nextPathName || pathName));
                return ret;
            }),
        [authParams, authProvider, dispatch, nextPathName]
    );

    /**
     * Log the current user out by calling the authProvider AUTH_LOGOUT verb,
     * and redirect them to the login screen.
     *
     * @param {string} redirectTo The path name to redirect the user to (optional, defaults to login)
     *
     * @return {Promise} The authProvider response
     */
    const logout = useCallback(
        (redirectTo = authParams.loginUrl) =>
            authProvider(AUTH_LOGOUT, authParams).then(
                redirectToFromProvider => {
                    dispatch(
                        push({
                            pathname: redirectToFromProvider || redirectTo,
                            state: {
                                nextPathname:
                                    currentLocation && currentLocation.pathname,
                            },
                        })
                    );
                    dispatch(clearState());
                    return redirectToFromProvider;
                }
            ),
        [authParams, authProvider, currentLocation, dispatch]
    );

    /**
     * Check if the current user is authenticated by calling the authProvider AUTH_CHECK verb.
     * Logs the user out on failure.
     *
     * @param {Location} location The path name to check auth for
     * @param {boolean} logoutOnFailure Whether the user should be logged out if the authProvider fails to authenticatde them. True by default.
     *
     * @return {Promise} Resolved to the authProvider response if the user passes the check, or rejected with an error otherwise
     */
    const check = useCallback(
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

    const getPermissions = useCallback(
        (location: Location = currentLocation) =>
            authProvider(AUTH_GET_PERMISSIONS, { location, ...authParams }),
        [authParams, authProvider, currentLocation]
    );

    const callbacksForMissingAuthProvider = useMemo(
        () => ({
            login: (_, __) => {
                dispatch(push(authParams.afterLoginUrl));
                return Promise.resolve();
            },
            logout: _ => {
                dispatch(
                    push({
                        pathname: authParams.loginUrl,
                        state: {
                            nextPathname:
                                currentLocation && currentLocation.pathname,
                        },
                    })
                );
                dispatch(clearState());
                return Promise.resolve();
            },
            check: () => Promise.resolve(true),
            getPermissions: () => Promise.resolve(emptyArray),
        }),
        [
            authParams.afterLoginUrl,
            authParams.loginUrl,
            currentLocation,
            dispatch,
        ]
    );

    return authProvider
        ? { login, logout, check, getPermissions }
        : callbacksForMissingAuthProvider;
};

const getErrorMessage = (error, defaultMessage) =>
    typeof error === 'string'
        ? error
        : typeof error === 'undefined' || !error.message
        ? defaultMessage
        : error.message;

export default useAuthProvider;
