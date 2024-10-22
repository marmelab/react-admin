import * as React from 'react';
import { ReactNode } from 'react';

import { useAuthenticated } from './useAuthenticated';

/**
 * Restrict access to children to authenticated users.
 * Redirects anonymous users to the login page.
 *
 * Use it to decorate your custom page components to require
 * authentication.
 *
 * @see useAuthState
 *
 * @example
 * import { Admin, CustomRoutes, Authenticated } from 'react-admin';
 *
 * const customRoutes = [
 *     <Route
 *         path="/foo"
 *         element={
 *             <Authenticated authParams={{ foo: 'bar' }}>
 *                 <Foo />
 *             </Authenticated>
 *         }
 *     />
 * ];
 * const App = () => (
 *     <Admin>
 *         <CustomRoutes>{customRoutes}</CustomRoutes>
 *     </Admin>
 * );
 */
export const Authenticated = (props: AuthenticatedProps) => {
    const { authParams, loading = null, children } = props;

    // this hook will redirect to login if the user is not authenticated
    const { isPending } = useAuthenticated({ params: authParams });

    if (isPending) {
        return loading;
    }

    return <>{children}</>;
};

export interface AuthenticatedProps {
    children: ReactNode;
    authParams?: object;
    loading?: ReactNode;
    /**
     * @deprecated Authenticated now never renders children when not authenticated.
     */
    requireAuth?: boolean;
}
