import * as React from 'react';
import {
    Children,
    Dispatch,
    Fragment,
    ReactElement,
    ReactNode,
    SetStateAction,
    useCallback,
    useEffect,
    useState,
} from 'react';
import { useLogout, usePermissions } from '../auth';
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
): RoutesAndResources & { status: AdminRouterStatus } => {
    const { permissions, isLoading } = usePermissions();

    // Whenever children are updated, update our custom routes and resources
    const [routesAndResources, status] = useRoutesAndResourcesFromChildren(
        children,
        permissions,
        isLoading
    );

    // Whenever the resources change, we must ensure they're all registered
    useRegisterResources(routesAndResources.resources, permissions);

    return {
        customRoutesWithLayout: routesAndResources.customRoutesWithLayout,
        customRoutesWithoutLayout: routesAndResources.customRoutesWithoutLayout,
        status,
        resources: routesAndResources.resources,
    };
};

/**
 * A hook that determine the routes and resources from React nodes and permissions.
 * Returns a tuple with the routes and resources as a single object, and the status.
 * @param children React nodes to inspect
 * @param permissions The permissions
 */
const useRoutesAndResourcesFromChildren = (
    children: ReactNode,
    permissions: any,
    isLoading: boolean
): [RoutesAndResources, AdminRouterStatus] => {
    // Gather custom routes and resources that were declared as direct children of CoreAdminRouter
    // e.g. Not returned from the child function (if any)
    // We need to know right away whether some resources were declared to correctly
    // initialize the status at the next stop
    const doLogout = useLogout();
    const [
        routesAndResources,
        setRoutesAndResources,
        mergeRoutesAndResources,
    ] = useRoutesAndResourcesState(getRoutesAndResourceFromNodes(children));

    const [status, setStatus] = useSafeSetState<AdminRouterStatus>(() =>
        getStatus({
            children,
            ...routesAndResources,
        })
    );

    useEffect(() => {
        const resolveChildFunction = async (
            childFunc: RenderResourcesFunction
        ) => {
            try {
                const childrenFuncResult = childFunc(permissions);
                if ((childrenFuncResult as Promise<ReactNode>)?.then) {
                    (childrenFuncResult as Promise<ReactNode>).then(
                        resolvedChildren => {
                            mergeRoutesAndResources(
                                getRoutesAndResourceFromNodes(resolvedChildren)
                            );
                            setStatus('ready');
                        }
                    );
                } else {
                    mergeRoutesAndResources(
                        getRoutesAndResourceFromNodes(childrenFuncResult)
                    );
                    setStatus('ready');
                }
            } catch (error) {
                console.error(error);
                doLogout();
            }
        };

        const updateFromChildren = async () => {
            const functionChild = getSingleChildFunction(children);
            const newRoutesAndResources = getRoutesAndResourceFromNodes(
                children
            );
            setRoutesAndResources(newRoutesAndResources);
            setStatus(
                !!functionChild
                    ? 'loading'
                    : newRoutesAndResources.resources.length > 0 ||
                      newRoutesAndResources.customRoutesWithLayout.length > 0 ||
                      newRoutesAndResources.customRoutesWithoutLayout.length > 0
                    ? 'ready'
                    : 'empty'
            );

            if (functionChild) {
                resolveChildFunction(functionChild);
            }
        };
        if (!isLoading) {
            updateFromChildren();
        }
    }, [
        children,
        doLogout,
        isLoading,
        mergeRoutesAndResources,
        permissions,
        setRoutesAndResources,
        setStatus,
    ]);

    return [routesAndResources, status];
};

/*
 * A hook that store the routes and resources just like setState but also provides an additional function
 * to merge new routes and resources with the existing ones.
 */
const useRoutesAndResourcesState = (
    initialState: RoutesAndResources
): [
    RoutesAndResources,
    Dispatch<SetStateAction<RoutesAndResources>>,
    (newRoutesAndResources: RoutesAndResources) => void
] => {
    const [routesAndResources, setRoutesAndResources] = useState(initialState);

    const mergeRoutesAndResources = useCallback(
        (newRoutesAndResources: RoutesAndResources) => {
            setRoutesAndResources(previous => ({
                customRoutesWithLayout: previous.customRoutesWithLayout.concat(
                    newRoutesAndResources.customRoutesWithLayout
                ),
                customRoutesWithoutLayout: previous.customRoutesWithoutLayout.concat(
                    newRoutesAndResources.customRoutesWithoutLayout
                ),
                resources: previous.resources.concat(
                    newRoutesAndResources.resources
                ),
            }));
        },
        []
    );

    return [routesAndResources, setRoutesAndResources, mergeRoutesAndResources];
};

/**
 * A hook that register resources and unregister them when the calling component is unmounted.
 * @param resources: An array of Resource elements
 * @param permissions: The permissions
 */
const useRegisterResources = (
    resources: (ReactElement<ResourceProps> & ResourceWithRegisterFunction)[],
    permissions: any
) => {
    const { register, unregister } = useResourceDefinitionContext();

    useEffect(() => {
        resources.forEach(resource => {
            if (
                typeof ((resource.type as unknown) as ResourceWithRegisterFunction)
                    .registerResource === 'function'
            ) {
                const definition = ((resource.type as unknown) as ResourceWithRegisterFunction).registerResource(
                    resource.props,
                    permissions
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
                        resource.props,
                        permissions
                    );
                    unregister(definition);
                } else {
                    throw new Error(
                        'When using a custom Resource element, it must have a static registerResource method accepting its props and returning a ResourceDefinition'
                    );
                }
            });
        };
    }, [permissions, register, resources, unregister]);
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

/**
 * Inspect the children and return an object with the following keys:
 * - customRoutesWithLayout: an array of the custom routes to render inside the layout
 * - customRoutesWithoutLayout: an array of custom routes to render outside the layout
 * - resources: an array of resources elements
 */
const getRoutesAndResourceFromNodes = (
    children: ReactNode
): RoutesAndResources => {
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

type RoutesAndResources = {
    customRoutesWithLayout: ReactElement<CustomRoutesProps>[];
    customRoutesWithoutLayout: ReactElement<CustomRoutesProps>[];
    resources: (ReactElement<ResourceProps> & ResourceWithRegisterFunction)[];
};

type ResourceWithRegisterFunction = {
    registerResource: (
        props: ResourceProps,
        permissions: any
    ) => ResourceDefinition;
};

type AdminRouterStatus = 'loading' | 'empty' | 'ready';
