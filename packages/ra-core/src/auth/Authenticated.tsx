import * as React from 'react';
import { ReactNode } from 'react';

import { useAuthState } from './useAuthState';

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
 * @see useAuthState
 *
 * @example
 *     import { Authenticated } from 'react-admin';
 *
 *     const CustomRoutes = [
 *         <Route path="/foo" element={
 *             <Authenticated authParams={{ foo: 'bar' }}>
 *                 <Foo />
 *             </Authenticated>
 *         } />
 *     ];
 *     const App = () => (
 *         <Admin>
 *             {CustomRoutes}
 *         </Admin>
 *     );
 */
export const Authenticated = (props: AuthenticatedProps) => {
    const { authParams, children, pessimistic = false } = props;

    // this hook will log out if the authProvider doesn't validate that the user is authenticated
    const { isLoading, authenticated } = useAuthState(authParams, true);

    // to prevent flash of UI, we don't render the children
    // in pessimistic mode until the authProvider has validated the user
    if (!authenticated || (pessimistic && isLoading)) {
        return null;
    }

    // render the children when authenticated or when in optimistic mode (default)
    return <>{children}</>;
};

export interface AuthenticatedProps {
    children: ReactNode;
    authParams?: object;
    pessimistic?: boolean;
}
