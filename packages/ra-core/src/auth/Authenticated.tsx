import { ReactElement } from 'react';

import { useAuthenticated } from './useAuthenticated';

/**
 * Restrict access to children to authenticated users.
 * Redirects anonymous users to the login page.
 *
 * Use it to decorate your custom page components to require
 * authentication.
 *
 * You can set additional `authParams` at will if your authProvider
 * requires it.
 *
 * @see useAuthenticated
 *
 * @example
 *     import { Authenticated } from 'react-admin';
 *
 *     const CustomRoutes = [
 *         <Route path="/foo" render={() =>
 *             <Authenticated authParams={{ foo: 'bar' }}>
 *                 <Foo />
 *             </Authenticated>
 *         } />
 *     ];
 *     const App = () => (
 *         <Admin customRoutes={customRoutes}>
 *             ...
 *         </Admin>
 *     );
 */
export const Authenticated = (props: AuthenticatedProps) => {
    const { authParams, children } = props;
    useAuthenticated({ params: authParams });
    // render the child even though the useAuthenticated() call isn't finished (optimistic rendering)
    // the above hook will log out if the authProvider doesn't validate that the user is authenticated
    return children;
};

export interface AuthenticatedProps {
    children: ReactElement<any>;
    authParams?: object;
}
