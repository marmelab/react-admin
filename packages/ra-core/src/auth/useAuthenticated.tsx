import { useEffect } from 'react';
import useCheckAuth from './useCheckAuth';

const emptyParams = {};

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
export default (params: any = emptyParams) => {
    const checkAuth = useCheckAuth();
    useEffect(() => {
        checkAuth(params).catch(() => {});
    }, [checkAuth, params]);
};
