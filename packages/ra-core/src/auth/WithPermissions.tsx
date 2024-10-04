import * as React from 'react';
import { Children, ReactElement, ComponentType, createElement } from 'react';
import { Location } from 'react-router-dom';

import warning from '../util/warning';
import { useAuthenticated } from './useAuthenticated';
import usePermissions from './usePermissions';

export interface WithPermissionsChildrenParams {
    permissions: any;
}

type WithPermissionsChildren = (
    params: WithPermissionsChildrenParams
) => ReactElement;

export interface WithPermissionsProps {
    authParams?: object;
    children?: WithPermissionsChildren;
    component?: ComponentType<any>;
    loading?: ComponentType<any>;
    location?: Location;
    render?: WithPermissionsChildren;
    staticContext?: object;
    [key: string]: any;
}

const isEmptyChildren = children => Children.count(children) === 0;

/**
 * After checking that the user is authenticated,
 * retrieves the user's permissions for a specific context.
 *
 * Useful for Route components ; used internally by Resource.
 * Use it to decorate your custom page components to require
 * a custom role. It will pass the permissions as a prop to your
 * component.
 *
 * You can set additional `authParams` at will if your authProvider
 * requires it.
 *
 * @example
 *     import { Admin, CustomRoutes, WithPermissions } from 'react-admin';
 *
 *     const Foo = ({ permissions }) => (
 *         {permissions === 'admin' ? <p>Sensitive data</p> : null}
 *         <p>Not sensitive data</p>
 *     );
 *
 *     const customRoutes = [
 *         <Route path="/foo" element={
 *             <WithPermissions
 *                  authParams={{ foo: 'bar' }}
 *                  component={({ permissions, ...props }) => <Foo permissions={permissions} {...props} />}
 *              />
 *         } />
 *     ];
 *     const App = () => (
 *         <Admin>
 *             <CustomRoutes>{customRoutes}</CustomRoutes>
 *         </Admin>
 *     );
 */
const WithPermissions = (props: WithPermissionsProps) => {
    const {
        authParams,
        children,
        render,
        component,
        loading: Loading = null,
        staticContext,
        ...rest
    } = props;
    warning(
        (render && children && !isEmptyChildren(children)) ||
            (render && component) ||
            (component && children && !isEmptyChildren(children)),
        'You should only use one of the `component`, `render` and `children` props in <WithPermissions>'
    );

    const { isPending: isAuthenticationPending } = useAuthenticated(authParams);
    const { permissions, isPending: isPendingPermissions } = usePermissions(
        authParams,
        {
            enabled: !isAuthenticationPending,
        }
    );
    // We must check both pending states here as if the authProvider does not implement getPermissions, isPendingPermissions will always be false
    if (isAuthenticationPending || isPendingPermissions) {
        return Loading ? <Loading /> : null;
    }

    if (component) {
        return createElement(component, { permissions, ...rest });
    }
    // @deprecated
    if (render) {
        return render({ permissions, ...rest });
    }
    // @deprecated
    if (children) {
        return children({ permissions, ...rest });
    }
};

export default WithPermissions as ComponentType<WithPermissionsProps>;
