import * as React from 'react';
import { render } from '@testing-library/react';
import { Resource, testDataProvider } from 'ra-core';
import { Layout, LayoutProps, Menu } from '.';
import { AdminContext } from '../AdminContext';
import { AdminUI } from '../AdminUI';
import { ListGuesser } from '../list';

describe('ResourceMenuItem', () => {
    it('should not throw when used with only <Resource> as <Admin> child', async () => {
        const dataProvider = testDataProvider();
        const CustomMenu = () => (
            <Menu>
                <Menu.ResourceItem name="users" />
            </Menu>
        );
        const CustomLayout = (props: LayoutProps) => (
            <Layout {...props} menu={CustomMenu} />
        );
        const App = () => (
            <AdminContext dataProvider={dataProvider}>
                <AdminUI layout={CustomLayout}>
                    <Resource name="users" list={ListGuesser} />
                </AdminUI>
            </AdminContext>
        );
        render(<App />);
    });
    it('should not throw when used with a Function as <Admin> child', async () => {
        const dataProvider = testDataProvider();
        const authProvider: any = {
            getPermissions: () => Promise.resolve([]),
            checkAuth: () => Promise.resolve(),
        };
        const CustomMenu = () => (
            <Menu>
                <Menu.ResourceItem name="users" />
            </Menu>
        );
        const CustomLayout = (props: LayoutProps) => (
            <Layout {...props} menu={CustomMenu} />
        );
        const App = () => (
            <AdminContext
                dataProvider={dataProvider}
                authProvider={authProvider}
            >
                <AdminUI layout={CustomLayout}>
                    <Resource name="users" list={ListGuesser} />
                    {() => <Resource name="posts" list={ListGuesser} />}
                </AdminUI>
            </AdminContext>
        );
        render(<App />);
    });
});
