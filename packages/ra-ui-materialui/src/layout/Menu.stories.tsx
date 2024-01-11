import * as React from 'react';
import { Resource, CustomRoutes, testDataProvider, memoryStore } from 'ra-core';
import { defaultTheme, Admin, useSidebarState } from 'react-admin';
import {
    Typography,
    Skeleton,
    ThemeOptions,
    MenuItem,
    ListItemText,
    ListItemIcon,
    Divider,
    Collapse,
    List,
    Tooltip,
} from '@mui/material';
import {
    Dashboard,
    PieChartOutlined,
    PeopleOutlined,
    Inventory,
    ExpandLess,
    ExpandMore,
    QrCode,
} from '@mui/icons-material';
import { MemoryRouter, Route } from 'react-router-dom';

import { Layout, Menu, Title } from '.';

export default { title: 'ra-ui-materialui/layout/Menu' };

const resources = ['Posts', 'Comments', 'Tags', 'Users', 'Orders', 'Reviews'];

const darkTheme: ThemeOptions = { ...defaultTheme, palette: { mode: 'dark' } };

const DemoList = ({ name }) => (
    <>
        <Title title={name} />
        <Typography variant="h4">{name}</Typography>
    </>
);

export const Default = () => {
    const MenuDefault = () => <Menu hasDashboard={true} dense={false} />;
    const DefaultLayout = props => <Layout {...props} menu={MenuDefault} />;

    return (
        <Admin
            store={memoryStore()}
            dataProvider={testDataProvider()}
            layout={DefaultLayout}
            darkTheme={darkTheme}
        >
            {resources.map((resource, index) => (
                <Resource
                    name={resource}
                    key={`resource_${index}`}
                    list={<DemoList name={resource} />}
                />
            ))}
        </Admin>
    );
};

export const Dense = () => {
    const MenuDense = () => <Menu hasDashboard={true} dense={true} />;
    const LayoutDense = props => <Layout {...props} menu={MenuDense} />;

    return (
        <Admin
            store={memoryStore()}
            dataProvider={testDataProvider()}
            layout={LayoutDense}
            darkTheme={darkTheme}
        >
            {resources.map((resource, index) => (
                <Resource
                    name={resource}
                    key={`resource_${index}`}
                    list={<DemoList name={resource} />}
                />
            ))}
        </Admin>
    );
};

export const Custom = () => {
    const CustomMenu = () => (
        <Menu>
            <Menu.Item
                to="/"
                leftIcon={<Dashboard />}
                primaryText="Dashboard"
            />
            <Menu.Item
                to="/sales"
                leftIcon={<PieChartOutlined />}
                primaryText="Sales"
            />
            <Menu.Item
                to="/customers"
                leftIcon={<PeopleOutlined />}
                primaryText="Customers"
            />
            <Menu.Item
                to="/products"
                leftIcon={<Inventory />}
                primaryText="Catalog"
            />
        </Menu>
    );
    const CustomLayout = props => <Layout {...props} menu={CustomMenu} />;

    return (
        <MemoryRouter initialEntries={['/']}>
            <Admin dataProvider={testDataProvider()} layout={CustomLayout}>
                <CustomRoutes>
                    <Route path="/" element={<Page title="Dashboard" />} />
                    <Route path="/sales" element={<Page title="Sales" />} />
                    <Route
                        path="/customers"
                        element={<Page title="Customers" />}
                    />
                    <Route
                        path="/products"
                        element={<Page title="Catalog" />}
                    />
                </CustomRoutes>
            </Admin>
        </MemoryRouter>
    );
};

const Page = ({ title }) => (
    <>
        <Typography variant="h5" mt={2}>
            {title}
        </Typography>
        <Skeleton height={300} />
    </>
);

export const MenuItemChild = () => {
    const CustomMenu = () => {
        const [open, setOpen] = React.useState(true);
        const [sidebarOpen] = useSidebarState();

        const handleClick = () => {
            setOpen(!open);
        };
        return (
            <Menu>
                <Menu.Item to="/" primaryText="Dashboard">
                    <ListItemIcon>
                        <Dashboard />
                    </ListItemIcon>
                    <ListItemText>Dashboard</ListItemText>
                    <Typography variant="body2" color="text.secondary">
                        ⌘D
                    </Typography>
                </Menu.Item>
                <Divider />
                <Menu.Item to="/sales" primaryText="Sales">
                    <ListItemIcon>
                        <PieChartOutlined />
                    </ListItemIcon>
                    <ListItemText>Sales</ListItemText>
                </Menu.Item>
                <Menu.Item to="/customers" primaryText="Customers">
                    <ListItemIcon>
                        <PeopleOutlined />
                    </ListItemIcon>
                    <ListItemText>Customers</ListItemText>
                </Menu.Item>
                <Tooltip title="Catalog" placement="right">
                    <MenuItem onClick={handleClick}>
                        <ListItemIcon>
                            <Inventory />
                        </ListItemIcon>
                        <ListItemText>Catalog</ListItemText>
                        {open ? <ExpandLess /> : <ExpandMore />}
                    </MenuItem>
                </Tooltip>
                <Collapse in={open}>
                    <List disablePadding>
                        <Menu.Item
                            to="/products"
                            sx={{ pl: sidebarOpen ? 4 : 2 }}
                            primaryText="Products"
                        >
                            <ListItemIcon>
                                <QrCode />
                            </ListItemIcon>
                            <ListItemText>Products</ListItemText>
                        </Menu.Item>
                    </List>
                </Collapse>
            </Menu>
        );
    };
    const CustomLayout = props => <Layout {...props} menu={CustomMenu} />;

    return (
        <MemoryRouter initialEntries={['/']}>
            <Admin dataProvider={testDataProvider()} layout={CustomLayout}>
                <CustomRoutes>
                    <Route path="/" element={<Page title="Dashboard" />} />
                    <Route path="/sales" element={<Page title="Sales" />} />
                    <Route
                        path="/customers"
                        element={<Page title="Customers" />}
                    />
                    <Route
                        path="/products"
                        element={<Page title="Products" />}
                    />
                </CustomRoutes>
            </Admin>
        </MemoryRouter>
    );
};
