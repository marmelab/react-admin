import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { push } from 'connected-react-router';

import useAuthProvider, { defaultAuthParams } from './useAuthProvider';
import { AUTH_LOGIN } from './types';
import { ReduxState } from '../types';

/**
 * Get a callback for calling the authProvider with the AUTH_LOGIN verb
 * and redirect to the previous authenticated page (or the home page) on success.
 *
 * @see useAuthProvider
 * @param {Object} authParams Any params you want to pass to the authProvider
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
const useLogin = (authParams: any = defaultAuthParams): Login => {
    const authProvider = useAuthProvider();
    const currentLocation = useSelector(
        (state: ReduxState) => state.router.location
    );
    const nextPathName =
        currentLocation.state && currentLocation.state.nextPathname;
    const dispatch = useDispatch();

    const login = useCallback(
        (params, pathName = authParams.afterLoginUrl) =>
            authProvider(AUTH_LOGIN, { ...params, ...authParams }).then(ret => {
                dispatch(push(nextPathName || pathName));
                return ret;
            }),
        [authParams, authProvider, dispatch, nextPathName]
    );

    const loginWithoutProvider = useCallback(
        (_, __) => {
            dispatch(push(authParams.afterLoginUrl));
            return Promise.resolve();
        },
        [authParams.afterLoginUrl, dispatch]
    );

    return authProvider ? login : loginWithoutProvider;
};

/**
 * Log a user in by calling the authProvider AUTH_LOGIN verb
 *
 * @param {object} params Login parameters to pass to the authProvider. May contain username/email, password, etc
 * @param {string} pathName The path to redirect to after login. By default, redirects to the home page, or to the last page visited after deconnexion.
 *
 * @return {Promise} The authProvider response
 */
type Login = (params: any, pathName?: string) => Promise<any>;

export default useLogin;
