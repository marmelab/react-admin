import { useEffect } from 'react';
import useCheckAuth from './useCheckAuth';

/**
 * Restrict access to children to authenticated users.
 * Redirects anonymous users to the login page.
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
export default authParams => {
    const checkAuth = useCheckAuth(authParams);
    useEffect(() => {
        checkAuth().catch(() => {});
    }, [checkAuth]);
};
