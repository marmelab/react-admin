import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import getContext from 'recompose/getContext';

import { userCheck } from '../actions/authActions';
import { AUTH_GET_PERMISSIONS } from '../auth/types';

/**
 * Retrieve permissions for a specific route.
 *
 * Useful for Route components ; used internally by CrudRoute.
 * Use it to decorate your custom page components to require 
 * a custom role. It will pass the permissions as a prop to your
 * component.
 * 
 * Pass the `location` from the `routeParams` as `location` prop.
 * You can set additional `authParams` at will if your authClient
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
 *         <Route path="/foo" render={routeParams =>
 *             <WithPermissions location={routeParams.location} authParams={{ foo: 'bar' }}>
 *                 <Foo />
 *             </WithPermissions>
 *         } />
 *     ];
 *     const App = () => (
 *         <Admin customRoutes={customRoutes}>
 *             ...
 *         </Admin>
 *     );
 */
export class WithPermissions extends Component {
    static propTypes = {
        authParams: PropTypes.object,
        children: PropTypes.element.isRequired,
        location: PropTypes.object,
        userCheck: PropTypes.func,
    };

    state = { permissions: null };

    componentWillMount() {
        this.checkAuthentication(this.props);
    }

    async componentDidMount() {
        await this.checkPermissions(this.props);
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.location !== this.props.location) {
            this.checkAuthentication(nextProps);
            this.checkPermissions(this.props);
        }
    }

    checkAuthentication(params) {
        const { userCheck, authParams, location } = params;
        userCheck(authParams, location && location.pathname);
    }

    async checkPermissions(params) {
        const { authClient, authParams, location, match } = params;
        try {
            const permissions = await authClient(AUTH_GET_PERMISSIONS, {
                ...authParams,
                routeParams: match ? match.params : undefined,
                location: location ? location.pathname : undefined,
            });

            this.setState({ permissions });
        } catch (error) {
            this.setState({ permissions: null });
        }
    }

    // render the child even though the AUTH_GET_PERMISSIONS isn't finished (optimistic rendering)
    render() {
        const {
            children,
            userCheck,
            authParams,
            location,
            ...rest
        } = this.props;
        const { permissions } = this.state;
        return React.cloneElement(children, { ...rest, permissions });
    }
}

export default compose(
    getContext({
        authClient: PropTypes.func,
    }),
    connect(null, { userCheck })
)(WithPermissions);
