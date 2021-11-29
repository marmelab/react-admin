import { useCallback, useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';

import useAuthProvider, { defaultAuthParams } from './useAuthProvider';
import { clearState } from '../actions/clearActions';
import { useLocation, useNavigate, Path } from 'react-router-dom';

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
    const navigate = useNavigate();
    const location = useLocation();
    const locationRef = useRef(location);

    /*
     * We need the current location to pass in the router state
     * so that the login hook knows where to redirect to as next route after login.
     *
     * But if we used the location from useLocation as a dependency of the logout
     * function, it would be rebuilt each time the user changes location.
     * Consequently, that would force a rerender of all components using this hook
     * upon navigation (CoreAdminRouter for example).
     *
     * To avoid that, we store the location in a ref.
     */
    useEffect(() => {
        locationRef.current = location;
    }, [location]);

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
                const newLocation: Partial<Path> = {
                    pathname: redirectToParts[0],
                };
                let newLocationOptions = {};

                if (
                    redirectToCurrentLocationAfterLogin &&
                    locationRef.current &&
                    locationRef.current.pathname
                ) {
                    newLocationOptions = {
                        state: {
                            nextPathname: locationRef.current.pathname,
                            nextSearch: locationRef.current.search,
                        },
                    };
                }
                if (redirectToParts[1]) {
                    newLocation.search = redirectToParts[1];
                }
                navigate(newLocation, newLocationOptions);
                dispatch(clearState());

                return redirectToFromProvider;
            }),
        [authProvider, dispatch, navigate]
    );

    const logoutWithoutProvider = useCallback(
        _ => {
            navigate(
                {
                    pathname: defaultAuthParams.loginUrl,
                },
                {
                    state: {
                        nextPathname: location && location.pathname,
                    },
                }
            );
            dispatch(clearState());
            return Promise.resolve();
        },
        [dispatch, location, navigate]
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
