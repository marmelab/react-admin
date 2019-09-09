import { useCallback } from 'react';

import { AUTH_ERROR } from './types';
import useAuthProvider from './useAuthProvider';
import useLogout from './useLogout';
import { useNotify } from '../sideEffect';

/**
 * Returns a callback used to call the authProvidr with the AUTH_ERROR verb
 * and an error from the dataProvider. If the authProvider rejects the call,
 * the hook logs the user out and shows a logged out notification.
 *
 * Used in the useDataProvider hook to check for access denied responses
 * (e.g. 401 or 403 responses) and trigger a logout.
 *
 * @see useLogout
 * @see useDataProvider
 *
 * @returns {Function} logoutIfAccessDenied callback
 *
 * @example
 *
 * import { useLogoutIfAccessDenied, useNotify, DataProviderContext } from 'react-admin';
 *
 * const FetchRestrictedResource = () => {
 *     const dataProvider = useContext(DataProviderContext);
 *     const logoutIfAccessDenied = useLogoutIfAccessDenied();
 *     const notify = useNotify()
 *     useEffect(() => {
 *         dataProvider('GET_ONE', 'secret', { id: 123 })
 *             .catch(error => {
 *                  logoutIfaccessDenied(error);
 *                  notify('server error', 'warning');
 *              })
 *     }, []);
 *     // ...
 * }
 */
const useLogoutIfAccessDenied = (): LogoutIfAccessDenied => {
    const authProvider = useAuthProvider();
    const logout = useLogout();
    const notify = useNotify();
    const logoutIfAccessDenied = useCallback(
        (error?: any) =>
            authProvider(AUTH_ERROR, error)
                .then(() => false)
                .catch(e => {
                    const redirectTo =
                        e && e.redirectTo
                            ? e.redirectTo
                            : error && error.redirectTo
                            ? error.redirectto
                            : undefined;
                    logout({}, redirectTo);
                    notify('ra.notification.logged_out', 'warning');
                    return true;
                }),
        [authProvider, logout, notify]
    );
    return authProvider
        ? logoutIfAccessDenied
        : logoutIfAccessDeniedWithoutProvider;
};

const logoutIfAccessDeniedWithoutProvider = () => Promise.resolve(false);

/**
 * Call the authProvidr with the AUTH_ERROR verb and the error passed as argument.
 * If the authProvider rejects the call, logs the user out and shows a logged out notification.
 *
 * @param {Error} error An Error object (usually returned by the dataProvider)
 *
 * @return {Promise} Resolved to true if there was a logout, false otherwise
 */
type LogoutIfAccessDenied = (error?: any) => Promise<boolean>;

export default useLogoutIfAccessDenied;
