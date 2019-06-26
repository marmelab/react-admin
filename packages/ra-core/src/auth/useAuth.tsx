import { useEffect, useContext } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { push, replace } from 'connected-react-router';

import AuthContext from './AuthContext';
import { AUTH_CHECK, AUTH_LOGOUT } from './types';
import { useSafeSetState } from '../util/hooks';
import { showNotification } from '../actions/notificationActions';
import { ReduxState } from '../types';

const getErrorMessage = (error, defaultMessage) =>
    typeof error === 'string'
        ? error
        : typeof error === 'undefined' || !error.message
        ? defaultMessage
        : error.message;

interface State {
    loading: boolean;
    loaded: boolean;
    authenticated: boolean;
    error?: any;
}

const emptyParams = {};

/**
 * Hook for restricting access to authenticated users
 *
 * Calls the authProvider asynchronously with the AUTH_CHECK verb.
 * If the authProvider returns a rejected promise, logs the user out.
 *
 * The return value updates according to the request state:
 *
 * - start: { authenticated: false, loading: true, loaded: false }
 * - success: { authenticated: true, loading: false, loaded: true }
 * - error: { error: [error from provider], authenticated: false, loading: false, loaded: true }
 *
 * Useful in custom page components that require authentication.
 *
 * @param {Object} authParams Any params you want to pass to the authProvider
 * @param {boolean} logoutOnFailure Whether the user should be logged out if the authProvider fails to authenticatde them. True by default.
 *
 * @returns The current auth check state. Destructure as { authenticated, error, loading, loaded }.
 *
 * @example
 *     import { useAuth } from 'react-admin';
 *
 *     const CustomRoutes = [
 *         <Route path="/foo" render={() => {
 *              useAuth();
 *              return <Foo />;
 *          }} />,
 *         <Route path="/bar" render={() => {
 *              const { authenticated } = useAuth({ myContext: 'foobar' }, false);
 *              return authenticated ? <Bar /> : <BarNotAuthenticated />;
 *          }} />,
 *     ];
 *     const App = () => (
 *         <Admin customRoutes={customRoutes}>
 *             ...
 *         </Admin>
 *     );
 */
const useAuth = (authParams = emptyParams, logoutOnFailure = true) => {
    const [state, setState] = useSafeSetState<State>({
        loading: true,
        loaded: false,
        authenticated: false,
    });
    const location = useSelector((state: ReduxState) => state.router.location);
    const nextPathname = location && location.pathname;
    const authProvider = useContext(AuthContext);
    const dispatch = useDispatch();
    useEffect(() => {
        if (!authProvider) {
            setState({ loading: false, loaded: true, authenticated: true });
            return;
        }
        authProvider(AUTH_CHECK, authParams)
            .then(() => {
                setState({ loading: false, loaded: true, authenticated: true });
            })
            .catch(error => {
                setState({
                    loading: false,
                    loaded: true,
                    authenticated: false,
                    error,
                });
                if (logoutOnFailure) {
                    authProvider(AUTH_LOGOUT);
                    dispatch(
                        replace({
                            pathname: (error && error.redirectTo) || '/login',
                            state: { nextPathname },
                        })
                    );
                }
                const errorMessage = getErrorMessage(
                    error,
                    'ra.auth.auth_check_error'
                );
                dispatch(showNotification(errorMessage, 'warning'));
            });
    }, [authParams, authProvider, dispatch, nextPathname, logoutOnFailure]); // eslint-disable-line react-hooks/exhaustive-deps
    return state;
};

export default useAuth;
