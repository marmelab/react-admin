import {
    Children,
    FunctionComponent,
    ReactElement,
    ComponentType,
} from 'react';
import { Location } from 'history';

import warning from '../util/warning';
import useAuth from './useAuth';
import usePermissions from './usePermissions';

export interface WithPermissionsChildrenParams {
    permissions: any;
}

type WithPermissionsChildren = (
    params: WithPermissionsChildrenParams
) => ReactElement;

interface Props {
    authParams?: object;
    children?: WithPermissionsChildren;
    location?: Location;
    render?: WithPermissionsChildren;
    staticContext?: object;
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
 *     import { WithPermissions } from 'react-admin';
 *
 *     const Foo = ({ permissions }) => (
 *         {permissions === 'admin' ? <p>Sensitive data</p> : null}
 *         <p>Not sensitive data</p>
 *     );
 *
 *     const customRoutes = [
 *         <Route path="/foo" render={() =>
 *             <WithPermissions
 *                  authParams={{ foo: 'bar' }}
 *                  render={({ permissions, ...props }) => <Foo permissions={permissions} {...props} />}
 *              />
 *         } />
 *     ];
 *     const App = () => (
 *         <Admin customRoutes={customRoutes}>
 *             ...
 *         </Admin>
 *     );
 */
const WithPermissions: FunctionComponent<Props> = ({
    authParams,
    children,
    render,
    staticContext,
    ...props
}) => {
    warning(
        render && children && !isEmptyChildren(children),
        'You should not use both <WithPermissions render> and <WithPermissions children>; <WithPermissions children> will be ignored'
    );

    useAuth(authParams);
    const { permissions } = usePermissions(authParams);
    // render even though the AUTH_GET_PERMISSIONS
    // isn't finished (optimistic rendering)
    if (render) {
        return render({ permissions, ...props });
    }

    if (children) {
        return children({ permissions, ...props });
    }
};

export default WithPermissions as ComponentType<Props>;
