import { cloneElement, ReactElement, FunctionComponent } from 'react';

import useAuth from './useAuth';

interface Props {
    children: ReactElement<any>;
    authParams?: object;
    location?: object; // kept for backwards compatibility, unused
}

/**
 * Restrict access to children to authenticated users
 *
 * Useful for Route components ; used internally by Resource.
 * Use it to decorate your custom page components to require
 * authentication.
 *
 * You can set additional `authParams` at will if your authProvider
 * requires it.
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
const Authenticated: FunctionComponent<Props> = ({
    authParams,
    children,
    location, // kept for backwards compatibility, unused
    ...rest
}) => {
    useAuth(authParams);
    // render the child even though the AUTH_CHECK isn't finished (optimistic rendering)
    // the above hook will log out if the authProvider doesn't validate that the user is authenticated
    return cloneElement(children, rest);
};

export default Authenticated;
