import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { push } from 'connected-react-router';

import useAuthProvider, { defaultAuthParams } from './useAuthProvider';
import { AUTH_LOGOUT } from './types';
import { clearState } from '../actions/clearActions';
import { ReduxState } from '../types';

/**
 * Get a callback for calling the authProvider with the AUTH_LOGOUT verb,
 * redirect to the login page, and clear the Redux state.
 *
 * @see useAuthProvider
 * @param {Object} authParams Any params you want to pass to the authProvider
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
const useLogout = (authParams: any = defaultAuthParams): Logout => {
    const authProvider = useAuthProvider();
    const currentLocation = useSelector(
        (state: ReduxState) => state.router.location
    );
    const dispatch = useDispatch();

    const logout = useCallback(
        (redirectTo = authParams.loginUrl) =>
            authProvider(AUTH_LOGOUT, authParams).then(
                redirectToFromProvider => {
                    dispatch(clearState());
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
                }
            ),
        [authParams, authProvider, currentLocation, dispatch]
    );

    const logoutWithoutProvider = useCallback(
        _ => {
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
        [authParams.loginUrl, currentLocation, dispatch]
    );

    return authProvider ? logout : logoutWithoutProvider;
};

/**
 * Log the current user out by calling the authProvider AUTH_LOGOUT verb,
 * and redirect them to the login screen.
 *
 * @param {string} redirectTo The path name to redirect the user to (optional, defaults to login)
 *
 * @return {Promise} The authProvider response
 */
type Logout = (redirectTo: string) => Promise<any>;

export default useLogout;
