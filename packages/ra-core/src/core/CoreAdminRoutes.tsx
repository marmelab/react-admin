import * as React from 'react';
import { useState, useEffect, Children, ComponentType } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { WithPermissions, useCheckAuth, LogoutOnMount } from '../auth';
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
import { useFirstResourceWithListAccess } from './useFirstResourceWithListAccess';

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
        authenticationError: AuthenticationError = Noop,
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

    const {
        isPending: isPendingFirstResourceWithListAccess,
        resource: firstResourceWithListAccess,
    } = useFirstResourceWithListAccess(resources);

    if (status === 'empty') {
        if (!Ready) {
            throw new Error(
                'The admin is empty. Please provide an empty component, or pass Resource or CustomRoutes as children.'
            );
        }
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
                                        ) : firstResourceWithListAccess ? (
                                            <Navigate
                                                to={createPath({
                                                    resource:
                                                        firstResourceWithListAccess,
                                                    type: 'list',
                                                })}
                                            />
                                        ) : isPendingFirstResourceWithListAccess ? (
                                            <LoadingPage />
                                        ) : null
                                    }
                                />
                                <Route
                                    path="/authentication-error"
                                    element={<AuthenticationError />}
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
    authenticationError?: ComponentType;
}

const defaultAuthParams = { params: { route: 'dashboard' } };
const Noop = () => null;
