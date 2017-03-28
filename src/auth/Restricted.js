import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { replace as replaceAction } from 'react-router-redux';
import { AUTH_CHECK } from './';

/**
 * Restrict access to children
 *
 * Expects an authClient prop, which will be called with AUTH_CHECK upon mount and update
 *
 * Useful for Route components - used in CrudRoute
 *
 * @example
 * <Route path="/foo" render={routeParams =>
 *   <Restricted authClient={authClient} location={routeParams.location}>
 *     <Foo />
 *   </Restricted>
 * } />
 */
class Restricted extends Component {
    static propTypes = {
        authClient: PropTypes.func,
        authParams: PropTypes.object,
        location: PropTypes.object,
        replace: PropTypes.func,
    }

    componentWillMount() {
        this.checkAuthentication(this.props);
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.location !== this.props.location) {
            this.checkAuthentication(nextProps);
        }
    }

    checkAuthentication(params) {
        const { authClient, authParams, location, replace } = params;
        authClient(AUTH_CHECK, authParams)
            .catch(e => replace({
                pathname: (e && e.redirectTo) || '/login',
                state: { nextPathname: location.pathname },
            }));
    }

    // render the child even though the AUTH_CHECK isn't finished (optimistic rendering)
    render() {
        const { children, ...rest } = this.props;
        return React.cloneElement(children, rest);
    }
}

export default connect(null, {
    replace: replaceAction,
})(Restricted);
