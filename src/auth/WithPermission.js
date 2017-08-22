import React, { createElement, Component } from 'react';
import PropTypes from 'prop-types';
import FormField from '../mui/form/FormField';
import getContext from 'recompose/getContext';

import DefaultLoading from './Loading';
import { AUTH_GET_PERMISSIONS } from './types';
import { resolvePermission } from './resolvePermissions';

export class WithPermissionComponent extends Component {
    static propTypes = {
        authClient: PropTypes.func,
        authClientFromContext: PropTypes.func,
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
        loading: DefaultLoading,
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

    renderSourceChild = (child, props) =>
        <div
            key={child.props.source}
            style={child.props.style}
            className={`aor-input-${child.props.source}`}
        >
            <FormField input={child} {...props} />
        </div>;

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

        if (!match) {
            return createElement(loading);
        }

        if (Array.isArray(children)) {
            return (
                <div>
                    {React.Children.map(
                        children,
                        child =>
                            child.props.source
                                ? this.renderSourceChild(child, props)
                                : <FormField input={child} {...props} />
                    )}
                </div>
            );
        }

        return children.props.source
            ? this.renderSourceChild(children, props)
            : <FormField input={children} {...props} />;
    }
}

export default getContext({
    authClient: PropTypes.func,
})(WithPermissionComponent);
