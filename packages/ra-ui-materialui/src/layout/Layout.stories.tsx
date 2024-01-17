import {
    Box,
    ListItemIcon,
    ListItemText,
    MenuItem,
    MenuList,
    Skeleton,
    ThemeProvider,
    createTheme,
} from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import PeopleIcon from '@mui/icons-material/People';
import {
    AuthContext,
    PreferencesEditorContextProvider,
    StoreContextProvider,
    memoryStore,
} from 'ra-core';
import * as React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MemoryRouter } from 'react-router';

import { defaultTheme } from '../theme/defaultTheme';
import { Layout } from './Layout';
import { Title } from './Title';

export default {
    title: 'ra-ui-materialui/layout/Layout',
};

const Content = () => (
    <Box>
        <Skeleton
            variant="text"
            width="auto"
            sx={{ fontSize: '2rem', mx: 2 }}
            animation={false}
        />
        <Skeleton
            variant="rectangular"
            width="auto"
            height={1500}
            sx={{ mx: 2 }}
            animation={false}
        />
    </Box>
);

const Wrapper = ({
    children = <Content />,
    theme = createTheme(defaultTheme),
    layout: LayoutComponent = Layout,
}) => (
    <MemoryRouter>
        <QueryClientProvider client={new QueryClient()}>
            <ThemeProvider theme={theme}>
                <StoreContextProvider value={memoryStore()}>
                    <PreferencesEditorContextProvider>
                        <AuthContext.Provider value={undefined as any}>
                            <LayoutComponent>
                                {children}
                                <Title title="React Admin" />
                            </LayoutComponent>
                        </AuthContext.Provider>
                    </PreferencesEditorContextProvider>
                </StoreContextProvider>
            </ThemeProvider>
        </QueryClientProvider>
    </MemoryRouter>
);

const Menu = () => (
    <MenuList>
        <MenuItem>
            <ListItemIcon>
                <DashboardIcon />
            </ListItemIcon>
            <ListItemText>Dashboard</ListItemText>
        </MenuItem>
        <MenuItem>
            <ListItemIcon>
                <ShoppingCartIcon />
            </ListItemIcon>
            <ListItemText>Orders</ListItemText>
        </MenuItem>
        <MenuItem>
            <ListItemIcon>
                <PeopleIcon />
            </ListItemIcon>
            <ListItemText>Customers</ListItemText>
        </MenuItem>
    </MenuList>
);

const BasicLayout = ({ children }) => <Layout menu={Menu}>{children}</Layout>;
export const Basic = () => <Wrapper layout={BasicLayout} />;

const AppBarAlwaysOnLayout = ({ children }) => (
    <Layout appBarAlwaysOn menu={Menu}>
        {children}
    </Layout>
);
export const AppBarAlwaysOn = () => <Wrapper layout={AppBarAlwaysOnLayout} />;
