/* eslint react/jsx-key: off */
import * as React from 'react';
import { Admin, Resource, CustomRoutes } from 'react-admin'; // eslint-disable-line import/no-unresolved
import { createRoot } from 'react-dom/client';
import { Route } from 'react-router-dom';
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client';
import { createSyncStoragePersister } from '@tanstack/query-sync-storage-persister';
import authProvider from './authProvider';
import comments from './comments';
import CustomRouteLayout from './customRouteLayout';
import CustomRouteNoLayout from './customRouteNoLayout';
import dataProvider from './dataProvider';
import i18nProvider from './i18nProvider';
import Layout from './Layout';
import posts from './posts';
import users from './users';
import tags from './tags';
import { queryClient } from './queryClient';
import { getOfflineFirstQueryClient } from './getOfflineFirstQueryClient';

const localStoragePersister = createSyncStoragePersister({
    storage: window.localStorage,
});

const offlineFirstQueryClient = getOfflineFirstQueryClient({
    queryClient,
    dataProvider,
    resources: ['posts', 'comments', 'tags', 'users'],
});

const container = document.getElementById('root') as HTMLElement;
const root = createRoot(container);

root.render(
    <React.StrictMode>
        <PersistQueryClientProvider
            client={offlineFirstQueryClient}
            persistOptions={{ persister: localStoragePersister }}
            onSuccess={() => {
                // resume mutations after initial restore from localStorage was successful
                queryClient.resumePausedMutations();
            }}
        >
            <Admin
                authProvider={authProvider}
                dataProvider={dataProvider}
                i18nProvider={i18nProvider}
                queryClient={offlineFirstQueryClient}
                title="Example Admin"
                layout={Layout}
            >
                <Resource name="posts" {...posts} />
                <Resource name="comments" {...comments} />
                <Resource name="tags" {...tags} />
                <Resource name="users" {...users} />
                <CustomRoutes noLayout>
                    <Route
                        path="/custom"
                        element={
                            <CustomRouteNoLayout title="Posts from /custom" />
                        }
                    />
                    <Route
                        path="/custom1"
                        element={
                            <CustomRouteNoLayout title="Posts from /custom1" />
                        }
                    />
                </CustomRoutes>
                <CustomRoutes>
                    <Route
                        path="/custom2"
                        element={
                            <CustomRouteLayout title="Posts from /custom2" />
                        }
                    />
                </CustomRoutes>
                <CustomRoutes>
                    <Route
                        path="/custom3"
                        element={
                            <CustomRouteLayout title="Posts from /custom3" />
                        }
                    />
                </CustomRoutes>
            </Admin>
        </PersistQueryClientProvider>
    </React.StrictMode>
);
