import { CoreAdmin } from '@yeutech/ra-core';
import {
    Layout as DefaultLayout,
    Loading,
    Login,
    Logout,
    Menu,
    NotFound,
} from '@yeutech/ra-ui-bootstrap-styled';

const Admin = CoreAdmin;

Admin.defaultProps = {
    appLayout: DefaultLayout,
    catchAll: NotFound,
    loading: Loading,
    loginPage: Login,
    logoutButton: Logout,
    menu: Menu,
};

export default Admin;
