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
    useGetIdentity,
    useGetOne,
    UserMenu,
    useUserMenu,
} from 'react-admin';
import { Link, matchPath, useLocation } from 'react-router-dom';
import { Sale } from './types';

const Header = () => {
    const location = useLocation();
    const { identity } = useGetIdentity();
    const user = useGetOne<Sale>('sales', { id: identity?.id });

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
                        <Box display="flex" alignItems="center">
                            <Box
                                component="img"
                                sx={{ marginRight: '1em', height: 30 }}
                                src={
                                    'https://upload.wikimedia.org/wikipedia/commons/a/a7/React-icon.svg'
                                }
                                alt="Bosch Logo"
                            />
                            <Typography component="span" variant="h5">
                                Atomic CRM
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
                                {user?.data?.administrator && (
                                    <Tab
                                        label={'Account Managers'}
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
