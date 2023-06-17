import * as React from 'react';
import { createElement, ComponentType } from 'react';
import { CoreAdminUI, CoreAdminUIProps } from 'ra-core';
import { ScopedCssBaseline } from '@mui/material';

import {
    Layout as DefaultLayout,
    LoadingPage,
    NotFound,
    Notification,
} from './layout';
import { Login, AuthCallback } from './auth';

export const AdminUI = ({
    layout = DefaultLayout,
    catchAll = NotFound,
    loading = LoadingPage,
    loginPage = Login,
    authCallbackPage = AuthCallback,
    notification = Notification,
    ...props
}: AdminUIProps) => (
    <ScopedCssBaseline enableColorScheme>
        <CoreAdminUI
            layout={layout}
            catchAll={catchAll}
            loading={loading}
            loginPage={loginPage}
            authCallbackPage={authCallbackPage}
            {...props}
        />
        {createElement(notification)}
    </ScopedCssBaseline>
);

export interface AdminUIProps extends CoreAdminUIProps {
    notification?: ComponentType;
}
