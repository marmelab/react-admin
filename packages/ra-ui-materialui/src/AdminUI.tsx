import * as React from 'react';
import { createElement } from 'react';
import { CoreAdminUI, AdminUIProps } from 'ra-core';
import {
    Layout as DefaultLayout,
    LoadingPage,
    NotFound,
    Notification,
} from './layout';
import { Login, Logout } from './auth';

export const AdminUI = ({ notification, ...props }: AdminUIProps) => (
    <>
        <CoreAdminUI {...props} />
        {createElement(notification)}
    </>
);

AdminUI.defaultProps = {
    layout: DefaultLayout,
    catchAll: NotFound,
    loading: LoadingPage,
    loginPage: Login,
    logout: Logout,
    notification: Notification,
};
