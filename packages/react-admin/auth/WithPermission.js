import React, { createElement, cloneElement, Children, Component } from 'react';
import PropTypes from 'prop-types';
import getContext from 'recompose/getContext';

import { AUTH_GET_PERMISSIONS } from './types';
import { resolvePermission } from './resolvePermissions';

export class WithPermissionComponent extends Component {
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
        const permissions = await authClient(AUTH_GET_PERMISSIONS, {
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
})(WithPermissionComponent);
