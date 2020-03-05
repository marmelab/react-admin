import React, { FC } from 'react';
import { CoreAdminUI, AdminUIProps } from 'ra-core';
import {
    Layout as DefaultLayout,
    Loading,
    Login,
    Logout,
    NotFound,
} from 'ra-ui-materialui';

const AdminUI: FC<AdminUIProps> = props => <CoreAdminUI {...props} />;

AdminUI.defaultProps = {
    layout: DefaultLayout,
    catchAll: NotFound,
    loading: Loading,
    loginPage: Login,
    logout: Logout,
};

export default AdminUI;
