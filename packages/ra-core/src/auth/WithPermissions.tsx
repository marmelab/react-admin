import { Children, Component, ReactNode, ComponentType } from 'react';
import { connect } from 'react-redux';
import { Location } from 'history';
import { match as Match } from 'react-router';

import { AUTH_GET_PERMISSIONS, UserCheck } from './types';
import AuthContext from './AuthContext';
import { userCheck as userCheckAction } from '../actions/authActions';
import { isLoggedIn as getIsLoggedIn } from '../reducer';
import warning from '../util/warning';

export interface WithPermissionsChildrenParams {
    authParams?: object;
    location?: Location;
    match: Match;
    permissions: any;
}

type WithPermissionsChildren = (
    params: WithPermissionsChildrenParams
) => ReactNode;

interface Props {
    authParams?: object;
    children?: WithPermissionsChildren;
    location: Location;
    match: Match;
    render?: WithPermissionsChildren;
    staticContext?: object;
}

interface EnhancedProps {
    isLoggedIn: boolean;
    userCheck: UserCheck;
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
 *             <WithPermissions
 *                  location={routeParams.location}
 *                  authParams={{ foo: 'bar' }}
 *                  render={props => <Foo {...props} />}
 *              />
 *         } />
 *     ];
 *     const App = () => (
 *         <Admin customRoutes={customRoutes}>
 *             ...
 *         </Admin>
 *     );
 */
export class WithPermissions extends Component<Props & EnhancedProps> {
    static contextType = AuthContext;
    cancelled = false;

    state = { permissions: null };

    componentWillMount() {
        warning(
            this.props.render &&
                this.props.children &&
                !isEmptyChildren(this.props.children),
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

    checkAuthentication(params: Props & EnhancedProps) {
        const { userCheck, authParams, location } = params;
        userCheck(authParams, location && location.pathname);
    }

    async checkPermissions(params: Props & EnhancedProps) {
        const authProvider = this.context;
        const { authParams, location, match } = params;
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
        const authProvider = this.context;
        const {
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
    isLoggedIn: getIsLoggedIn(state),
});

const EnhancedWithPermissions = connect(
    mapStateToProps,
    { userCheck: userCheckAction }
)(WithPermissions);

export default EnhancedWithPermissions as ComponentType<Props>;
