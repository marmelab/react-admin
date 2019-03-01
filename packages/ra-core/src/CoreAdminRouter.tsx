import React, {
    Children,
    Component,
    cloneElement,
    createElement,
    ComponentType,
    CSSProperties,
} from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Route, Switch } from 'react-router-dom';
import compose from 'recompose/compose';
import getContext from 'recompose/getContext';

import { AUTH_GET_PERMISSIONS } from './auth/types';
import { isLoggedIn } from './reducer';
import { userLogout as userLogoutAction } from './actions/authActions';
import RoutesWithLayout from './RoutesWithLayout';
import {
    Dispatch,
    AuthProvider,
    AdminChildren,
    CustomRoutes,
    CatchAllComponent,
    LayoutComponent,
    LayoutProps,
    ResourceProps,
    RenderResourcesFunction,
    ResourceElement,
} from './types';

const welcomeStyles: CSSProperties = {
    width: '50%',
    margin: '40vh',
    textAlign: 'center',
};

export interface AdminRouterProps extends LayoutProps {
    appLayout: LayoutComponent;
    catchAll: CatchAllComponent;
    children?: AdminChildren;
    customRoutes?: CustomRoutes;
    loading: ComponentType;
}

interface EnhancedProps {
    authProvider?: AuthProvider;
    isLoggedIn?: boolean;
    userLogout: Dispatch<typeof userLogoutAction>;
}

interface State {
    children: ResourceElement[];
}

export class CoreAdminRouter extends Component<
    AdminRouterProps & EnhancedProps,
    State
> {
    static defaultProps: Partial<AdminRouterProps> = {
        customRoutes: [],
    };

    state: State = { children: [] };

    componentWillMount() {
        this.initializeResources(this.props);
    }

    initializeResources = (nextProps: AdminRouterProps & EnhancedProps) => {
        if (typeof nextProps.children === 'function') {
            this.initializeResourcesAsync(nextProps);
        }
    };

    initializeResourcesAsync = async (
        props: AdminRouterProps & EnhancedProps
    ) => {
        const { authProvider } = props;
        try {
            const permissions = await authProvider(AUTH_GET_PERMISSIONS);
            const resolveChildren = props.children as RenderResourcesFunction;

            const childrenFuncResult = resolveChildren(permissions);
            if ((childrenFuncResult as Promise<ResourceElement[]>).then) {
                (childrenFuncResult as Promise<ResourceElement[]>).then(
                    resolvedChildren => {
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
                    }
                );
            } else {
                this.setState({
                    children: (childrenFuncResult as ResourceElement[]).filter(
                        child => child
                    ),
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

        if (
            process.env.NODE_ENV !== 'production' &&
            typeof children !== 'function' &&
            !children
        ) {
            return (
                <div style={welcomeStyles}>
                    React-admin is properly configured.
                    <br />
                    Now you can add a first &lt;Resource&gt; as child of
                    &lt;Admin&gt;.
                </div>
            );
        }

        if (
            typeof children === 'function' &&
            (!this.state.children || this.state.children.length === 0)
        ) {
            return <Route path="/" key="loading" component={loading} />;
        }

        const childrenToRender =
            typeof children === 'function' ? this.state.children : children;

        return (
            <div>
                {// Render every resources children outside the React Router Switch
                // as we need all of them and not just the one rendered
                Children.map(
                    childrenToRender,
                    (child: React.ReactElement<ResourceProps>) =>
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
                        .map((route, key) =>
                            cloneElement(route, {
                                key,
                                render: props =>
                                    this.renderCustomRoutesWithoutLayout(
                                        route,
                                        props
                                    ),
                            })
                        )}
                    <Route
                        path="/"
                        render={() =>
                            createElement(
                                appLayout,
                                {
                                    dashboard,
                                    logout,
                                    menu,
                                    theme,
                                    title,
                                },
                                <RoutesWithLayout
                                    catchAll={catchAll}
                                    customRoutes={customRoutes.filter(
                                        route => !route.props.noLayout
                                    )}
                                    dashboard={dashboard}
                                    title={title}
                                >
                                    {childrenToRender}
                                </RoutesWithLayout>
                            )
                        }
                    />
                </Switch>
            </div>
        );
    }
}

const mapStateToProps = state => ({
    isLoggedIn: isLoggedIn(state),
});

export default compose(
    getContext({
        authProvider: PropTypes.func,
    }),
    connect(
        mapStateToProps,
        { userLogout: userLogoutAction }
    )
)(CoreAdminRouter) as ComponentType<AdminRouterProps>;
