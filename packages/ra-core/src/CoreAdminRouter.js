import React, { Children, Component, cloneElement, createElement } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Route, Switch } from 'react-router-dom';
import compose from 'recompose/compose';
import getContext from 'recompose/getContext';

import { AUTH_GET_PERMISSIONS } from './auth/types';
import { isLoggedIn } from './reducer';
import { userLogout } from './actions/authActions';
import RoutesWithLayout from './RoutesWithLayout';

export class CoreAdminRouter extends Component {
    state = { children: [] };

    componentWillMount() {
        this.initializeResources(this.props);
    }

    initializeResources = nextProps => {
        if (typeof nextProps.children === 'function') {
            this.initializeResourcesAsync(nextProps);
        }
    };

    initializeResourcesAsync = async props => {
        const { authProvider } = props;
        try {
            const permissions = await authProvider(AUTH_GET_PERMISSIONS);
            const { children } = props;

            const childrenFuncResult = children(permissions);
            if (childrenFuncResult.then) {
                childrenFuncResult.then(resolvedChildren => {
                    this.setState({
                        children: resolvedChildren
                            .filter(child => child)
                            .map(child => ({
                                ...child,
                                props: {
                                    ...child.props,
                                    key: child.props.name,
                                },
                            })),
                    });
                });
            } else {
                this.setState({
                    children: childrenFuncResult.filter(child => child),
                });
            }
        } catch (error) {
            this.props.userLogout();
        }
    };

    componentWillReceiveProps(nextProps) {
        if (nextProps.isLoggedIn !== this.props.isLoggedIn) {
            this.setState(
                {
                    children: [],
                },
                () => this.initializeResources(nextProps)
            );
        }
    }

    renderCustomRoutesWithoutLayout = (route, props) => {
        if (route.props.render) {
            return route.props.render({
                ...props,
                title: this.props.title,
            });
        }
        if (route.props.component) {
            return createElement(route.props.component, {
                ...props,
                title: this.props.title,
            });
        }
    };

    render() {
        const {
            appLayout,
            catchAll,
            children,
            customRoutes,
            dashboard,
            loading,
            logout,
            menu,
            theme,
            title,
        } = this.props;
        const { children: childrenFromState } = this.state;

        let childrenToRender =
            typeof children === 'function' ? childrenFromState : children;

        if (!childrenToRender || childrenToRender.length === 0) {
            return <Route path="/" key="loading" component={loading} />;
        }

        return (
            <div>
                {// Render every resources children outside the React Router Switch
                // as we need all of them and not just the one rendered
                Children.map(childrenToRender, child =>
                    cloneElement(child, {
                        key: child.props.name,
                        // The context prop instructs the Resource component to not render anything
                        // but simply to register itself as a known resource
                        context: 'registration',
                    })
                )}
                <Switch>
                    {customRoutes
                        .filter(route => route.props.noLayout)
                        .map((route, index) => (
                            <Route
                                key={index}
                                exact={route.props.exact}
                                path={route.props.path}
                                render={props =>
                                    this.renderCustomRoutesWithoutLayout(
                                        route,
                                        props
                                    )}
                            />
                        ))}
                    <Route
                        path="/"
                        render={() =>
                            createElement(appLayout, {
                                children: (
                                    <RoutesWithLayout
                                        catchAll={catchAll}
                                        children={childrenToRender} // eslint-disable-line react/no-children-prop
                                        customRoutes={customRoutes.filter(
                                            route => !route.props.noLayout
                                        )}
                                        dashboard={dashboard}
                                        title={title}
                                    />
                                ),
                                dashboard,
                                logout,
                                menu,
                                theme,
                                title,
                            })}
                    />
                </Switch>
            </div>
        );
    }
}

const componentPropType = PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.string,
]);

CoreAdminRouter.propTypes = {
    appLayout: componentPropType,
    authProvider: PropTypes.func,
    catchAll: componentPropType,
    children: PropTypes.oneOfType([PropTypes.func, PropTypes.node]),
    customRoutes: PropTypes.array,
    dashboard: componentPropType,
    isLoggedIn: PropTypes.bool,
    loading: componentPropType,
    logout: PropTypes.node,
    menu: componentPropType,
    theme: PropTypes.object,
    title: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
    userLogout: PropTypes.func,
};

const mapStateToProps = state => ({
    isLoggedIn: isLoggedIn(state),
});

export default compose(
    getContext({
        authProvider: PropTypes.func,
    }),
    connect(mapStateToProps, { userLogout })
)(CoreAdminRouter);
