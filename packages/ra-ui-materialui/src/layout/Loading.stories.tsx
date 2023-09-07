import * as React from 'react';
import polyglotI18nProvider from 'ra-i18n-polyglot';
import englishMessages from 'ra-language-english';
import { I18nContextProvider, Resource, testDataProvider } from 'ra-core';
import { MemoryRouter } from 'react-router-dom';

import { AdminContext } from '../AdminContext';
import { AdminUI } from '../AdminUI';
import { Loading } from './Loading';

export default {
    title: 'ra-ui-materialui/layout/Loading',
};

const i18nProvider = polyglotI18nProvider(() => englishMessages, 'en');

export const Basic = () => <Loading />;

export const I18N = () => {
    return (
        <I18nContextProvider value={i18nProvider}>
            <Loading />
        </I18nContextProvider>
    );
};

export const InBox = () => (
    <div
        style={{
            position: 'absolute',
            top: 25,
            left: 40,
            height: 250,
            width: 400,
            border: '1px solid gray',
        }}
    >
        <Loading />
    </div>
);

const authProvider = {
    login: () => Promise.resolve(),
    logout: () => Promise.resolve(),
    checkAuth: () => Promise.resolve(),
    checkError: () => Promise.resolve(),
    getPermissions: () => Promise.resolve(),
};

export const FullApp = () => (
    <MemoryRouter>
        <AdminContext
            dataProvider={testDataProvider()}
            authProvider={authProvider}
            i18nProvider={i18nProvider}
        >
            <AdminUI>
                {async () => {
                    await new Promise(resolve => setTimeout(resolve, 5000));
                    return (
                        <>
                            <Resource name="users" list={UserList} />
                            <Resource name="posts" list={PostList} />
                        </>
                    );
                }}
            </AdminUI>
        </AdminContext>
    </MemoryRouter>
);

const LazyPostList = React.lazy(
    () =>
        new Promise(resolve =>
            // @ts-ignore
            setTimeout(() => resolve({ default: PostList }), 5000)
        )
);

export const LazyPage = () => (
    <MemoryRouter>
        <AdminContext
            dataProvider={testDataProvider()}
            i18nProvider={i18nProvider}
        >
            <AdminUI>
                <Resource name="users" list={UserList} />
                <Resource name="posts" list={LazyPostList} />
            </AdminUI>
        </AdminContext>
    </MemoryRouter>
);

const UserList = () => <div style={{ marginTop: 10 }}>User list</div>;
const PostList = () => <div style={{ marginTop: 10 }}>Post list</div>;
