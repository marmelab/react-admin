import * as React from 'react';
import { Children, ComponentType } from 'react';
import { Route, Routes } from 'react-router-dom';
import { WithPermissions, LogoutOnMount, useAuthState } from '../auth';
import { useScrollToTop } from '../routing';
import {
    AdminChildren,
    CatchAllComponent,
    DashboardComponent,
    LayoutComponent,
    LoadingComponent,
} from '../types';
import { useConfigureAdminRouterFromChildren } from './useConfigureAdminRouterFromChildren';
import { HasDashboardContextProvider } from './HasDashboardContext';
import { NavigateToFirstResource } from './NavigateToFirstResource';

export const CoreAdminRoutes = (props: CoreAdminRoutesProps) => {
    useScrollToTop();

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
        accessDenied: AccessDenied = Noop,
    } = props;

    const { authenticated, isPending: isPendingAuthenticated } = useAuthState(
        undefined,
        // do not log the user out on failure to allow access to custom routes with no layout
        false,
        { enabled: requireAuth }
    );

    if (status === 'empty') {
        if (!Ready) {
            throw new Error(
                'The admin is empty. Please provide an empty component, or pass Resource or CustomRoutes as children.'
            );
        }
        return <Ready />;
    }

    // Note: custom routes with no layout are always rendered, regardless of the auth status

    if (status === 'loading' || (requireAuth && isPendingAuthenticated)) {
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

    if (requireAuth && (isPendingAuthenticated || !authenticated)) {
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
                                                loading={LoadingPage}
                                            />
                                        ) : (
                                            <NavigateToFirstResource
                                                loading={LoadingPage}
                                            />
                                        )
                                    }
                                />
                                <Route
                                    path="/authentication-error"
                                    element={<AuthenticationError />}
                                />
                                <Route
                                    path="/access-denied"
                                    element={<AccessDenied />}
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
    accessDenied?: React.ComponentType;
}

// FIXME in v6: make dashboard anonymous by default to remove this hack
const defaultAuthParams = { params: { route: 'dashboard' } };
const Noop = () => null;
