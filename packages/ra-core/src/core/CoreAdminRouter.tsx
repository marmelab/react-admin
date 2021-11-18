import React, {
    Children,
    ComponentType,
    Fragment,
    ReactElement,
    ReactNode,
    useEffect,
} from 'react';
import { Route, Routes } from 'react-router-dom';

import { RoutesWithLayout } from './RoutesWithLayout';
import { useLogout, useGetPermissions, useAuthState } from '../auth';
import { useTimeout, useSafeSetState } from '../util';
import { useScrollToTop } from './useScrollToTop';
import {
    AdminChildren,
    CatchAllComponent,
    LayoutComponent,
    LoadingComponent,
    CoreLayoutProps,
    RenderResourcesFunction,
} from '../types';
import { CustomRoutes, CustomRoutesProps } from './CustomRoutes';

export const CoreAdminRouter = (props: AdminRouterProps) => {
    const getPermissions = useGetPermissions();
    const doLogout = useLogout();
    const { authenticated } = useAuthState();
    const oneSecondHasPassed = useTimeout(1000);
    const [computedChildren, setComputedChildren] = useSafeSetState<
        ReactNode
    >();
    const [hasFunctionChild, setHasFunctionChild] = useSafeSetState(false);
    useScrollToTop();
    useEffect(() => {
        if (Array.isArray(props.children)) {
            const functionChildren = props.children.filter(
                child => typeof child === 'function'
            );

            if (functionChildren.length > 1) {
                throw new Error(
                    'You can only provide one function child to AdminRouter'
                );
            }

            if (functionChildren.length === 1) {
                setHasFunctionChild(true);
                initializeResources(
                    functionChildren[0] as RenderResourcesFunction
                );
            }
        }
    }, [authenticated]); // eslint-disable-line react-hooks/exhaustive-deps

    const initializeResources = async (childFunc: RenderResourcesFunction) => {
        try {
            const permissions = await getPermissions();
            const childrenFuncResult = childFunc(permissions);
            if ((childrenFuncResult as Promise<ReactNode>).then) {
                (childrenFuncResult as Promise<
                    ReactNode
                >).then(resolvedChildren =>
                    setComputedChildren(resolvedChildren)
                );
            } else {
                setComputedChildren(childrenFuncResult);
            }
        } catch (error) {
            console.error(error);
            doLogout();
        }
    };

    const {
        layout: Layout,
        catchAll,
        children,
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
        (hasFunctionChild && !computedChildren) ||
        (Array.isArray(children) && children.length === 0)
    ) {
        return (
            <Routes>
                {renderCustomRoutes(props.children)}
                {oneSecondHasPassed && (
                    <Route
                        key="loading"
                        element={<LoadingPage theme={theme} />}
                    />
                )}
            </Routes>
        );
    }

    const childrenToRender = (hasFunctionChild
        ? computedChildren
        : children) as Array<ReactElement<any, any>>;

    return (
        <Routes>
            {/*
                Render the custom routes that were outside the child function.
            */}
            {renderCustomRoutes(props.children)}
            {/*
                Render the custom routes that were returned by the child function.
            */}
            {renderCustomRoutes(computedChildren)}
            <Route
                path="/*"
                element={
                    <div>
                        <Layout
                            dashboard={dashboard}
                            logout={logout}
                            menu={menu}
                            theme={theme}
                            title={title}
                        >
                            <RoutesWithLayout
                                catchAll={catchAll}
                                dashboard={dashboard}
                                title={title}
                            >
                                {/*
                                    Render the resources and custom routes that were outside the child function. We use Children.map as it will automatically ignore
                                    the child function if there is one.
                                */}
                                {Children.map(props.children, child => child)}
                                {/* Render the resources and custom routes that were returned by the child function */}
                                {childrenToRender}
                            </RoutesWithLayout>
                        </Layout>
                    </div>
                }
            />
        </Routes>
    );
};

CoreAdminRouter.defaultProps = {
    customRoutes: [],
};

export interface AdminRouterProps extends CoreLayoutProps {
    layout: LayoutComponent;
    catchAll: CatchAllComponent;
    children?: AdminChildren;
    loading: LoadingComponent;
    ready?: ComponentType;
}

const renderCustomRoutes = (children: ReactNode) => {
    return Children.map(children, element => {
        if (!React.isValidElement(element)) {
            // Ignore non-elements. This allows people to more easily inline
            // conditionals in their route config.
            return null;
        }
        if (element.type === Fragment) {
            return renderCustomRoutes(element.props.children);
        }

        if (element.type !== CustomRoutes) {
            return null;
        }

        const customRoutesElement = element as ReactElement<CustomRoutesProps>;

        if (customRoutesElement.props.noLayout) {
            return customRoutesElement.props.children;
        }

        return null;
    });
};
