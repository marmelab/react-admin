import { UseQueryOptions } from '@tanstack/react-query';
import useAuthState from './useAuthState';

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
 * import { Admin, CustomRoutes, useAuthenticated } from 'react-admin';
 *
 * const FooPage = () => {
 *     const { isPending } = useAuthenticated();
 *     if (isPending) return null;
 *     return <Foo />;
 * }
 *
 * const customRoutes = [
 *     <Route path="/foo" element={<FooPage />} />
 * ];
 *
 * const App = () => (
 *     <Admin>
 *         <CustomRoutes>{customRoutes}</CustomRoutes>
 *     </Admin>
 * );
 */
export const useAuthenticated = <ParamsType = any>({
    params,
    logoutOnFailure = true,
    ...options
}: UseAuthenticatedOptions<ParamsType> = {}) => {
    return useAuthState(params ?? emptyParams, logoutOnFailure, options);
};

export type UseAuthenticatedOptions<ParamsType> = Omit<
    UseQueryOptions<boolean, any> & {
        params?: ParamsType;
    },
    'queryKey' | 'queryFn'
> & {
    logoutOnFailure?: boolean;
};

const emptyParams = {};
