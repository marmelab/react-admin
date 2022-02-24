import * as React from 'react';
import { createElement, ComponentType } from 'react';
import { CoreAdminUI, CoreAdminUIProps } from 'ra-core';
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

export interface AdminUIProps extends CoreAdminUIProps {
    notification?: ComponentType;
}

AdminUI.defaultProps = {
    layout: DefaultLayout,
    catchAll: NotFound,
    loading: LoadingPage,
    loginPage: Login,
    logoutButton: Logout,
    notification: Notification,
};
