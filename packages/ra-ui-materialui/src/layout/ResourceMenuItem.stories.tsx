import * as React from 'react';
import { Resource, testDataProvider, TestMemoryRouter } from 'ra-core';
import { Menu } from './Menu';
import { Layout, LayoutProps } from './Layout';
import { AdminContext } from '../AdminContext';
import { AdminUI } from '../AdminUI';

export default {
    title: 'ra-ui-materialui/layout/ResourceMenuItem',
};

const CustomMenu = () => (
    <Menu>
        <Menu.ResourceItem name="users" />
        <Menu.ResourceItem name="posts" />
    </Menu>
);
const CustomLayout = (props: LayoutProps) => (
    <Layout {...props} menu={CustomMenu} />
);

const dataProvider = testDataProvider({
    getList: () => Promise.resolve({ data: [], total: 0 }),
});

export const Basic = () => (
    <TestMemoryRouter>
        <AdminContext dataProvider={dataProvider}>
            <AdminUI layout={CustomLayout}>
                <Resource name="users" list={<p>The users page</p>} />
                <Resource name="posts" list={<p>The posts page</p>} />
            </AdminUI>
        </AdminContext>
    </TestMemoryRouter>
);

const authProvider: any = {
    getPermissions: () => Promise.resolve([]),
    checkAuth: () => Promise.resolve(),
};

export const InsideAdminChildFunction = () => (
    <TestMemoryRouter>
        <AdminContext dataProvider={dataProvider} authProvider={authProvider}>
            <AdminUI layout={CustomLayout}>
                <Resource name="users" list={<p>The users page</p>} />
                {() =>
                    new Promise(resolve =>
                        setTimeout(
                            resolve,
                            300,
                            <Resource
                                name="posts"
                                list={<p>The posts page</p>}
                            />
                        )
                    )
                }
            </AdminUI>
        </AdminContext>
    </TestMemoryRouter>
);

const authProviderForAccessControl: any = {
    getPermissions: () => Promise.resolve([]),
    checkAuth: () => Promise.resolve(),
    canAccess: ({ resource }) => Promise.resolve(resource !== 'users'),
};

export const AccessControlInsideAdminChildFunction = () => (
    <TestMemoryRouter>
        <AdminContext
            dataProvider={dataProvider}
            authProvider={authProviderForAccessControl}
        >
            <AdminUI layout={CustomLayout}>
                <Resource name="users" list={<p>The users page</p>} />
                {() =>
                    new Promise(resolve =>
                        setTimeout(
                            resolve,
                            300,
                            <Resource
                                name="posts"
                                list={
                                    <>
                                        <p>The posts page</p>
                                        <p>
                                            The menu item for resource "users"
                                            should not be displayed
                                        </p>
                                    </>
                                }
                            />
                        )
                    )
                }
            </AdminUI>
        </AdminContext>
    </TestMemoryRouter>
);

export const AccessControl = () => (
    <TestMemoryRouter>
        <AdminContext
            dataProvider={dataProvider}
            authProvider={authProviderForAccessControl}
        >
            <AdminUI layout={CustomLayout}>
                <Resource name="users" list={<p>The users page</p>} />
                <Resource
                    name="posts"
                    list={
                        <>
                            <p>The posts page</p>
                            <p>
                                The menu item for resource "users" should not be
                                displayed
                            </p>
                        </>
                    }
                />
            </AdminUI>
        </AdminContext>
    </TestMemoryRouter>
);
