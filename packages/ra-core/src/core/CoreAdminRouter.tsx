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
    ResourceDefinition,
    ResourceProps,
} from '../types';
import { CustomRoutes, CustomRoutesProps } from './CustomRoutes';
import { Resource } from './Resource';
import { useRegisterResource } from './useRegisterResource';

export const CoreAdminRouter = (props: AdminRouterProps) => {
    const getPermissions = useGetPermissions();
    const doLogout = useLogout();
    const { authenticated } = useAuthState();
    const registerResource = useRegisterResource();
    const oneSecondHasPassed = useTimeout(1000);
    const [resources, setResources] = useSafeSetState<ResourceDefinition[]>(
        () => createResourcesFromChildren(props.children)
    );
    const [firstResource, setFirstResource] = useSafeSetState<
        ResourceDefinition
    >();
    const [computedChildren, setComputedChildren] = useSafeSetState<
        ReactNode
    >();
    const [hasFunctionChild, setHasFunctionChild] = useSafeSetState(false);
    useScrollToTop();

    useEffect(() => {
        setResources(createResourcesFromChildren(props.children));
    }, [setResources, props.children]);

    useEffect(() => {
        resources.forEach(resource => {
            registerResource(resource);
        });
        setFirstResource(resources.length > 0 ? resources[0] : null);
    }, [registerResource, resources, setFirstResource]);

    useEffect(() => {
        const resources = createResourcesFromChildren(computedChildren);
        setResources(registeredResources => {
            return registeredResources.concat(resources);
        });
    }, [setResources, computedChildren]);

    useEffect(() => {
        const children = Array.isArray(props.children)
            ? props.children
            : [props.children];

        const functionChildren = children.filter(
            child => typeof child === 'function'
        );

        if (functionChildren.length > 1) {
            throw new Error(
                'You can only provide one function child to AdminRouter'
            );
        }

        if (functionChildren.length === 1) {
            setHasFunctionChild(true);
            initializeResources(functionChildren[0] as RenderResourcesFunction);
        }
    }, [authenticated, props.children]); // eslint-disable-line react-hooks/exhaustive-deps

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

    if (hasFunctionChild && !computedChildren) {
        return (
            <Routes>
                {renderCustomRoutes(props.children)}
                {oneSecondHasPassed && (
                    <Route path="*" element={<LoadingPage theme={theme} />} />
                )}
            </Routes>
        );
    }

    const childrenToRender = (hasFunctionChild
        ? computedChildren
        : typeof children !== 'function'
        ? children
        : []) as Array<ReactElement<any, any>>;

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
                                firstResource={firstResource?.name}
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

const createResourcesFromChildren = (children: React.ReactNode) => {
    const resources: ResourceDefinition[] = [];

    Children.forEach(children, element => {
        if (!React.isValidElement(element)) {
            // Ignore non-elements. This allows people to more easily inline
            // conditionals in their route config.
            return;
        }

        if (element.type === React.Fragment) {
            // Transparently support React.Fragment and its children.
            resources.push.apply(
                resources,
                createResourcesFromChildren(element.props.children)
            );
            return;
        }

        if (element.type === CustomRoutes) {
            return;
        }

        if (element.type !== Resource) {
            throw new Error(
                `[${
                    typeof element.type === 'string'
                        ? element.type
                        : element.type.name
                }] is not a <Route> component. All component children of <Routes> must be a <Route> or <React.Fragment>`
            );
        }

        const resourceElement = element as React.ReactElement<ResourceProps>;

        const resource: ResourceDefinition = {
            name: resourceElement.props.name,
            options: resourceElement.props.options,
            hasList: !!resourceElement.props.list,
            hasEdit: !!resourceElement.props.edit,
            hasShow: !!resourceElement.props.show,
            hasCreate: !!resourceElement.props.create,
            icon: resourceElement.props.icon,
        };

        resources.push(resource);
    });

    return resources;
};

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
