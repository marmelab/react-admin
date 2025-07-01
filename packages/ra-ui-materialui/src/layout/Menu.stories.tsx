import * as React from 'react';
import {
    Resource,
    CustomRoutes,
    testDataProvider,
    memoryStore,
    TestMemoryRouter,
} from 'ra-core';
import { Admin, useSidebarState } from 'react-admin';
import {
    Typography,
    Skeleton,
    MenuItem,
    ListItemText,
    ListItemIcon,
    Divider,
    Collapse,
    List,
    Tooltip,
} from '@mui/material';
import Dashboard from '@mui/icons-material/Dashboard';
import PieChartOutlined from '@mui/icons-material/PieChartOutlined';
import PeopleOutlined from '@mui/icons-material/PeopleOutlined';
import Inventory from '@mui/icons-material/Inventory';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import QrCode from '@mui/icons-material/QrCode';
import { Route } from 'react-router-dom';

import { Layout, Menu, MenuItemLinkClasses, Title } from '.';

export default { title: 'ra-ui-materialui/layout/Menu' };

const resources = ['Posts', 'Comments', 'Tags', 'Users', 'Orders', 'Reviews'];

const DemoList = ({ name }) => (
    <>
        <Title title={name} />
        <Typography variant="h4">{name}</Typography>
    </>
);

export const Default = () => {
    const MenuDefault = () => <Menu hasDashboard={true} dense={false} />;
    const DefaultLayout = ({ children }) => (
        <Layout menu={MenuDefault}>{children}</Layout>
    );

    return (
        <Admin
            store={memoryStore()}
            dataProvider={testDataProvider()}
            layout={DefaultLayout}
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

export const WithDashboard = () => {
    const MenuDefault = () => <Menu hasDashboard={true} dense={false} />;
    const DefaultLayout = ({ children }) => (
        <Layout menu={MenuDefault}>{children}</Layout>
    );
    const Dashboard = () => <Page title="Dashboard" />;

    return (
        <Admin
            store={memoryStore()}
            dataProvider={testDataProvider()}
            layout={DefaultLayout}
            dashboard={Dashboard}
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
    const LayoutDense = ({ children }) => (
        <Layout menu={MenuDense}>{children}</Layout>
    );

    return (
        <Admin
            store={memoryStore()}
            dataProvider={testDataProvider()}
            layout={LayoutDense}
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
    const CustomLayout = ({ children }) => (
        <Layout menu={CustomMenu}>{children}</Layout>
    );

    return (
        <TestMemoryRouter initialEntries={['/']}>
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
        </TestMemoryRouter>
    );
};

export const WithKeyboardShortcuts = () => {
    const CustomMenu = () => (
        <Menu>
            <Menu.DashboardItem keyboardShortcut="G>D" />
            <Menu.Item
                to="/sales"
                leftIcon={<PieChartOutlined />}
                primaryText="Sales"
                keyboardShortcut="G>S"
            />
            <Menu.Item
                to="/customers"
                leftIcon={<PeopleOutlined />}
                primaryText="Customers very long"
                keyboardShortcut="G>C"
            />
            <Menu.ResourceItem
                name="products"
                leftIcon={<Inventory />}
                keyboardShortcut="G>P"
            />
        </Menu>
    );
    const CustomLayout = ({ children }) => (
        <Layout menu={CustomMenu}>{children}</Layout>
    );

    const Dashboard = () => <Page title="Dashboard" />;
    return (
        <TestMemoryRouter initialEntries={['/']}>
            <Admin
                dataProvider={testDataProvider()}
                layout={CustomLayout}
                dashboard={Dashboard}
            >
                <Resource name="products" list={<Page title="Products" />} />
                <CustomRoutes>
                    <Route path="/sales" element={<Page title="Sales" />} />
                    <Route
                        path="/customers"
                        element={<Page title="Customers" />}
                    />
                </CustomRoutes>
            </Admin>
        </TestMemoryRouter>
    );
};

export const WithCustomKeyboardShortcutRepresentation = () => {
    const CustomMenu = () => (
        <Menu>
            <Menu.DashboardItem
                keyboardShortcut="ctrl+alt+D"
                keyboardShortcutRepresentation="ctrl+alt+D"
            />
            <Menu.Item
                to="/sales"
                leftIcon={<PieChartOutlined />}
                primaryText="Sales"
                keyboardShortcut="ctrl+alt+S"
                keyboardShortcutRepresentation="ctrl+alt+S"
            />
            <Menu.Item
                to="/customers"
                leftIcon={<PeopleOutlined />}
                primaryText="Customers very long"
                keyboardShortcut="ctrl+alt+C"
                keyboardShortcutRepresentation="ctrl+alt+C"
            />
            <Menu.ResourceItem
                name="products"
                leftIcon={<Inventory />}
                keyboardShortcut="ctrl+alt+P"
                keyboardShortcutRepresentation="ctrl+alt+P"
            />
        </Menu>
    );
    const CustomLayout = ({ children }) => (
        <Layout menu={CustomMenu}>{children}</Layout>
    );

    const Dashboard = () => <Page title="Dashboard" />;
    return (
        <TestMemoryRouter initialEntries={['/']}>
            <Admin
                dataProvider={testDataProvider()}
                layout={CustomLayout}
                dashboard={Dashboard}
            >
                <Resource name="products" list={<Page title="Products" />} />
                <CustomRoutes>
                    <Route path="/sales" element={<Page title="Sales" />} />
                    <Route
                        path="/customers"
                        element={<Page title="Customers" />}
                    />
                </CustomRoutes>
            </Admin>
        </TestMemoryRouter>
    );
};

export const WithCustomKeyboardShortcutRepresentationUsingMenuItemClasses =
    () => {
        const CustomMenu = () => (
            <Menu>
                <Menu.DashboardItem
                    keyboardShortcut="ctrl+alt+D"
                    keyboardShortcutRepresentation={
                        <div className={MenuItemLinkClasses.shortcut}>
                            ctrl+alt+D
                        </div>
                    }
                />
                <Menu.Item
                    to="/sales"
                    leftIcon={<PieChartOutlined />}
                    primaryText="Sales"
                    keyboardShortcut="ctrl+alt+S"
                    keyboardShortcutRepresentation={
                        <div className={MenuItemLinkClasses.shortcut}>
                            ctrl+alt+S
                        </div>
                    }
                />
                <Menu.Item
                    to="/customers"
                    leftIcon={<PeopleOutlined />}
                    primaryText="Customers very long"
                    keyboardShortcut="ctrl+alt+C"
                    keyboardShortcutRepresentation={
                        <div className={MenuItemLinkClasses.shortcut}>
                            ctrl+alt+C
                        </div>
                    }
                />
                <Menu.ResourceItem
                    name="products"
                    leftIcon={<Inventory />}
                    keyboardShortcut="ctrl+alt+P"
                    keyboardShortcutRepresentation={
                        <div className={MenuItemLinkClasses.shortcut}>
                            ctrl+alt+P
                        </div>
                    }
                />
            </Menu>
        );
        const CustomLayout = ({ children }) => (
            <Layout menu={CustomMenu}>{children}</Layout>
        );

        const Dashboard = () => <Page title="Dashboard" />;
        return (
            <TestMemoryRouter initialEntries={['/']}>
                <Admin
                    dataProvider={testDataProvider()}
                    layout={CustomLayout}
                    dashboard={Dashboard}
                >
                    <Resource
                        name="products"
                        list={<Page title="Products" />}
                    />
                    <CustomRoutes>
                        <Route path="/sales" element={<Page title="Sales" />} />
                        <Route
                            path="/customers"
                            element={<Page title="Customers" />}
                        />
                    </CustomRoutes>
                </Admin>
            </TestMemoryRouter>
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
    const CustomLayout = ({ children }) => (
        <Layout menu={CustomMenu}>{children}</Layout>
    );

    return (
        <TestMemoryRouter initialEntries={['/']}>
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
        </TestMemoryRouter>
    );
};
