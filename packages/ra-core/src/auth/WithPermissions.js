import { Children, Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import getContext from 'recompose/getContext';
import warning from 'warning';

import { userCheck } from '../actions/authActions';
import { AUTH_GET_PERMISSIONS } from '../auth/types';
import { isLoggedIn } from '../reducer';

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
 * Pass the `location` from the `routeParams` as `location` prop.
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
        authProvider: PropTypes.func,
        authParams: PropTypes.object,
        children: PropTypes.func,
        location: PropTypes.object,
        match: PropTypes.object,
        render: PropTypes.func,
        isLoggedIn: PropTypes.bool,
        staticContext: PropTypes.object,
        userCheck: PropTypes.func,
    };

    cancelled = false;

    state = { permissions: null };

    componentWillMount() {
        warning(
            !(
                this.props.render &&
                this.props.children &&
                !isEmptyChildren(this.props.children)
            ),
            'You should not use both <WithPermissions render> and <WithPermissions children>; <WithPermissions children> will be ignored'
        );
        this.checkAuthentication(this.props);
    }

    async componentDidMount() {
        await this.checkPermissions(this.props);
    }

    componentWillUnmount() {
        this.cancelled = true;
    }

    componentWillReceiveProps(nextProps) {
        if (
            nextProps.location !== this.props.location ||
            nextProps.authParams !== this.props.authParams ||
            nextProps.isLoggedIn !== this.props.isLoggedIn
        ) {
            this.checkAuthentication(nextProps);
            this.checkPermissions(this.props);
        }
    }

    checkAuthentication(params) {
        const { userCheck, authParams, location } = params;
        userCheck(authParams, location && location.pathname);
    }

    async checkPermissions(params) {
        const { authProvider, authParams, location, match } = params;
        try {
            const permissions = await authProvider(AUTH_GET_PERMISSIONS, {
                ...authParams,
                routeParams: match ? match.params : undefined,
                location: location ? location.pathname : undefined,
            });

            if (!this.cancelled) {
                this.setState({ permissions });
            }
        } catch (error) {
            if (!this.cancelled) {
                this.setState({ permissions: null });
            }
        }
    }

    // render even though the AUTH_GET_PERMISSIONS
    // isn't finished (optimistic rendering)
    render() {
        const {
            authProvider,
            userCheck,
            isLoggedIn,
            render,
            children,
            staticContext,
            ...props
        } = this.props;
        const { permissions } = this.state;

        if (render) {
            return render({ permissions, ...props });
        }

        if (children) {
            return children({ permissions, ...props });
        }
    }
}
const mapStateToProps = state => ({
    isLoggedIn: isLoggedIn(state),
});

export default compose(
    getContext({
        authProvider: PropTypes.func,
    }),
    connect(mapStateToProps, { userCheck })
)(WithPermissions);
