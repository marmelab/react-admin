import { useCallback } from 'react';

import useAuthProvider, { defaultAuthParams } from './useAuthProvider';
import { useLocation, useHistory } from 'react-router-dom';

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
    const location = useLocation();
    const locationState = location.state as any;
    const history = useHistory();
    const nextPathName = locationState && locationState.nextPathname;

    const login = useCallback(
        (params: any = {}, pathName = defaultAuthParams.afterLoginUrl) =>
            authProvider.login(params).then(ret => {
                history.push(nextPathName || pathName);
                return ret;
            }),
        [authProvider, history, nextPathName]
    );

    const loginWithoutProvider = useCallback(
        (_, __) => {
            history.push(defaultAuthParams.afterLoginUrl);
            return Promise.resolve();
        },
        [history]
    );

    return authProvider ? login : loginWithoutProvider;
};

/**
 * Log a user in by calling the authProvider.login() method
 *
 * @param {object} params Login parameters to pass to the authProvider. May contain username/email, password, etc
 * @param {string} pathName The path to redirect to after login. By default, redirects to the home page, or to the last page visited after deconnexion.
 *
 * @return {Promise} The authProvider response
 */
type Login = (params: any, pathName?: string) => Promise<any>;

export default useLogin;
