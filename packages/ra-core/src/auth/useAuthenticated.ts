import { useEffect } from 'react';
import { useCheckAuth } from './useCheckAuth';

/**
 * Restrict access to authenticated users.
 * Redirect anonymous users to the login page.
 *
 * Use it in your custom page components to require
 * authentication.
 *
 * You can set additional `authParams` at will if your authProvider
 * requires it.
 *
 * @example
 *     import { useAuthenticated } from 'react-admin';
 *     const FooPage = () => {
 *         useAuthenticated();
 *         return <Foo />;
 *     }
 *     const CustomRoutes = [
 *         <Route path="/foo" render={() => <FooPage />} />
 *     ];
 *     const App = () => (
 *         <Admin customRoutes={customRoutes}>
 *             ...
 *         </Admin>
 *     );
 */
export const useAuthenticated = <ParamsType = any>(
    options: UseAuthenticatedOptions<ParamsType> = {}
) => {
    const { enabled = true, params = emptyParams } = options;
    const checkAuth = useCheckAuth();
    useEffect(() => {
        if (enabled) {
            checkAuth(params).catch(() => {});
        }
    }, [checkAuth, enabled, params]);
};

export type UseAuthenticatedOptions<ParamsType> = {
    enabled?: boolean;
    params?: ParamsType;
};

const emptyParams = {};
