import {
    AppBar as RaAppBar,
    Box,
    ListItemIcon,
    ListItemText,
    MenuItem,
    MenuList,
    Skeleton,
} from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import PeopleIcon from '@mui/icons-material/People';
import { Resource } from 'ra-core';
import * as React from 'react';

import { AdminContext } from '../AdminContext';
import { AdminUI } from '..';
import { Layout } from './Layout';

export default {
    title: 'ra-ui-materialui/layout/Layout',
};

export const Basic = () => <Wrapper layout={Layout} />;

const CustomMenu = () => (
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

export const Menu = () => (
    <Wrapper
        layout={({ children }) => <Layout menu={CustomMenu}>{children}</Layout>}
    />
);

export const AppBar = () => (
    <Wrapper
        layout={({ children }) => (
            <Layout appBar={() => <RaAppBar>Custom AppBar</RaAppBar>}>
                {children}
            </Layout>
        )}
    />
);

export const AppBarAlwaysOn = () => (
    <Wrapper
        layout={({ children }) => <Layout appBarAlwaysOn>{children}</Layout>}
    />
);

export const ErrorDefault = () => (
    <Wrapper
        layout={Layout}
        content={() => {
            throw new Error('Client error');
        }}
    />
);

export const ErrorCustom = () => (
    <Wrapper
        layout={({ children }) => (
            <Layout
                error={({ error }) => (
                    <div>
                        <h1>Custom error</h1>
                        <p>{error.message}</p>
                    </div>
                )}
            >
                {children}
            </Layout>
        )}
        content={() => {
            throw new Error('Client error');
        }}
    />
);

const DefaultContent = () => (
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
    layout: LayoutComponent,
    content: ContentComponent = DefaultContent,
}) => (
    <AdminContext>
        <AdminUI layout={LayoutComponent}>
            <Resource name="posts" list={ContentComponent} />
        </AdminUI>
    </AdminContext>
);
