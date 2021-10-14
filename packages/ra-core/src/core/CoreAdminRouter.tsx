import React, {
    Children,
    useEffect,
    cloneElement,
    createElement,
    ComponentType,
    ReactElement,
} from 'react';
import { Route, Switch } from 'react-router-dom';

import RoutesWithLayout from './RoutesWithLayout';
import { useLogout, useGetPermissions, useAuthState } from '../auth';
import { useTimeout, useSafeSetState } from '../util';
import { useScrollToTop } from './useScrollToTop';
import {
    AdminChildren,
    CustomRoutes,
    CatchAllComponent,
    LayoutComponent,
    LoadingComponent,
    CoreLayoutProps,
    ResourceProps,
    RenderResourcesFunction,
    ResourceElement,
} from '../types';

export interface AdminRouterProps extends CoreLayoutProps {
    layout: LayoutComponent;
    catchAll: CatchAllComponent;
    children?: AdminChildren;
    customRoutes?: CustomRoutes;
    loading: LoadingComponent;
    ready?: ComponentType;
}

type State = ResourceElement[];

const CoreAdminRouter = (props: AdminRouterProps) => {
    const getPermissions = useGetPermissions();
    const doLogout = useLogout();
    const { authenticated } = useAuthState();
    const oneSecondHasPassed = useTimeout(1000);
    const [computedChildren, setComputedChildren] = useSafeSetState<State>([]);
    useScrollToTop();
    useEffect(() => {
        if (typeof props.children === 'function') {
            initializeResources();
        }
    }, [authenticated]); // eslint-disable-line react-hooks/exhaustive-deps

    const initializeResources = async () => {
        try {
            const permissions = await getPermissions();
            const resolveChildren = props.children as RenderResourcesFunction;

            const childrenFuncResult = resolveChildren(permissions);
            if ((childrenFuncResult as Promise<ResourceElement[]>).then) {
                (childrenFuncResult as Promise<ResourceElement[]>).then(
                    resolvedChildren =>
                        setComputedChildren(
                            resolvedChildren
                                .filter(child => child)
                                .map(child => ({
                                    ...child,
                                    props: {
                                        ...child.props,
                                        key: child.props.name,
                                    },
                                }))
                        )
                );
            } else {
                setComputedChildren(
                    (childrenFuncResult as ResourceElement[]).filter(
                        child => child
                    )
                );
            }
        } catch (error) {
            console.error(error);
            doLogout();
        }
    };

    const renderCustomRoutesWithoutLayout = (route, routeProps) => {
        if (route.props.render) {
            return route.props.render({
                ...routeProps,
                title: props.title,
            });
        }
        if (route.props.component) {
            return createElement(route.props.component, {
                ...routeProps,
                title: props.title,
            });
        }
    };

    const {
        layout,
        catchAll,
        children,
        customRoutes,
        dashboard,
        loading: LoadingPage,
        logout,
        menu,
        ready: Ready,
        theme,
        title,
    } = props;

    if (typeof children !== 'function' && !children) {
        return <Ready />;
    }

    if (
        (typeof children === 'function' &&
            (!computedChildren || computedChildren.length === 0)) ||
        (Array.isArray(children) && children.length === 0)
    ) {
        return (
            <Switch>
                {customRoutes
                    .filter(route => route.props.noLayout)
                    .map((route, key) =>
                        cloneElement(route, {
                            key,
                            render: routeProps =>
                                renderCustomRoutesWithoutLayout(
                                    route,
                                    routeProps
                                ),
                            component: undefined,
                        })
                    )}
                {oneSecondHasPassed && (
                    <Route
                        key="loading"
                        render={() => <LoadingPage theme={theme} />}
                    />
                )}
            </Switch>
        );
    }

    const childrenToRender = (typeof children === 'function'
        ? computedChildren
        : children) as Array<ReactElement<any, any>>;

    return (
        <div>
            {
                // Render every resource children outside the React Router Switch
                // as we need all of them and not just the one rendered
                Children.map(
                    childrenToRender,
                    (child: React.ReactElement<ResourceProps>) =>
                        cloneElement(child, {
                            key: child.props.name,
                            // The context prop instructs the Resource component to not render anything
                            // but simply to register itself as a known resource
                            intent: 'registration',
                        })
                )
            }
            <Switch>
                {customRoutes
                    .filter(route => route.props.noLayout)
                    .map((route, key) =>
                        cloneElement(route, {
                            key,
                            render: routeProps =>
                                renderCustomRoutesWithoutLayout(
                                    route,
                                    routeProps
                                ),
                            component: undefined,
                        })
                    )}
                <Route
                    path="/"
                    render={() =>
                        createElement(
                            layout,
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
                                {Children.map(
                                    childrenToRender,
                                    (
                                        child: React.ReactElement<ResourceProps>
                                    ) =>
                                        cloneElement(child, {
                                            key: child.props.name,
                                            intent: 'route',
                                        })
                                )}
                            </RoutesWithLayout>
                        )
                    }
                />
            </Switch>
        </div>
    );
};

CoreAdminRouter.defaultProps = {
    customRoutes: [],
};

export default CoreAdminRouter;
