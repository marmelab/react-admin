import { useCallback } from 'react';
import { useDispatch, useStore } from 'react-redux';
import { push } from 'connected-react-router';

import useAuthProvider, { defaultAuthParams } from './useAuthProvider';
import { AUTH_LOGOUT } from './types';
import { clearState } from '../actions/clearActions';

/**
 * Get a callback for calling the authProvider with the AUTH_LOGOUT verb,
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
    /**
     * We need the current location to pass in the router state
     * so that the login hook knows where to redirect to as next route after login.
     *
     * But if we used useSelector to read it from the store, the logout function
     * would be rebuilt each time the user changes location. Consequently, that
     * would force a rerender of the Logout button upon navigation.
     *
     * To avoid that, we don't subscribe to the store using useSelector;
     * instead, we get a pointer to the store, and determine the location only
     * after the logout function was called.
     */

    const store = useStore();
    const dispatch = useDispatch();

    const logout = useCallback(
        (params = {}, redirectTo = defaultAuthParams.loginUrl) =>
            authProvider(AUTH_LOGOUT, params).then(redirectToFromProvider => {
                dispatch(clearState());
                const currentLocation = store.getState().router.location;
                dispatch(
                    push({
                        pathname: redirectToFromProvider || redirectTo,
                        state: {
                            nextPathname:
                                currentLocation && currentLocation.pathname,
                        },
                    })
                );
                return redirectToFromProvider;
            }),
        [authProvider, store, dispatch]
    );

    const logoutWithoutProvider = useCallback(
        _ => {
            const currentLocation = store.getState().router.location;
            dispatch(
                push({
                    pathname: defaultAuthParams.loginUrl,
                    state: {
                        nextPathname:
                            currentLocation && currentLocation.pathname,
                    },
                })
            );
            dispatch(clearState());
            return Promise.resolve();
        },
        [store, dispatch]
    );

    return authProvider ? logout : logoutWithoutProvider;
};

/**
 * Log the current user out by calling the authProvider AUTH_LOGOUT verb,
 * and redirect them to the login screen.
 *
 * @param {Object} params The parameters to pass to the authProvider
 * @param {string} redirectTo The path name to redirect the user to (optional, defaults to login)
 *
 * @return {Promise} The authProvider response
 */
type Logout = (params?: any, redirectTo?: string) => Promise<any>;

export default useLogout;
