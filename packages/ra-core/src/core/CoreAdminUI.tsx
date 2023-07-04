import * as React from 'react';
import { ComponentType, useEffect, isValidElement, createElement } from 'react';
import { Routes, Route } from 'react-router-dom';

import { CoreAdminRoutes } from './CoreAdminRoutes';
import { Ready } from '../util';
import {
    TitleComponent,
    LoginComponent,
    LayoutComponent,
    CoreLayoutProps,
    AdminChildren,
    CatchAllComponent,
    DashboardComponent,
    LoadingComponent,
} from '../types';

export type ChildrenFunction = () => ComponentType[];

const DefaultLayout = ({ children }: CoreLayoutProps) => <>{children}</>;

export interface CoreAdminUIProps {
    catchAll?: CatchAllComponent;
    children?: AdminChildren;
    dashboard?: DashboardComponent;
    disableTelemetry?: boolean;
    layout?: LayoutComponent;
    loading?: LoadingComponent;
    authCallbackPage?: ComponentType | boolean;
    loginPage?: LoginComponent | boolean;
    /**
     * @deprecated use a custom layout instead
     */
    menu?: ComponentType;
    requireAuth?: boolean;
    ready?: ComponentType;
    title?: TitleComponent;
}

export const CoreAdminUI = (props: CoreAdminUIProps) => {
    const {
        catchAll = Noop,
        children,
        dashboard,
        disableTelemetry = false,
        layout = DefaultLayout,
        loading = Noop,
        loginPage: LoginPage = false,
        authCallbackPage: LoginCallbackPage = false,
        menu, // deprecated, use a custom layout instead
        ready = Ready,
        title = 'React Admin',
        requireAuth = false,
    } = props;

    useEffect(() => {
        if (
            disableTelemetry ||
            process.env.NODE_ENV !== 'production' ||
            typeof window === 'undefined' ||
            typeof window.location === 'undefined' ||
            typeof Image === 'undefined'
        ) {
            return;
        }
        const img = new Image();
        img.src = `https://react-admin-telemetry.marmelab.com/react-admin-telemetry?domain=${window.location.hostname}`;
    }, [disableTelemetry]);

    return (
        <Routes>
            {LoginPage !== false && LoginPage !== true ? (
                <Route path="/login" element={createOrGetElement(LoginPage)} />
            ) : null}

            {LoginCallbackPage !== false && LoginCallbackPage !== true ? (
                <Route
                    path="/auth-callback"
                    element={createOrGetElement(LoginCallbackPage)}
                />
            ) : null}

            <Route
                path="/*"
                element={
                    <CoreAdminRoutes
                        catchAll={catchAll}
                        dashboard={dashboard}
                        layout={layout}
                        loading={loading}
                        menu={menu}
                        requireAuth={requireAuth}
                        ready={ready}
                        title={title}
                    >
                        {children}
                    </CoreAdminRoutes>
                }
            />
        </Routes>
    );
};

const createOrGetElement = el => (isValidElement(el) ? el : createElement(el));

const Noop = () => null;
