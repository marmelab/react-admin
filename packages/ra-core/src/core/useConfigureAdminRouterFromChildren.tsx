import React, {
    Children,
    Fragment,
    ReactElement,
    ReactNode,
    useEffect,
} from 'react';
import { useLogout, useGetPermissions, useAuthState } from '../auth';
import { useSafeSetState } from '../util';
import {
    AdminChildren,
    RenderResourcesFunction,
    ResourceDefinition,
    ResourceProps,
} from '../types';
import { CustomRoutesProps } from './CustomRoutes';
import { useResourceDefinitionContext } from './useResourceDefinitionContext';

/**
 * This hook inspects the CoreAdminRouter children and returns them separated in three groups:
 * - Custom routes without layout
 * - Custom routes with layout
 * - Resources
 *
 * It also returns a status:
 * - loading: still loading children from a function child
 * - empty: no resources were provided among children
 * - ready: admin is ready to be rendered
 *
 * @example
 * const {
 *    customRoutesWithLayout,
 *    customRoutesWithoutLayout,
 *    resources,
 *    status,
 * } = useConfigureAdminRouterFromChildren(children);
 */
export const useConfigureAdminRouterFromChildren = (
    children: AdminChildren
) => {
    const getPermissions = useGetPermissions();
    const doLogout = useLogout();
    const { authenticated } = useAuthState();
    const { register, unregister } = useResourceDefinitionContext();
    // Gather custom routes and resources that were declared as direct children of CoreAdminRouter
    // e.g. Not returned from the child function (if any)
    // We need to know right away wether some resources were declared to correctly
    // initialize the status at the next stop
    const routesAndResources = getRoutesAndResourceFromNodes(children);

    const [
        customRoutesWithoutLayout,
        setCustomRoutesWithoutLayout,
    ] = useSafeSetState(routesAndResources.customRoutesWithoutLayout);
    const [customRoutesWithLayout, setCustomRoutesWithLayout] = useSafeSetState(
        routesAndResources.customRoutesWithLayout
    );
    const [resources, setResources] = useSafeSetState<
        ReactElement<ResourceProps>[]
    >(routesAndResources.resources);

    const [status, setStatus] = useSafeSetState<AdminRouterStatus>(() =>
        getStatus({
            children,
            resources,
            customRoutesWithLayout,
            customRoutesWithoutLayout,
        })
    );

    // Whenever children are updated, update our custom routes and resources
    useEffect(() => {
        const routesAndResources = getRoutesAndResourceFromNodes(children);
        setCustomRoutesWithLayout(routesAndResources.customRoutesWithLayout);
        setCustomRoutesWithoutLayout(
            routesAndResources.customRoutesWithoutLayout
        );
        setResources(routesAndResources.resources);
        setStatus(
            getStatus({
                children,
                ...routesAndResources,
            })
        );
    }, [
        children,
        setCustomRoutesWithLayout,
        setCustomRoutesWithoutLayout,
        setResources,
        setStatus,
    ]);

    useEffect(() => {
        const resolveChildFunction = async (
            childFunc: RenderResourcesFunction
        ) => {
            const updateRoutesAndResources = nodes => {
                const routesAndResources = getRoutesAndResourceFromNodes(nodes);
                setCustomRoutesWithLayout(previous =>
                    previous.concat(routesAndResources.customRoutesWithLayout)
                );
                setCustomRoutesWithoutLayout(previous =>
                    previous.concat(
                        routesAndResources.customRoutesWithoutLayout
                    )
                );
                setResources(previous =>
                    previous.concat(routesAndResources.resources)
                );
            };

            try {
                const permissions = await getPermissions();
                const childrenFuncResult = childFunc(permissions);
                if ((childrenFuncResult as Promise<ReactNode>).then) {
                    (childrenFuncResult as Promise<ReactNode>).then(
                        resolvedChildren => {
                            updateRoutesAndResources(resolvedChildren);
                        }
                    );
                } else {
                    updateRoutesAndResources(childrenFuncResult);
                }

                setStatus('ready');
            } catch (error) {
                console.error(error);
                doLogout();
            }
        };

        const functionChild = getSingleChildFunction(children);
        if (functionChild) {
            resolveChildFunction(functionChild);
        }
    }, [
        authenticated,
        children,
        doLogout,
        getPermissions,
        setCustomRoutesWithLayout,
        setCustomRoutesWithoutLayout,
        setResources,
        setStatus,
    ]);

    // Whenever the resources change, we must ensure they're all registered
    useEffect(() => {
        resources.forEach(resource => {
            if (
                typeof ((resource.type as unknown) as ResourceWithRegisterFunction)
                    .registerResource === 'function'
            ) {
                const definition = ((resource.type as unknown) as ResourceWithRegisterFunction).registerResource(
                    resource.props
                );
                register(definition);
            } else {
                throw new Error(
                    'When using a custom Resource element, it must have a static registerResource method accepting its props and returning a ResourceDefinition'
                );
            }
        });
        return () => {
            resources.forEach(resource => {
                if (
                    typeof ((resource.type as unknown) as ResourceWithRegisterFunction)
                        .registerResource === 'function'
                ) {
                    const definition = ((resource.type as unknown) as ResourceWithRegisterFunction).registerResource(
                        resource.props
                    );
                    unregister(definition);
                } else {
                    throw new Error(
                        'When using a custom Resource element, it must have a static registerResource method accepting its props and returning a ResourceDefinition'
                    );
                }
            });
        };
    }, [register, unregister, resources]);

    console.log({ status });
    return {
        customRoutesWithLayout,
        customRoutesWithoutLayout,
        status,
        resources,
    };
};

const getStatus = ({
    children,
    resources,
    customRoutesWithLayout,
    customRoutesWithoutLayout,
}: {
    children: ReactNode;
    resources: ReactElement<ResourceProps>[];
    customRoutesWithLayout: ReactElement<CustomRoutesProps>[];
    customRoutesWithoutLayout: ReactElement<CustomRoutesProps>[];
}) => {
    return getSingleChildFunction(children)
        ? 'loading'
        : resources.length > 0 ||
          customRoutesWithLayout.length > 0 ||
          customRoutesWithoutLayout.length > 0
        ? 'ready'
        : 'empty';
};

type ResourceWithRegisterFunction = {
    registerResource: (props: ResourceProps) => ResourceDefinition;
};

/**
 * Inspect the children of a CoreAdminRouter to see if one of them is a function.
 * Throws an error if there are more than one function child.
 * Returns the function child if one was provided, or null otherwise.
 */
const getSingleChildFunction = (
    children: ReactNode
): RenderResourcesFunction | null => {
    const childrenArray = Array.isArray(children) ? children : [children];

    const functionChildren = childrenArray.filter(
        child => typeof child === 'function'
    );

    if (functionChildren.length > 1) {
        throw new Error(
            'You can only provide one function child to AdminRouter'
        );
    }

    if (functionChildren.length === 0) {
        return null;
    }

    return functionChildren[0] as RenderResourcesFunction;
};

type AdminRouterStatus = 'loading' | 'empty' | 'ready';

/**
 * Inspect the children and return an object with the following keys:
 * - customRoutesWithLayout: an array of the custom routes to render inside the layout
 * - customRoutesWithoutLayout: an array of custom routes to render outside the layout
 * - resources: an array of resources elements
 */
const getRoutesAndResourceFromNodes = (children: ReactNode) => {
    const customRoutesWithLayout = [];
    const customRoutesWithoutLayout = [];
    const resources = [];
    Children.forEach(children, element => {
        if (!React.isValidElement(element)) {
            // Ignore non-elements. This allows people to more easily inline
            // conditionals in their route config.
            return;
        }
        if (element.type === Fragment) {
            const customRoutesFromFragment = getRoutesAndResourceFromNodes(
                element.props.children
            );
            customRoutesWithLayout.push(
                ...customRoutesFromFragment.customRoutesWithLayout
            );
            customRoutesWithoutLayout.push(
                ...customRoutesFromFragment.customRoutesWithoutLayout
            );
            resources.push(...customRoutesFromFragment.resources);
        }

        if ((element.type as any).raName === 'CustomRoutes') {
            const customRoutesElement = element as ReactElement<
                CustomRoutesProps
            >;

            if (customRoutesElement.props.noLayout) {
                customRoutesWithoutLayout.push(
                    customRoutesElement.props.children
                );
            } else {
                customRoutesWithLayout.push(customRoutesElement.props.children);
            }
        } else if ((element.type as any).raName === 'Resource') {
            resources.push(element as ReactElement<ResourceProps>);
        }
    });

    return {
        customRoutesWithLayout,
        customRoutesWithoutLayout,
        resources,
    };
};
