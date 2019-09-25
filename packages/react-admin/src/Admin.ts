import { CoreAdmin } from 'ra-core';
import {
    Layout as DefaultLayout,
    Loading,
    Login,
    Logout,
    NotFound,
} from 'ra-ui-materialui';

import defaultI18nProvider from './defaultI18nProvider';

const Admin = CoreAdmin;

Admin.defaultProps = {
    i18nProvider: defaultI18nProvider,
    layout: DefaultLayout,
    catchAll: NotFound,
    loading: Loading,
    loginPage: Login,
    logoutButton: Logout,
};

export default Admin;
