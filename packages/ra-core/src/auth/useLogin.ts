import { useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { useNotificationContext } from '../notification';
import { useBasename } from '../routing';
import useAuthProvider, { defaultAuthParams } from './useAuthProvider';
import { removeDoubleSlashes } from '../routing/useCreatePath';
import { useQueryClient } from '@tanstack/react-query';

/**
 * Get a callback for calling the authProvider.login() method
 * and redirect to the previous authenticated page (or the home page) on success.
 *
 * @see useAuthProvider
 *
 * @returns {Function} login callback
 *
 * @example
 *
 * import { useLogin } from 'react-admin';
 *
 * const LoginButton = () => {
 *     const [loading, setLoading] = useState(false);
 *     const login = useLogin();
 *     const handleClick = {
 *         setLoading(true);
 *         login({ username: 'john', password: 'p@ssw0rd' }, '/posts')
 *             .then(() => setLoading(false));
 *     }
 *     return <button onClick={handleClick}>Login</button>;
 * }
 */
const useLogin = (): Login => {
    const authProvider = useAuthProvider();
    const queryClient = useQueryClient();
    const location = useLocation();
    const locationState = location.state as any;
    const navigate = useNavigate();
    const basename = useBasename();
    const { resetNotifications } = useNotificationContext();
    const nextPathName = locationState && locationState.nextPathname;
    const nextSearch = locationState && locationState.nextSearch;
    const afterLoginUrl = removeDoubleSlashes(
        `${basename}/${defaultAuthParams.afterLoginUrl}`
    );

    const login = useCallback(
        (params: any = {}, pathName) => {
            if (authProvider) {
                return authProvider.login(params).then(ret => {
                    resetNotifications();
                    queryClient.invalidateQueries({
                        queryKey: ['auth', 'getPermissions'],
                    });
                    if (ret && ret.hasOwnProperty('redirectTo')) {
                        if (ret) {
                            navigate(ret.redirectTo);
                        }
                    } else {
                        const redirectUrl = pathName
                            ? pathName
                            : nextPathName + nextSearch || afterLoginUrl;
                        navigate(redirectUrl);
                    }
                    return ret;
                });
            } else {
                resetNotifications();
                navigate(afterLoginUrl);
                return Promise.resolve();
            }
        },
        [
            authProvider,
            queryClient,
            navigate,
            nextPathName,
            nextSearch,
            resetNotifications,
            afterLoginUrl,
        ]
    );

    return login;
};

/**
 * Log a user in by calling the authProvider.login() method
 *
 * @param {Object} params Login parameters to pass to the authProvider. May contain username/email, password, etc
 * @param {string} pathName The path to redirect to after login. By default, redirects to the home page, or to the last page visited after disconnection.
 *
 * @return {Promise} The authProvider response
 */
type Login = (params: any, pathName?: string) => Promise<any>;

export default useLogin;
