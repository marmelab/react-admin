import * as React from 'react';
import { Resource, CustomRoutes, testDataProvider } from 'ra-core';
import { defaultTheme, Admin } from 'react-admin';
import { Typography, Skeleton, ThemeOptions } from '@mui/material';
import {
    Dashboard,
    PieChartOutlined,
    PeopleOutlined,
    Inventory,
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
            <Menu.Item to="/" leftIcon={<Dashboard />}>
                Dashboard
            </Menu.Item>
            <Menu.Item to="/sales" leftIcon={<PieChartOutlined />}>
                Sales
            </Menu.Item>
            <Menu.Item to="/customers" leftIcon={<PeopleOutlined />}>
                Customers
            </Menu.Item>
            <Menu.Item to="/products" leftIcon={<Inventory />}>
                Catalog
            </Menu.Item>
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
