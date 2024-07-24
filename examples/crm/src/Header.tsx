import SettingsIcon from '@mui/icons-material/Settings';
import {
    AppBar,
    Box,
    ListItemIcon,
    ListItemText,
    MenuItem,
    MenuList,
    Tab,
    Tabs,
    Toolbar,
    Typography,
} from '@mui/material';
import {
    LoadingIndicator,
    Logout,
    usePermissions,
    useRedirect,
    UserMenu,
    useUserMenu,
} from 'react-admin';
import { Link, matchPath, useLocation } from 'react-router-dom';
import { useConfigurationContext } from './root/ConfigurationContext';

const Header = () => {
    const { logo, title } = useConfigurationContext();
    const redirect = useRedirect();
    const location = useLocation();
    const { permissions } = usePermissions();

    let currentPath = '/';
    if (!!matchPath('/contacts/*', location.pathname)) {
        currentPath = '/contacts';
    } else if (!!matchPath('/companies/*', location.pathname)) {
        currentPath = '/companies';
    } else if (!!matchPath('/deals/*', location.pathname)) {
        currentPath = '/deals';
    } else if (!!matchPath('/settings', location.pathname)) {
        currentPath = '/settings';
    } else if (!!matchPath('/sales/*', location.pathname)) {
        currentPath = '/sales';
    }

    return (
        <Box component="nav" sx={{ flexGrow: 1 }}>
            <AppBar position="static" color="primary">
                <Toolbar variant="dense">
                    <Box flex={1} display="flex" justifyContent="space-between">
                        <Box
                            display="flex"
                            alignItems="center"
                            onClick={() => redirect('/')}
                            sx={{ cursor: 'pointer' }}
                        >
                            <Box
                                component="img"
                                sx={{
                                    marginRight: '1em',
                                    height: 30,
                                }}
                                src={logo}
                                alt="CRM Logo"
                            />
                            <Typography component="span" variant="h5">
                                {title}
                            </Typography>
                        </Box>
                        <Box>
                            <Tabs
                                value={currentPath}
                                aria-label="Navigation Tabs"
                                indicatorColor="secondary"
                                textColor="inherit"
                            >
                                <Tab
                                    label={'Dashboard'}
                                    component={Link}
                                    to="/"
                                    value="/"
                                />
                                <Tab
                                    label={'Contacts'}
                                    component={Link}
                                    to="/contacts"
                                    value="/contacts"
                                />
                                <Tab
                                    label={'Companies'}
                                    component={Link}
                                    to="/companies"
                                    value="/companies"
                                />
                                <Tab
                                    label={'Deals'}
                                    component={Link}
                                    to="/deals"
                                    value="/deals"
                                />
                                {permissions === 'admin' && (
                                    <Tab
                                        label={'Sales'}
                                        component={Link}
                                        to="/sales"
                                        value="/sales"
                                    />
                                )}
                            </Tabs>
                        </Box>
                        <Box display="flex" alignItems="center">
                            <LoadingIndicator />
                            <UserMenu>
                                <MenuList>
                                    <ConfigurationMenu />
                                    <Logout />
                                </MenuList>
                            </UserMenu>
                        </Box>
                    </Box>
                </Toolbar>
            </AppBar>
        </Box>
    );
};

const ConfigurationMenu = () => {
    const { onClose } = useUserMenu() ?? {};
    return (
        <MenuItem component={Link} to="/settings" onClick={onClose}>
            <ListItemIcon>
                <SettingsIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>My info</ListItemText>
        </MenuItem>
    );
};
export default Header;
