import { useCallback } from 'react';

import { AUTH_ERROR } from './types';
import useAuthProvider from './useAuthProvider';
import useLogout from './useLogout';
import { useNotify } from '../sideEffect';

/**
 * Returns a callback used to call the authProvidr with the AUTH_ERROR verb
 * and an error from the dataProvider. If the authProvider rejects the call,
 * the hook logs the user out and shows a logget out notification.
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
const useLogoutIfAccessDenied = () => {
    const authProvider = useAuthProvider();
    const logout = useLogout();
    const notify = useNotify();
    const logoutIfAccessDenied = useCallback(
        (error?: any) =>
            authProvider(AUTH_ERROR, error).catch(e => {
                logout();
                notify('ra.notification.logged_out', 'warning');
            }),
        [authProvider, logout, notify]
    );
    return logoutIfAccessDenied;
};

export default useLogoutIfAccessDenied;
