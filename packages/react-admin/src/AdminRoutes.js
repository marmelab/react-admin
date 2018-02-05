import React, { Children, cloneElement, createElement } from 'react';
import PropTypes from 'prop-types';
import { Redirect, Route, Switch } from 'react-router-dom';

import WithPermissions from './auth/WithPermissions';

export class AdminRoutes extends Component {
    state = { childrenToRender: [] };

    componentWillMount() {
        this.initializeResources(this.props);
    }

    initializeResources = nextProps => {
        if (typeof nextProps.children === 'function') {
            this.initializeResourcesAsync(nextProps);
        } else {
            this.setState({ childrenToRender: nextProps.children });
        }
    };
    initializeResourcesAsync = async nextProps => {
        const { authProvider } = nextProps;
        try {
            const permissions = await authProvider(AUTH_GET_PERMISSIONS);
            const { children } = nextProps;

            const childrenFuncResult = children(permissions);
            if (childrenFuncResult.then) {
                childrenFuncResult.then(resolvedChildren => {
                    this.setState({
                        childrenToRender: resolvedChildren.filter(
                            child => child
                        ),
                    });
                });
            } else {
                this.setState({
                    childrenToRender: childrenFuncResult.filter(child => child),
                });
            }
        } catch (error) {
            this.setState({ childrenToRender: [] });
        }
    };
    componentWillReceiveProps(nextProps) {
        if (nextProps.isLoggedIn !== this.props.isLoggedIn) {
            this.setState(
                {
                    childrenToRender: [],
                },
                () => this.initializeResources(nextProps)
            );
        }
    }

    render() {
        const { customRoutes, dashboard, catchAll, title } = this.props;

        const { childrenToRender } = this.state;

        if (!childrenToRender || childrenToRender.length === 0) {
            return (
                <Route
                    key={index}
                    exact={route.props.exact}
                    path={route.props.path}
                    component={route.props.component}
                    render={route.props.render}
                    children={route.props.children} // eslint-disable-line react/no-children-prop
                />
            ))}
        {Children.map(children, child => (
            <Route
                key={child.props.name}
                path={`/${child.props.name}`}
                render={props =>
                    cloneElement(child, {
                        // The context prop instruct the Resource component to
                        // render itself as a standard component
                        context: 'route',
                        ...props,
                    })}
            />
        ))}
        {dashboard ? (
            <Route
                exact
                path="/"
                render={routeProps => (
                    <WithPermissions
                        authParams={{
                            route: 'dashboard',
                        }}
                        {...routeProps}
                        render={props => createElement(dashboard, props)}
                    />
                )}
            />
        ) : (
            children[0] && (
                <Route
                    exact
                    path="/"
                    render={() => (
                        <Redirect to={`/${children[0].props.name}`} />
                    )}
                />
            )
        )}
        <Route
            render={() =>
                createElement(catchAll, {
                    title,
                })}
        />
    </Switch>
);

const componentPropType = PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.string,
]);

AdminRoutes.propTypes = {
<<<<<<< HEAD
    authProvider: PropTypes.func,
    children: PropTypes.oneOfType([PropTypes.func, PropTypes.node]),
||||||| merged common ancestors
    authClient: PropTypes.func,
    children: PropTypes.oneOfType([PropTypes.func, PropTypes.node]),
=======
>>>>>>> [RFR] Refactor resources handling
    catchAll: componentPropType,
    children: PropTypes.oneOfType([PropTypes.func, PropTypes.node]),
    customRoutes: PropTypes.array,
    dashboard: componentPropType,
    title: PropTypes.string,
};

<<<<<<< HEAD
const mapStateToProps = state => ({
    isLoggedIn: isLoggedIn(state),
});

export default compose(
    getContext({
        authProvider: PropTypes.func,
    }),
    connect(mapStateToProps, {})
)(AdminRoutes);
||||||| merged common ancestors
const mapStateToProps = state => ({
    isLoggedIn: isLoggedIn(state),
});

export default compose(
    getContext({
        authClient: PropTypes.func,
    }),
    connect(mapStateToProps, {})
)(AdminRoutes);
=======
export default AdminRoutes;
>>>>>>> [RFR] Refactor resources handling
