import { CoreAdmin } from 'ra-core';

import DefaultLayout from './mui/layout/Layout';
import Loading from './mui/layout/Loading';
import Login from './mui/auth/Login';
import Logout from './mui/auth/Logout';
import Menu from './mui/layout/Menu';
import NotFound from './mui/layout/NotFound';

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
