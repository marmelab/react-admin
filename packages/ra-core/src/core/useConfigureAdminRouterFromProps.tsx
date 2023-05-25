import * as React from 'react';
import { Navigate, Outlet, useRoutes } from 'react-router';
import { useQuery } from 'react-query';
import { WithPermissions, usePermissions } from '../auth';
import { useTimeout } from '../util';
import { CoreAdminRoutesProps } from './CoreAdminRoutes';
import { Resource } from './Resource';
import { defaultAuthParams } from '../auth/useAuthProvider';
import { useCreatePath } from '../routing';
import { useResourceDefinitionContext } from './useResourceDefinitionContext';

export const useConfigureAdminRouterFromProps = (
    options: CoreAdminRoutesProps
) => {
    const { permissions, isLoading: isLoadingPermissions } = usePermissions();
    const { register, unregister } = useResourceDefinitionContext();
    const createPath = useCreatePath();
    const oneSecondHasPassed = useTimeout(1000);
    const {
        layout: Layout,
        catchAll: CatchAll,
        dashboard,
        loading: LoadingPage,
        menu,
        ready: Ready,
        title,
    } = options;

    const { data: resourcesConfig, isLoading: isLoadingResources } = useQuery({
        queryKey: ['resourcesConfig', options.resources],
        queryFn: () => {
            if (typeof options.resources === 'function') {
                return options.resources(permissions);
            }

            return options.resources ?? [];
        },
        initialData: [],
    });

    const {
        data: customRoutesConfig,
        isLoading: isLoadingCustomRoutes,
    } = useQuery({
        queryKey: [
            'customRoutes',
            options.customRoutes != null
                ? typeof options.customRoutes === 'function'
                    ? options.customRoutes
                    : options.customRoutes.map(route => route.path)
                : '',
        ],
        queryFn: () => {
            if (typeof options.customRoutes === 'function') {
                return options.customRoutes(permissions);
            }

            return options.customRoutes ?? [];
        },
        initialData: [],
    });

    const {
        data: customRoutesWithoutLayoutConfig,
        isLoading: isLoadingCustomRoutesWithoutLayout,
    } = useQuery({
        queryKey: [
            'customRoutesWithoutLayout',
            options.customRoutesWithoutLayout != null
                ? typeof options.customRoutesWithoutLayout === 'function'
                    ? options.customRoutesWithoutLayout
                    : options.customRoutesWithoutLayout.map(route => route.path)
                : '',
        ],
        queryFn: () => {
            if (typeof options.customRoutesWithoutLayout === 'function') {
                return options.customRoutesWithoutLayout(permissions);
            }

            return options.customRoutesWithoutLayout ?? [];
        },
        initialData: [],
    });

    React.useEffect(() => {
        Object.keys(resourcesConfig).forEach(resource => {
            register(
                Resource.registerResource({
                    name: resource,
                    ...resourcesConfig[resource],
                })
            );
        });
        return () => {
            Object.keys(resourcesConfig).forEach(resource => {
                unregister({
                    name: resource,
                    ...resourcesConfig[resource],
                });
            });
        };
    }, [unregister, resourcesConfig, register]);

    const isLoading =
        isLoadingPermissions ||
        isLoadingResources ||
        isLoadingCustomRoutes ||
        isLoadingCustomRoutesWithoutLayout;

    let routes = React.useMemo(() => {
        if (
            options.resources == null &&
            options.customRoutes == null &&
            options.customRoutesWithoutLayout == null
        ) {
            return [];
        }
        if (isLoading && oneSecondHasPassed) {
            return [
                ...customRoutesWithoutLayoutConfig,
                { path: '/', element: <LoadingPage /> },
            ];
        }

        if (!isLoading) {
            if (
                customRoutesConfig.length === 0 &&
                resourcesConfig.length === 0
            ) {
                return [{ path: '/', element: <Ready /> }];
            }
            return [
                ...customRoutesWithoutLayoutConfig,
                {
                    path: '/*',
                    element: (
                        <Layout dashboard={dashboard} menu={menu} title={title}>
                            <Outlet />
                        </Layout>
                    ),
                    children: [
                        ...customRoutesConfig,
                        ...Object.keys(resourcesConfig).map(resource => ({
                            path: `${resource}/*`,
                            element: (
                                <Resource
                                    name={resource}
                                    {...resourcesConfig[resource]}
                                />
                            ),
                        })),
                        {
                            path: '',
                            element: dashboard ? (
                                <WithPermissions
                                    authParams={defaultAuthParams}
                                    component={dashboard}
                                />
                            ) : Object.keys(resourcesConfig).length > 0 ? (
                                <Navigate
                                    to={createPath({
                                        resource: Object.keys(
                                            resourcesConfig
                                        )[0],
                                        type: 'list',
                                    })}
                                />
                            ) : null,
                        },
                        {
                            path: '*',
                            element: <CatchAll title={title} />,
                        },
                    ],
                },
            ];
        }

        return [];
    }, [
        CatchAll,
        LoadingPage,
        Ready,
        dashboard,
        isLoading,
        Layout,
        menu,
        oneSecondHasPassed,
        options.customRoutes,
        options.customRoutesWithoutLayout,
        options.resources,
        resourcesConfig,
        title,
        createPath,
        customRoutesConfig,
        customRoutesWithoutLayoutConfig,
    ]);

    return useRoutes(routes);
};
