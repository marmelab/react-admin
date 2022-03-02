import { useEffect } from 'react';

import { useCheckAuth } from './useCheckAuth';
import { useSafeSetState } from '../util/hooks';

interface State {
    isLoading: boolean;
    authenticated?: boolean;
}

const emptyParams = {};

/**
 * Hook for getting the authentication status
 *
 * Calls the authProvider.checkAuth() method asynchronously.
 *
 * The return value updates according to the authProvider request state:
 *
 * - isLoading: true just after mount, while the authProvider is being called. false once the authProvider has answered.
 * - authenticated: true while loading. then true or false depending on the authProvider response.
 *
 * To avoid rendering a component and force waiting for the authProvider response, use the useAuthState() hook
 * instead of the useAuthenticated() hook.
 *
 * You can render different content depending on the authenticated status.
 *
 * @see useAuthenticated()
 *
 * @param {Object} params Any params you want to pass to the authProvider
 *
 * @returns The current auth check state. Destructure as { authenticated, error, loading, loaded }.
 *
 * @example
 * import { useAuthState, Loading } from 'react-admin';
 *
 * const MyPage = () => {
 *     const { isLoading, authenticated } = useAuthState();
 *     if (isLoading) {
 *         return <Loading />;
 *     }
 *     if (authenticated) {
 *        return <AuthenticatedContent />;
 *     }
 *     return <AnonymousContent />;
 * };
 */
const useAuthState = (params: any = emptyParams): State => {
    const [state, setState] = useSafeSetState({
        isLoading: true,
        authenticated: true, // optimistic
    });
    const checkAuth = useCheckAuth();
    useEffect(() => {
        checkAuth(params, false)
            .then(() => setState({ isLoading: false, authenticated: true }))
            .catch(() => setState({ isLoading: false, authenticated: false }));
    }, [checkAuth, params, setState]);
    return state;
};

export default useAuthState;
