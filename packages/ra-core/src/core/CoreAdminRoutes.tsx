import * as React from 'react';
import { useState, useEffect, Children, ComponentType } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';

import { WithPermissions, useCheckAuth, LogoutOnMount } from '../auth';
import { useScrollToTop, useCreatePath } from '../routing';
import {
    AdminChildren,
    CatchAllComponent,
    LayoutComponent,
    LoadingComponent,
    CoreLayoutProps,
} from '../types';
import { useConfigureAdminRouterFromChildren } from './useConfigureAdminRouterFromChildren';

export const CoreAdminRoutes = (props: CoreAdminRoutesProps) => {
    useScrollToTop();
    const createPath = useCreatePath();

    const {
        customRoutesWithLayout,
        customRoutesWithoutLayout,
        status,
        resources,
    } = useConfigureAdminRouterFromChildren(props.children);

    const {
        layout: Layout,
        catchAll: CatchAll,
        dashboard,
        loading: LoadingPage,
        menu,
        requireAuth,
        ready: Ready,
        title,
    } = props;

    const [onlyAnonymousRoutes, setOnlyAnonymousRoutes] = useState(requireAuth);
    const [checkAuthLoading, setCheckAuthLoading] = useState(requireAuth);
    const checkAuth = useCheckAuth();

    useEffect(() => {
        if (requireAuth) {
            // do not log the user out on failure to allow access to custom routes with no layout
            // for other routes, the LogoutOnMount component will log the user out
            checkAuth(undefined, false)
                .then(() => {
                    setOnlyAnonymousRoutes(false);
                })
                .catch(() => {})
                .finally(() => {
                    setCheckAuthLoading(false);
                });
        }
    }, [checkAuth, requireAuth]);

    if (status === 'empty') {
        return <Ready />;
    }

    // Note: custom routes with no layout are always rendered, regardless of the auth status

    if (status === 'loading' || checkAuthLoading) {
        return (
            <Routes>
                {customRoutesWithoutLayout}
                <Route
                    path="*"
                    element={
                        <div style={{ height: '100vh' }}>
                            <LoadingPage />
                        </div>
                    }
                />
            </Routes>
        );
    }

    if (onlyAnonymousRoutes) {
        return (
            <Routes>
                {customRoutesWithoutLayout}
                <Route path="*" element={<LogoutOnMount />} />
            </Routes>
        );
    }

    return (
        <Routes>
            {/*
                Render the custom routes that were outside the child function.
            */}
            {customRoutesWithoutLayout}
            <Route
                path="/*"
                element={
                    <div>
                        <Layout dashboard={dashboard} menu={menu} title={title}>
                            <Routes>
                                {customRoutesWithLayout}
                                {Children.map(resources, resource => (
                                    <Route
                                        key={resource.props.name}
                                        path={`${resource.props.name}/*`}
                                        element={resource}
                                    />
                                ))}
                                <Route
                                    path="/"
                                    element={
                                        dashboard ? (
                                            <WithPermissions
                                                authParams={defaultAuthParams}
                                                component={dashboard}
                                            />
                                        ) : resources.length > 0 ? (
                                            <Navigate
                                                to={createPath({
                                                    resource:
                                                        resources[0].props.name,
                                                    type: 'list',
                                                })}
                                            />
                                        ) : null
                                    }
                                />
                                <Route
                                    path="*"
                                    element={<CatchAll title={title} />}
                                />
                            </Routes>
                        </Layout>
                    </div>
                }
            />
        </Routes>
    );
};

export interface CoreAdminRoutesProps extends CoreLayoutProps {
    layout: LayoutComponent;
    catchAll: CatchAllComponent;
    children?: AdminChildren;
    loading: LoadingComponent;
    requireAuth?: boolean;
    ready?: ComponentType;
}

const defaultAuthParams = { params: { route: 'dashboard' } };
