import { UseQueryOptions } from 'react-query';
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
 *     import { Admin, CustomRoutes, useAuthenticated } from 'react-admin';
 *     const FooPage = () => {
 *         useAuthenticated();
 *         return <Foo />;
 *     }
 *     const customRoutes = [
 *         <Route path="/foo" element={<FooPage />} />
 *     ];
 *     const App = () => (
 *         <Admin>
 *             <CustomRoutes>{customRoutes}</CustomRoutes>
 *         </Admin>
 *     );
 */
export const useAuthenticated = <ParamsType = any>({
    params,
    ...options
}: UseAuthenticatedOptions<ParamsType> = {}) => {
    useAuthState(params ?? emptyParams, true, options);
};

export type UseAuthenticatedOptions<ParamsType> = UseQueryOptions<
    boolean,
    any
> & {
    params?: ParamsType;
};

const emptyParams = {};
