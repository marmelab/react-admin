import { useCallback } from 'react';

import useAuthProvider from './useAuthProvider';
import useLogout from './useLogout';
import { useNotify } from '../notification';
import { useNavigate } from 'react-router';

let timer;

/**
 * Returns a callback used to call the authProvider.checkError() method
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
 *         dataProvider.getOne('secret', { id: 123 })
 *             .catch(error => {
 *                  logoutIfAccessDenied(error);
 *                  notify('server error',  { type: 'error' });
 *              })
 *     }, []);
 *     // ...
 * }
 */
const useLogoutIfAccessDenied = (): LogoutIfAccessDenied => {
    const authProvider = useAuthProvider();
    const logout = useLogout();
    const notify = useNotify();
    const navigate = useNavigate();
    const logoutIfAccessDenied = useCallback(
        (error?: any, disableNotification?: boolean) =>
            authProvider
                .checkError(error)
                .then(() => false)
                .catch(async e => {
                    const logoutUser = e?.logoutUser ?? true;

                    //manual debounce
                    if (timer) {
                        // side effects already triggered in this tick, exit
                        return true;
                    }
                    timer = setTimeout(() => {
                        timer = undefined;
                    }, 0);

                    const redirectTo =
                        e && e.redirectTo != null
                            ? e.redirectTo
                            : error && error.redirectTo
                            ? error.redirectTo
                            : undefined;

                    const shouldNotify = !(
                        disableNotification ||
                        (e && e.message === false) ||
                        (error && error.message === false) ||
                        redirectTo?.startsWith('http')
                    );
                    if (shouldNotify) {
                        // notify only if not yet logged out
                        authProvider
                            .checkAuth({})
                            .then(() => {
                                if (logoutUser) {
                                    notify(
                                        getErrorMessage(
                                            e,
                                            'ra.notification.logged_out'
                                        ),
                                        { type: 'error' }
                                    );
                                } else {
                                    notify(
                                        getErrorMessage(
                                            e,
                                            'ra.notification.not_authorized'
                                        ),
                                        { type: 'error' }
                                    );
                                }
                            })
                            .catch(() => {});
                    }

                    if (logoutUser) {
                        logout({}, redirectTo);
                    } else {
                        if (redirectTo.startsWith('http')) {
                            // absolute link (e.g. https://my.oidc.server/login)
                            window.location.href = redirectTo;
                        } else {
                            // internal location
                            navigate(redirectTo);
                        }
                    }

                    return true;
                }),
        [authProvider, logout, notify, navigate]
    );
    return authProvider
        ? logoutIfAccessDenied
        : logoutIfAccessDeniedWithoutProvider;
};

const logoutIfAccessDeniedWithoutProvider = () => Promise.resolve(false);

/**
 * Call the authProvider.authError() method, using the error passed as argument.
 * If the authProvider rejects the call, logs the user out and shows a logged out notification.
 *
 * @param {Error} error An Error object (usually returned by the dataProvider)
 * @param {boolean} disableNotification Avoid showing a notification after the user is logged out. false by default.
 *
 * @return {Promise} Resolved to true if there was a logout, false otherwise
 */
type LogoutIfAccessDenied = (
    error?: any,
    /** @deprecated to disable the notification, authProvider.checkAuth() should return an object with an error property set to true */
    disableNotification?: boolean
) => Promise<boolean>;

const getErrorMessage = (error, defaultMessage) =>
    typeof error === 'string'
        ? error
        : typeof error === 'undefined' || !error.message
        ? defaultMessage
        : error.message;

export default useLogoutIfAccessDenied;
