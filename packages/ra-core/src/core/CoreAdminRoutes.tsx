import React, { Children, ComponentType } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';

import { WithPermissions } from '../auth';
import { useTimeout } from '../util';
import { useScrollToTop, useCreateInternalLink } from '../routing';
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
    const createInternalLink = useCreateInternalLink();

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
        logout,
        menu,
        ready: Ready,
        title,
    } = props;

    if (status === 'empty') {
        return <Ready />;
    }

    if (status === 'loading') {
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
                        <Layout
                            dashboard={dashboard}
                            logout={logout}
                            menu={menu}
                            title={title}
                        >
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
                                                to={createInternalLink({
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

CoreAdminRoutes.defaultProps = {
    customRoutes: [],
};

export interface CoreAdminRoutesProps extends CoreLayoutProps {
    layout: LayoutComponent;
    catchAll: CatchAllComponent;
    children?: AdminChildren;
    loading: LoadingComponent;
    ready?: ComponentType;
}

const defaultAuthParams = { route: 'dashboard' };
