import React, { createElement, Children, cloneElement, Component } from 'react';
import PropTypes from 'prop-types';
import getContext from 'recompose/getContext';

import { AUTH_CHECK } from './types';
import resolvePermissions from './resolvePermissions';

/**
 * Render different components depending on permissions.
 * 
 * Each child of the <SwitchPermission> component 
 * must be a <Permission> component.
 * 
 * If multiple `Permission` match, only the first one will be displayed.
 * 
 * @see Permission
 * 
 * @example
 *     import { SwitchPermission, Permission } from 'react-admin';
 * 
 *     const Dashboard = () => (
 *         <Card>
 *             <ViewTitle title="Dashboard" />
 *             <CardContent>
 *                 <SwitchPermissions>
 *                     <Permission value="associate">
 *                         <BenefitsSummary />
 *                     </Permission>
 *                     <Permission value="boss">
 *                         <BenefitsDetailsWithSensitiveData />
 *                     </Permission>
 *                 </SwitchPermissions>
 *             </CardContent>
 *         </Card>
 *     );
 */
export class SwitchPermissions extends Component {
    static propTypes = {
        authClient: PropTypes.func,
        children: PropTypes.node.isRequired,
        notFound: PropTypes.func,
        loading: PropTypes.func,
        record: PropTypes.object,
        resource: PropTypes.string,
    };

    static defaultProps = {
        notFound: null,
        loading: null,
    };

    state = {
        isNotFound: false,
        match: undefined,
        role: undefined,
    };

    async componentWillMount() {
        const { authClient, children, record, resource } = this.props;
        const mappings =
            React.Children.map(
                children,
                ({ props: { value, resolve, children, exact } }) => ({
                    permissions: value,
                    resolve,
                    view: children,
                    exact,
                })
            ) || [];

        const permissions = await authClient(AUTH_CHECK, {
            record,
            resource,
        });
        const match = await resolvePermissions({
            mappings,
            permissions,
            record,
            resource,
        });

        if (match) {
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

        if (Array.isArray(match)) {
            return (
                <div>
                    {Children.map(match, child => cloneElement(child, props))}
                </div>
            );
        }

        return cloneElement(children, props);
    }
}

export default getContext({
    authClient: PropTypes.func,
})(SwitchPermissions);
