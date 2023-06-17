import * as React from 'react';

import { Resource, testDataProvider } from 'ra-core';
import { defaultTheme, Admin } from 'react-admin';
import { Typography, ThemeOptions } from '@mui/material';
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
