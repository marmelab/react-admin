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
    /**
     * A catch-all react component to display when the URL does not match any
     *
     * @see https://marmelab.com/react-admin/Admin.html#catchall
     * @example
     * // in src/NotFound.js
     * import Card from '@mui/material/Card';
     * import CardContent from '@mui/material/CardContent';
     * import { Title } from 'react-admin';
     *
     * export const NotFound = () => (
     *     <Card>
     *         <Title title="Not Found" />
     *         <CardContent>
     *             <h1>404: Page not found</h1>
     *         </CardContent>
     *     </Card>
     * );
     *
     * // in src/App.js
     * import { Admin } from 'react-admin';
     * import { dataProvider } from './dataProvider';
     * import { NotFound } from './NotFound';
     *
     * const App = () => (
     *     <Admin catchAll={NotFound} dataProvider={dataProvider}>
     *         ...
     *     </Admin>
     * );
     */
    catchAll?: CatchAllComponent;

    children?: AdminChildren;

    /**
     * The component to use for the dashboard page (displayed on the `/` route).
     *
     * @see https://marmelab.com/react-admin/Admin.html#dashboard
     * @example
     * import { Admin } from 'react-admin';
     * import Dashboard from './Dashboard';
     * import { dataProvider } from './dataProvider';
     *
     * const App = () => (
     *     <Admin dashboard={Dashboard} dataProvider={dataProvider}>
     *         ...
     *     </Admin>
     * );
     */
    dashboard?: DashboardComponent;

    /**
     * Set to true to disable anonymous telemetry collection
     *
     * @see https://marmelab.com/react-admin/Admin.html#disabletelemetry
     * @example
     * import { Admin } from 'react-admin';
     * import { dataProvider } from './dataProvider';
     *
     * const App = () => (
     *     <Admin disableTelemetry dataProvider={dataProvider}>
     *         ...
     *     </Admin>
     * );
     */
    disableTelemetry?: boolean;

    /**
     * The main app layout component
     *
     * @see https://marmelab.com/react-admin/Admin.html#layout
     * @example
     * import { Admin, Layout } from 'react-admin';
     *
     * const MyLayout = props => <Layout {...props} appBarAlwaysOn />;
     *
     * export const App = () => (
     *     <Admin dataProvider={dataProvider} layout={MyLayout}>
     *         ...
     *     </Admin>
     * );
     */
    layout?: LayoutComponent;

    /**
     * The component displayed while fetching the auth provider if the admin child is an async function
     */
    loading?: LoadingComponent;

    /**
     * The content displayed when the user visits the /auth-callback page, used for redirection by third-party authentication providers
     *
     * @see https://marmelab.com/react-admin/Admin.html#authcallbackpage
     * @example
     * import { Admin } from 'react-admin';
     * import { dataProvider } from './dataProvider';
     * import { authProvider } from './authProvider';
     * import MyAuthCallbackPage from './MyAuthCallbackPage';
     *
     * const App = () => (
     *     <Admin
     *         authCallbackPage={MyAuthCallbackPage}
     *         authProvider={authProvider}
     *         dataProvider={dataProvider}
     *     >
     *         ...
     *     </Admin>
     * );
     */
    authCallbackPage?: ComponentType | boolean;

    /**
     * The component displayed when the user visits the /login page
     * @see https://marmelab.com/react-admin/Admin.html#loginpage
     * @example
     * import { Admin } from 'react-admin';
     * import { dataProvider } from './dataProvider';
     * import { authProvider } from './authProvider';
     * import MyLoginPage from './MyLoginPage';
     *
     * const App = () => (
     *     <Admin
     *         loginPage={MyLoginPage}
     *         authProvider={authProvider}
     *         dataProvider={dataProvider}
     *     >
     *         ...
     *     </Admin>
     * );
     */
    loginPage?: LoginComponent | boolean;

    /**
     * @deprecated use a custom layout instead
     * @see https://marmelab.com/react-admin/Admin.html#layout
     */
    menu?: ComponentType;

    /**
     * Flag to require authentication for all routes. Defaults to false.
     *
     * @see https://marmelab.com/react-admin/Admin.html#requireauth
     * @example
     * import { Admin } from 'react-admin';
     * import { dataProvider } from './dataProvider';
     * import { authProvider } from './authProvider';
     *
     * const App = () => (
     *     <Admin
     *         requireAuth
     *         authProvider={authProvider}
     *         dataProvider={dataProvider}
     *     >
     *         ...
     *     </Admin>
     * );
     */
    requireAuth?: boolean;

    /**
     * The page to display when the admin has no Resource children
     *
     * @see https://marmelab.com/react-admin/Admin.html#ready
     * @example
     * import { Admin } from 'react-admin';
     *
     * const Ready = () => (
     *     <div>
     *         <h1>Admin ready</h1>
     *         <p>You can now add resources</p>
     *     </div>
     * )
     *
     * const App = () => (
     *     <Admin ready={Ready}>
     *         ...
     *     </Admin>
     * );
     */
    ready?: ComponentType;

    /**
     * The title of the error page
     * @see https://marmelab.com/react-admin/Admin.html#title
     * @example
     * import { Admin } from 'react-admin';
     * import { dataProvider } from './dataProvider';
     *
     * const App = () => (
     *    <Admin title="My Admin" dataProvider={dataProvider}>
     *       ...
     *   </Admin>
     * );
     */
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
