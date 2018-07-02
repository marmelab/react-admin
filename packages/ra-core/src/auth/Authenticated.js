import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { userCheck } from '../actions/authActions';

/**
 * Restrict access to children to authenticated users
 *
 * Useful for Route components ; used internally by Resource.
 * Use it to decorate your custom page components to require
 * authentication.
 *
 * Pass the `location` from the `routeParams` as `location` prop.
 * You can set additional `authParams` at will if your authProvider
 * requires it.
 *
 * @example
 *     import { Authenticated } from 'react-admin';
 *
 *     const CustomRoutes = [
 *         <Route path="/foo" render={routeParams =>
 *             <Authenticated location={routeParams.location} authParams={{ foo: 'bar' }}>
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
export class Authenticated extends Component {
    static propTypes = {
        authParams: PropTypes.object,
        children: PropTypes.element.isRequired,
        location: PropTypes.object,
        userCheck: PropTypes.func,
    };

    componentWillMount() {
        this.checkAuthentication(this.props);
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.location !== this.props.location) {
            this.checkAuthentication(nextProps);
        }
    }

    checkAuthentication(params) {
        const { userCheck, authParams, location } = params;
        userCheck(authParams, location && location.pathname);
    }

    // render the child even though the AUTH_CHECK isn't finished (optimistic rendering)
    render() {
        const {
            children,
            userCheck,
            authParams,
            location,
            ...rest
        } = this.props;
        return React.cloneElement(children, rest);
    }
}

export default connect(
    null,
    { userCheck }
)(Authenticated);
