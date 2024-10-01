import * as React from 'react';
import { createElement, ComponentType } from 'react';
import { CoreAdminUI, CoreAdminUIProps } from 'ra-core';
import { CssBaseline } from '@mui/material';

import {
    Layout as DefaultLayout,
    AuthenticationError,
    LoadingPage,
    NotFound,
    Notification,
    Error,
    AccessDenied,
} from './layout';
import { Login, AuthCallback } from './auth';

export const AdminUI = ({
    layout = DefaultLayout,
    authenticationError = AuthenticationError,
    catchAll = NotFound,
    loading = LoadingPage,
    loginPage = Login,
    authCallbackPage = AuthCallback,
    notification = Notification,
    error = Error,
    accessDenied = AccessDenied,
    ...props
}: AdminUIProps) => (
    <CssBaseline enableColorScheme>
        <CoreAdminUI
            layout={layout}
            catchAll={catchAll}
            loading={loading}
            loginPage={loginPage}
            authCallbackPage={authCallbackPage}
            error={error}
            authenticationError={authenticationError}
            accessDenied={accessDenied}
            {...props}
        />
        {createElement(notification)}
    </CssBaseline>
);

export interface AdminUIProps extends CoreAdminUIProps {
    /**
     * The component used to display notifications
     *
     * @see https://marmelab.com/react-admin/Admin.html#notification
     * @example
     * import { Admin, Notification } from 'react-admin';
     * import { dataProvider } from './dataProvider';
     *
     * const MyNotification = () => <Notification autoHideDuration={5000} />;
     *
     * const App = () => (
     *     <Admin notification={MyNotification} dataProvider={dataProvider}>
     *         ...
     *     </Admin>
     * );
     */
    notification?: ComponentType;
}
