import * as React from 'react';
import {
    ComponentType,
    useEffect,
    isValidElement,
    createElement,
    useState,
    ErrorInfo,
    ReactElement,
} from 'react';
import { Routes, Route } from 'react-router-dom';
import { ErrorBoundary } from 'react-error-boundary';

import { CoreAdminRoutes } from './CoreAdminRoutes';
import { useResetErrorBoundaryOnLocationChange } from '../routing';
import { Ready } from '../util';
import { DefaultTitleContextProvider } from './DefaultTitleContext';
import type {
    TitleComponent,
    LoginComponent,
    LayoutComponent,
    AdminChildren,
    CatchAllComponent,
    DashboardComponent,
    LoadingComponent,
} from '../types';

export type ChildrenFunction = () => ComponentType[];

const DefaultLayout = ({ children }: { children: React.ReactNode }) => (
    <>{children}</>
);
const DefaultError = ({ error, errorInfo, resetErrorBoundary }) => {
    useResetErrorBoundaryOnLocationChange(resetErrorBoundary);
    return (
        <div>
            <h1>Error</h1>
            <pre>
                {error.message}
                {errorInfo?.componentStack}
            </pre>
        </div>
    );
};

export interface CoreAdminUIProps {
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
     * The component displayed when an error is caught in a child component
     * @see https://marmelab.com/react-admin/Admin.html#error
     * @example
     * import { Admin } from 'react-admin';
     * import { MyError } from './error';
     *
     * const App = () => (
     *     <Admin error={MyError}>
     *         ...
     *     </Admin>
     * );
     */
    error?: ({
        errorInfo,
        error,
        resetErrorBoundary,
    }: {
        errorInfo?: ErrorInfo;
        error: Error;
        resetErrorBoundary: (args) => void;
    }) => ReactElement;

    /**
     * The main app layout component
     *
     * @see https://marmelab.com/react-admin/Admin.html#layout
     * @example
     * import { Admin, Layout } from 'react-admin';
     *
     * const MyLayout = ({ children }) => (
     *     <Layout appBarAlwaysOn>
     *        {children}
     *     </Layout>
     * );
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

    /**
     * The page to display when an authentication error occurs
     *
     * @see https://marmelab.com/react-admin/Admin.html#authenticationError
     * @example
     * import { Admin } from 'react-admin';
     *
     * const AuthenticationError = () => (
     *     <div>
     *         <h1>Authentication Error</h1>
     *         <p>The authentication server returned an error and your credentials could not be checked.</p>
     *     </div>
     * )
     *
     * const App = () => (
     *     <Admin authenticationError={AuthenticationError}>
     *         ...
     *     </Admin>
     * );
     */
    authenticationError?: ComponentType;

    /**
     * A react component to display when users don't have access to the page they're trying to access
     *
     * @see https://marmelab.com/react-admin/Admin.html#accessDenied
     * @example
     * // in src/AccessDenied.js
     * import Card from '@mui/material/Card';
     * import CardContent from '@mui/material/CardContent';
     * import { Title } from 'react-admin';
     *
     * export const AccessDenied = () => (
     *     <Card>
     *         <Title title="AccessDenied" />
     *         <CardContent>
     *             <h1>You're not authorized to see this page</h1>
     *         </CardContent>
     *     </Card>
     * );
     *
     * // in src/App.js
     * import { Admin } from 'react-admin';
     * import { dataProvider } from './dataProvider';
     * import { AccessDenied } from './AccessDenied';
     *
     * const App = () => (
     *     <Admin accessDenied={AccessDenied} dataProvider={dataProvider}>
     *         ...
     *     </Admin>
     * );
     */
    accessDenied?: React.ComponentType;
}

export const CoreAdminUI = (props: CoreAdminUIProps) => {
    const [errorInfo, setErrorInfo] = useState<ErrorInfo>({});
    const {
        authCallbackPage: LoginCallbackPage = false,
        catchAll = Noop,
        children,
        dashboard,
        disableTelemetry = false,
        error: ErrorComponent = DefaultError,
        layout = DefaultLayout,
        loading = Noop,
        loginPage: LoginPage = false,
        ready = Ready,
        requireAuth = false,
        title = 'React Admin',
        authenticationError = Noop,
        accessDenied = Noop,
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

    const handleError = (error: Error, info: ErrorInfo) => setErrorInfo(info);

    return (
        <DefaultTitleContextProvider value={title}>
            <ErrorBoundary
                onError={handleError}
                fallbackRender={({ error, resetErrorBoundary }) => (
                    <div style={{ minHeight: '100vh' }}>
                        <ErrorComponent
                            error={error}
                            errorInfo={errorInfo}
                            resetErrorBoundary={resetErrorBoundary}
                        />
                    </div>
                )}
            >
                <Routes>
                    {LoginPage !== false && LoginPage !== true ? (
                        <Route
                            path="/login"
                            element={createOrGetElement(LoginPage)}
                        />
                    ) : null}

                    {LoginCallbackPage !== false &&
                    LoginCallbackPage !== true ? (
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
                                requireAuth={requireAuth}
                                ready={ready}
                                authenticationError={authenticationError}
                                accessDenied={accessDenied}
                            >
                                {children}
                            </CoreAdminRoutes>
                        }
                    />
                </Routes>
            </ErrorBoundary>
        </DefaultTitleContextProvider>
    );
};

const createOrGetElement = el => (isValidElement(el) ? el : createElement(el));

const Noop = () => null;
