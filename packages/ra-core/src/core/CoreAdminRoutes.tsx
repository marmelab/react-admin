import * as React from 'react';
import { useState, useEffect, Children, ComponentType } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';

import { WithPermissions, useCheckAuth } from '../auth';
import { useScrollToTop, useCreatePath } from '../routing';
import {
    AdminChildren,
    CatchAllComponent,
    DashboardComponent,
    LayoutComponent,
    LoadingComponent,
} from '../types';
import { useConfigureAdminRouterFromChildren } from './useConfigureAdminRouterFromChildren';
import { HasDashboardContextProvider } from './HasDashboardContext';

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
        requireAuth,
        ready: Ready,
    } = props;

    const [canRender, setCanRender] = useState(!requireAuth);
    const checkAuth = useCheckAuth();

    useEffect(() => {
        if (requireAuth) {
            checkAuth()
                .then(() => {
                    setCanRender(true);
                })
                .catch(() => {});
        }
    }, [checkAuth, requireAuth]);

    if (status === 'empty') {
        if (!Ready) {
            throw new Error(
                'The admin is empty. Please provide an empty component, or pass Resource or CustomRoutes as children.'
            );
        }
        return <Ready />;
    }

    if (status === 'loading' || !canRender) {
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

    return (
        <Routes>
            {/*
                Render the custom routes that were outside the child function.
            */}
            {customRoutesWithoutLayout}
            <Route
                path="/*"
                element={
                    <HasDashboardContextProvider value={!!dashboard}>
                        <Layout>
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
                                <Route path="*" element={<CatchAll />} />
                            </Routes>
                        </Layout>
                    </HasDashboardContextProvider>
                }
            />
        </Routes>
    );
};

export interface CoreAdminRoutesProps {
    dashboard?: DashboardComponent;
    layout: LayoutComponent;
    catchAll: CatchAllComponent;
    children?: AdminChildren;
    loading: LoadingComponent;
    requireAuth?: boolean;
    ready?: ComponentType;
}

const defaultAuthParams = { params: { route: 'dashboard' } };
