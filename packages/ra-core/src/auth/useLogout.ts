import { useCallback } from 'react';
import { useDispatch } from 'react-redux';

import useAuthProvider, { defaultAuthParams } from './useAuthProvider';
import { clearState } from '../actions/clearActions';
import { useHistory } from 'react-router-dom';
import { LocationDescriptorObject } from 'history';

/**
 * Get a callback for calling the authProvider.logout() method,
 * redirect to the login page, and clear the Redux state.
 *
 * @see useAuthProvider
 *
 * @returns {Function} logout callback
 *
 * @example
 *
 * import { useLogout } from 'react-admin';
 *
 * const LogoutButton = () => {
 *     const logout = useLogout();
 *     const handleClick = () => logout();
 *     return <button onClick={handleClick}>Logout</button>;
 * }
 */
const useLogout = (): Logout => {
    const authProvider = useAuthProvider();
    const dispatch = useDispatch();

    /**
     * We need the current location to pass in the router state
     * so that the login hook knows where to redirect to as next route after login.
     *
     * But if we used useLocation to get it, the logout function
     * would be rebuilt each time the user changes location. Consequently, that
     * would force a rerender of all components using this hook upon navigation
     * (CoreAdminRouter for example).
     *
     * To avoid that, we read the location directly from history which is mutable.
     * See: https://reacttraining.com/react-router/web/api/history/history-is-mutable
     */
    const history = useHistory();

    const logout = useCallback(
        (
            params = {},
            redirectTo = defaultAuthParams.loginUrl,
            redirectToCurrentLocationAfterLogin = true
        ) =>
            authProvider.logout(params).then(redirectToFromProvider => {
                if (redirectToFromProvider === false) {
                    dispatch(clearState());
                    // do not redirect
                    return;
                }
                // redirectTo can contain a query string, e.g. '/login?foo=bar'
                // we must split the redirectTo to pass a structured location to history.push()
                const redirectToParts = (
                    redirectToFromProvider || redirectTo
                ).split('?');
                const newLocation: LocationDescriptorObject = {
                    pathname: redirectToParts[0],
                };
                if (
                    redirectToCurrentLocationAfterLogin &&
                    history.location &&
                    history.location.pathname
                ) {
                    newLocation.state = {
                        nextPathname: history.location.pathname,
                        nextSearch: history.location.search,
                    };
                }
                if (redirectToParts[1]) {
                    newLocation.search = redirectToParts[1];
                }
                history.push(newLocation);
                dispatch(clearState());

                return redirectToFromProvider;
            }),
        [authProvider, history, dispatch]
    );

    const logoutWithoutProvider = useCallback(
        _ => {
            history.push({
                pathname: defaultAuthParams.loginUrl,
                state: {
                    nextPathname: history.location && history.location.pathname,
                },
            });
            dispatch(clearState());
            return Promise.resolve();
        },
        [dispatch, history]
    );

    return authProvider ? logout : logoutWithoutProvider;
};

/**
 * Log the current user out by calling the authProvider.logout() method,
 * and redirect them to the login screen.
 *
 * @param {Object} params The parameters to pass to the authProvider
 * @param {string} redirectTo The path name to redirect the user to (optional, defaults to login)
 * @param {boolean} redirectToCurrentLocationAfterLogin Whether the button shall record the current location to redirect to it after login. true by default.
 *
 * @return {Promise} The authProvider response
 */
type Logout = (
    params?: any,
    redirectTo?: string,
    redirectToCurrentLocationAfterLogin?: boolean
) => Promise<any>;

export default useLogout;
