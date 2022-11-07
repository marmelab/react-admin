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
import { Login } from './auth';

export const AdminUI = ({ notification, ...props }: AdminUIProps) => (
    <ScopedCssBaseline enableColorScheme>
        <CoreAdminUI {...props} />
        {createElement(notification)}
    </ScopedCssBaseline>
);

export interface AdminUIProps extends CoreAdminUIProps {
    notification?: ComponentType;
}

AdminUI.defaultProps = {
    layout: DefaultLayout,
    catchAll: NotFound,
    loading: LoadingPage,
    loginPage: Login,
    notification: Notification,
};
