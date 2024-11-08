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
    accessDenied = AccessDenied,
    authCallbackPage = AuthCallback,
    authenticationError = AuthenticationError,
    catchAll = NotFound,
    error = Error,
    layout = DefaultLayout,
    loading = LoadingPage,
    loginPage = Login,
    notification = Notification,
    ...props
}: AdminUIProps) => (
    <CssBaseline enableColorScheme>
        <CoreAdminUI
            accessDenied={accessDenied}
            authCallbackPage={authCallbackPage}
            authenticationError={authenticationError}
            catchAll={catchAll}
            error={error}
            layout={layout}
            loading={loading}
            loginPage={loginPage}
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
