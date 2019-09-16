import { useEffect } from 'react';

import useCheckAuth from './useCheckAuth';
import { useSafeSetState } from '../util/hooks';

interface State {
    loading: boolean;
    loaded: boolean;
    authenticated?: boolean;
}

const emptyParams = {};

/**
 * Hook for getting the authentication status and restricting access to authenticated users
 *
 * Calls the authProvider.checkAuth() method asynchronously.
 * If the authProvider returns a rejected promise, logs the user out.
 *
 * The return value updates according to the authProvider request state:
 *
 * - start:   { authenticated: false, loading: true, loaded: false }
 * - success: { authenticated: true,  loading: false, loaded: true }
 * - error:   { authenticated: false, loading: false, loaded: true }
 *
 * Useful in custom page components that can work both for connected and
 * anonymous users. For pages that can only work for connected users,
 * prefer the useAuthenticated() hook.
 *
 * @see useAuthenticated()
 *
 * @param {Object} params Any params you want to pass to the authProvider
 *
 * @returns The current auth check state. Destructure as { authenticated, error, loading, loaded }.
 *
 * @example
 *     import { useAuthState } from 'react-admin';
 *
 *     const CustomRoutes = [
 *         <Route path="/bar" render={() => {
 *              const { authenticated } = useAuthState({ myContext: 'foobar' });
 *              return authenticated ? <Bar /> : <BarNotAuthenticated />;
 *          }} />,
 *     ];
 *     const App = () => (
 *         <Admin customRoutes={customRoutes}>
 *             ...
 *         </Admin>
 *     );
 */
const useAuthState = (params: any = emptyParams): State => {
    const [state, setState] = useSafeSetState({
        loading: true,
        loaded: false,
        authenticated: true, // optimistic
    });
    const checkAuth = useCheckAuth();
    useEffect(() => {
        checkAuth(params, false)
            .then(() =>
                setState({ loading: false, loaded: true, authenticated: true })
            )
            .catch(() =>
                setState({ loading: false, loaded: true, authenticated: false })
            );
    }, [checkAuth, params, setState]);
    return state;
};

export default useAuthState;
