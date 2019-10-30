import { CoreAdminUI, LoginComponent } from 'ra-core';
import {
    Layout as DefaultLayout,
    Loading,
    Login,
    Logout,
    NotFound,
} from 'ra-ui-materialui';

const AdminUI = CoreAdminUI;

AdminUI.defaultProps = {
    layout: DefaultLayout,
    catchAll: NotFound,
    loading: Loading,
    loginPage: Login as LoginComponent,
    logout: Logout,
};

AdminUI.displayName = 'AdminUI';

export default AdminUI;
