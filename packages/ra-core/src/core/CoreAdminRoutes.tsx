import * as React from 'react';
import { useState, useEffect, Children, ComponentType } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';

import { WithPermissions, useCheckAuth } from '../auth';
import { useTimeout } from '../util';
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
    const oneSecondHasPassed = useTimeout(1000);
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
        return <Ready />;
    }

    if (status === 'loading' || !canRender) {
        return (
            <Routes>
                {customRoutesWithoutLayout}
                {oneSecondHasPassed ? (
                    <Route path="*" element={<LoadingPage />} />
                ) : (
                    <Route path="*" element={null} />
                )}
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
