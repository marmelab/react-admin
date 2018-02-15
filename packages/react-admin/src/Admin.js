import { CoreAdmin } from 'react-admin-core';
import DefaultLayout from './mui/layout/Layout';
import Menu from './mui/layout/Menu';
import Login from './mui/auth/Login';
import Logout from './mui/auth/Logout';
import NotFound from './mui/layout/NotFound';

const Admin = CoreAdmin;

Admin.defaultProps = {
    appLayout: DefaultLayout,
    catchAll: NotFound,
    loginPage: Login,
    logoutButton: Logout,
    menu: Menu,
};

export default Admin;
