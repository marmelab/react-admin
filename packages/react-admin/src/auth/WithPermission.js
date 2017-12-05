import React, { createElement, cloneElement, Children, Component } from 'react';
import PropTypes from 'prop-types';
import getContext from 'recompose/getContext';

import { AUTH_CHECK } from './types';
import { resolvePermission } from './resolvePermissions';

/**
 * Render children only if the user has the required permissions
 * 
 * Requires either:
 * - a `value` prop with the permissions to check (could be a role, an array of roles, etc), or
 * - a `resolve` function.
 *
 * An additional `exact` prop may be specified depending on your requirements.
 * It determines whether the user must have **all** the required permissions or only some.
 * If `false`, the default, we'll only check if the user has at least one of the required permissions.
 *
 * You may bypass the default logic by specifying a function as the `resolve` prop.
 * This function may return `true` or `false` directly or a promise resolving to either `true` or `false`.
 * It will be called with an object having the following properties:
 * - `permissions`: the result of the `authClient` call.
 * - `value`: the value of the `value` prop if specified
 * - `exact`: the value of the `exact` prop if specified
 *
 * An optional `loading` prop may be specified on the `WithPermission` component
 * to pass a component to display while checking for permissions. It defaults to `null`.
 * 
 * Tip: Do not use the `WithPermission` component inside the others react-admin components.
 * It is only meant to be used in custom pages or components.
 *
 * @example
 *     import { WithPermission } from 'react-admin';
 *
 *     const Menu = ({ onMenuTap }) => (
 *         <div>
 *             <MenuItemLink to="/posts" primaryText="Posts" onClick={onMenuTap} />
 *             <MenuItemLink to="/comments" primaryText="Comments" onClick={onMenuTap} />
 *             <WithPermission value="admin">
 *                 <MenuItemLink to="/custom-route" primaryText="Miscellaneous" onClick={onMenuTap} />
 *             </WithPermission>
 *         </div>
 *     );
 */
export class WithPermission extends Component {
    static propTypes = {
        authClient: PropTypes.func,
        children: PropTypes.node.isRequired,
        exact: PropTypes.bool,
        loading: PropTypes.func,
        notFound: PropTypes.func,
        record: PropTypes.object,
        resource: PropTypes.string,
        value: PropTypes.any,
        resolve: PropTypes.func,
    };

    static defaultProps = {
        loading: null,
    };

    state = {
        isNotFound: false,
        match: undefined,
        role: undefined,
    };

    async componentWillMount() {
        const {
            authClient,
            children,
            record,
            resolve,
            resource,
            value: requiredPermissions,
            exact,
        } = this.props;
        const permissions = await authClient(AUTH_CHECK, {
            record,
            resource,
        });
        const match = await resolvePermission({
            permissions,
            record,
            resource,
        })({
            exact,
            permissions: requiredPermissions,
            resolve,
            view: children,
        });

        if (match && match.matched) {
            this.setState({ match: match.view });
        } else {
            this.setState({ isNotFound: true, permissions });
        }
    }

    render() {
        const { isNotFound, match, role } = this.state;
        const {
            authClient,
            children,
            notFound,
            loading,
            resource,
            record,
            resolve,
            value,
            exact,
            ...props
        } = this.props;

        if (isNotFound) {
            if (notFound) {
                return createElement(notFound, { role });
            }

            return null;
        }

        if (!match && loading) {
            return createElement(loading);
        }

        if (Children.count(children) > 1) {
            return (
                <span>
                    {Children.map(children, child =>
                        cloneElement(child, props)
                    )}
                </span>
            );
        }

        return cloneElement(children, props);
    }
}

export default getContext({
    authClient: PropTypes.func,
})(WithPermission);
