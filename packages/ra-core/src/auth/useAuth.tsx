import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { ReduxState } from '../types';
import { userCheck } from '../actions/authActions';

/**
 * Hook for restricting access to authenticated users
 *
 * Useful for Route components ; used internally by Resource.
 * To be called in custom page components to require authentication.
 *
 * You can set additional `authParams` at will if your authProvider
 * requires it.
 *
 * @example
 *     import { useAuth } from 'react-admin';
 *
 *     const CustomRoutes = [
 *         <Route path="/foo" render={routeParams => {
 *              useAuth({ myContext: 'foo' });
 *              return <Foo />;
 *          }} />
 *     ];
 *     const App = () => (
 *         <Admin customRoutes={customRoutes}>
 *             ...
 *         </Admin>
 *     );
 */
const useAuth = authParams => {
    const location = useSelector((state: ReduxState) => state.router.location);
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(userCheck(authParams, location && location.pathname));
    }, [authParams, dispatch, location]);
};

export default useAuth;
