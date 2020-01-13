import React, { createElement, FunctionComponent, ComponentType } from 'react';
import { Switch, Route } from 'react-router-dom';

import CoreAdminRouter from './CoreAdminRouter';
import {
    TitleComponent,
    LoginComponent,
    LayoutComponent,
    LayoutProps,
    AdminChildren,
    CatchAllComponent,
    CustomRoutes,
    DashboardComponent,
} from '../types';

export type ChildrenFunction = () => ComponentType[];

const DefaultLayout: FunctionComponent<LayoutProps> = ({ children }) => (
    <>{children}</>
);

export interface CoreAdminUIProps {
    catchAll?: CatchAllComponent;
    children?: AdminChildren;
    customRoutes?: CustomRoutes;
    dashboard?: DashboardComponent;
    layout?: LayoutComponent;
    loading?: ComponentType;
    loginPage?: LoginComponent | boolean;
    logout?: ComponentType;
    menu?: ComponentType;
    theme?: object;
    title?: TitleComponent;
}

const CoreAdminUI: FunctionComponent<CoreAdminUIProps> = ({
    catchAll = Noop,
    children,
    customRoutes = [],
    dashboard,
    layout = DefaultLayout,
    loading = Noop,
    loginPage = false,
    logout,
    menu, // deprecated, use a custom layout instead
    theme,
    title = 'React Admin',
}) => {
    return (
        <Switch>
            {loginPage !== false && loginPage !== true ? (
                <Route
                    exact
                    path="/login"
                    render={props =>
                        createElement(loginPage, {
                            ...props,
                            title,
                            theme,
                        })
                    }
                />
            ) : null}
            <Route
                path="/"
                render={props => (
                    <CoreAdminRouter
                        catchAll={catchAll}
                        customRoutes={customRoutes}
                        dashboard={dashboard}
                        layout={layout}
                        loading={loading}
                        logout={logout && createElement(logout)}
                        menu={menu}
                        theme={theme}
                        title={title}
                        {...props}
                    >
                        {children}
                    </CoreAdminRouter>
                )}
            />
        </Switch>
    );
};

const Noop = () => null;

export default CoreAdminUI;
