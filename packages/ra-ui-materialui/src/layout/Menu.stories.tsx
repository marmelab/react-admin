import * as React from 'react';

import { Resource, testDataProvider } from 'ra-core';
import { defaultTheme, Admin } from 'react-admin';
import { AppBar, Typography, Box } from '@mui/material';
import { createTheme } from '@mui/material/styles';
import { ToggleThemeButton } from '../button';
import { Layout, Menu, SidebarToggleButton, Title } from '.';

export default { title: 'ra-ui-materialui/layout/Menu' };

const resources = ['Posts', 'Comments', 'Tags', 'Users', 'Orders', 'Reviews'];

const DemoAppBar = props => {
    const darkTheme = createTheme({
        palette: { mode: 'dark' },
    });
    return (
        <AppBar
            {...props}
            elevation={1}
            sx={{ flexDirection: 'row', flexWrap: 'nowrap' }}
        >
            <Box sx={{ flex: '1 1 100%' }}>
                <SidebarToggleButton />
            </Box>
            <Box sx={{ flex: '0 0 auto' }}>
                <ToggleThemeButton
                    lightTheme={defaultTheme}
                    darkTheme={darkTheme}
                />
            </Box>
        </AppBar>
    );
};

const DemoList = ({ name }) => (
    <>
        <Title title={name} />
        <Typography variant="h4">{name}</Typography>
    </>
);

export const Default = () => {
    const DefaultLayout = props => (
        <Layout {...props} menu={MenuDefault} appBar={DemoAppBar} />
    );
    const MenuDefault = () => {
        return <Menu hasDashboard={true} dense={false} />;
    };

    return (
        <Admin dataProvider={testDataProvider()} layout={DefaultLayout}>
            {resources.map((resource, index) => {
                return (
                    <Resource
                        name={resource}
                        key={`resource_${index}`}
                        list={<DemoList name={resource} />}
                    />
                );
            })}
        </Admin>
    );
};

export const Dense = () => {
    const LayoutDense = props => (
        <Layout {...props} menu={MenuDense} appBar={DemoAppBar} />
    );
    const MenuDense = props => {
        return <Menu {...props} hasDashboard={true} dense={true} />;
    };

    return (
        <Admin dataProvider={testDataProvider()} layout={LayoutDense}>
            {resources.map((resource, index) => {
                return (
                    <Resource
                        name={resource}
                        key={`resource_${index}`}
                        list={<DemoList name={resource} />}
                    />
                );
            })}
        </Admin>
    );
};
