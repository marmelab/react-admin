import * as React from 'react';
import fakeRestProvider from 'ra-data-fakerest';
import { CardContent } from '@mui/material';
import {
    AuthProvider,
    ResourceContextProvider,
    ResourceDefinitionContextProvider,
} from 'ra-core';

import { AdminContext } from '../AdminContext';
import { Datagrid } from '../list';
import { ReferenceArrayField } from './ReferenceArrayField';
import { TextField } from './TextField';
import { Show, SimpleShowLayout } from '../detail';
import { QueryClient } from '@tanstack/react-query';

export default { title: 'ra-ui-materialui/fields/ReferenceArrayField' };

const fakeData = {
    bands: [{ id: 1, name: 'The Beatles', members: [1, 2, 3, 4] }],
    artists: [
        { id: 1, name: 'John Lennon' },
        { id: 2, name: 'Paul McCartney' },
        { id: 3, name: 'Ringo Star' },
        { id: 4, name: 'George Harrison' },
        { id: 5, name: 'Mick Jagger' },
    ],
};
const dataProvider = fakeRestProvider(fakeData, false);

const resouceDefs = {
    artists: {
        name: 'artists',
        hasList: true,
        hasEdit: true,
        hasShow: true,
        hasCreate: true,
        recordRepresentation: 'name',
    },
};
export const Basic = () => (
    <AdminContext dataProvider={dataProvider} defaultTheme="light">
        <ResourceDefinitionContextProvider definitions={resouceDefs}>
            <Show resource="bands" id={1} sx={{ width: 600 }}>
                <SimpleShowLayout>
                    <TextField source="name" />
                    <ReferenceArrayField source="members" reference="artists" />
                </SimpleShowLayout>
            </Show>
        </ResourceDefinitionContextProvider>
    </AdminContext>
);

export const Children = () => (
    <AdminContext dataProvider={dataProvider} defaultTheme="light">
        <ResourceDefinitionContextProvider definitions={resouceDefs}>
            <Show resource="bands" id={1} sx={{ width: 600 }}>
                <SimpleShowLayout>
                    <TextField source="name" />
                    <ReferenceArrayField source="members" reference="artists">
                        <Datagrid bulkActionButtons={false}>
                            <TextField source="id" />
                            <TextField source="name" />
                        </Datagrid>
                    </ReferenceArrayField>
                </SimpleShowLayout>
            </Show>
        </ResourceDefinitionContextProvider>
    </AdminContext>
);

const fakeDataWidthDifferentIdTypes = {
    bands: [{ id: 1, name: 'band_1', members: [1, '2', '3'] }],
    artists: [
        { id: 1, name: 'artist_1' },
        { id: 2, name: 'artist_2' },
        { id: 3, name: 'artist_3' },
        { id: 4, name: 'artist_4' },
    ],
};
const dataProviderWithDifferentIdTypes = fakeRestProvider(
    fakeDataWidthDifferentIdTypes,
    false
);

export const DifferentIdTypes = () => (
    <AdminContext
        dataProvider={dataProviderWithDifferentIdTypes}
        defaultTheme="light"
    >
        <CardContent>
            <Show resource="bands" id={1} sx={{ width: 600 }}>
                <TextField source="name" fullWidth />
                <ReferenceArrayField
                    fullWidth
                    source="members"
                    reference="artists"
                >
                    <Datagrid bulkActionButtons={false}>
                        <TextField source="id" />
                        <TextField source="name" />
                    </Datagrid>
                </ReferenceArrayField>
            </Show>
        </CardContent>
    </AdminContext>
);

const dataProviderWithLog = {
    ...dataProvider,
    getMany: (resource, params) => {
        console.log('getMany', resource, params);
        return dataProvider.getMany(resource, params);
    },
} as any;

export const WithMeta = () => {
    return (
        <AdminContext dataProvider={dataProviderWithLog} defaultTheme="light">
            <CardContent>
                <Show resource="bands" id={1} sx={{ width: 600 }}>
                    <TextField source="name" />
                    <ReferenceArrayField
                        source="members"
                        reference="artists"
                        queryOptions={{
                            meta: { foo: 'bar' },
                        }}
                    >
                        <Datagrid bulkActionButtons={false}>
                            <TextField source="id" />
                            <TextField source="name" />
                        </Datagrid>
                    </ReferenceArrayField>
                </Show>
            </CardContent>
        </AdminContext>
    );
};

export const AccessControl = ({
    initialAuthorizedResources = {
        artists: true,
    },
}: {
    initialAuthorizedResources?: {
        artists: boolean;
    };
}) => {
    const queryClient = new QueryClient();
    return (
        <AdminWithAccessControl
            initialAuthorizedResources={initialAuthorizedResources}
            queryClient={queryClient}
        />
    );
};

const AdminWithAccessControl = ({
    initialAuthorizedResources,
    queryClient,
}: {
    initialAuthorizedResources: { artists: boolean };
    queryClient: QueryClient;
}) => {
    const [authorizedResources, setAuthorizedResources] = React.useState(
        initialAuthorizedResources
    );

    const authProvider: AuthProvider = {
        canAccess: async ({ resource }) => {
            return new Promise(resolve =>
                setTimeout(resolve, 100, authorizedResources[resource])
            );
        },
        logout: () => Promise.reject(new Error('Not implemented')),
        checkError: () => Promise.resolve(),
        checkAuth: () => Promise.resolve(),
        getPermissions: () => Promise.resolve(),
        login: () => Promise.reject(new Error('Not implemented')),
    };

    return (
        <AdminContext
            queryClient={queryClient}
            dataProvider={dataProvider}
            authProvider={authProvider}
        >
            <ResourceContextProvider value="books">
                <AccessControlUI
                    authorizedResources={authorizedResources}
                    setAuthorizedResources={setAuthorizedResources}
                    queryClient={queryClient}
                >
                    <CardContent>
                        <Show resource="bands" id={1} sx={{ width: 600 }}>
                            <TextField source="name" />
                            <ReferenceArrayField
                                source="members"
                                reference="artists"
                                queryOptions={{
                                    meta: { foo: 'bar' },
                                }}
                            >
                                <Datagrid bulkActionButtons={false}>
                                    <TextField source="id" />
                                    <TextField source="name" />
                                </Datagrid>
                            </ReferenceArrayField>
                        </Show>
                    </CardContent>
                </AccessControlUI>
            </ResourceContextProvider>
        </AdminContext>
    );
};

const AccessControlUI = ({
    children,
    setAuthorizedResources,
    authorizedResources,
    queryClient,
}: {
    children: React.ReactNode;
    setAuthorizedResources: Function;
    authorizedResources: {
        artists: boolean;
    };
    queryClient: QueryClient;
}) => {
    return (
        <div>
            <div>
                <label>
                    <input
                        type="checkbox"
                        checked={authorizedResources['artists']}
                        onChange={() => {
                            setAuthorizedResources(state => ({
                                ...state,
                                artists: !authorizedResources['artists'],
                            }));

                            queryClient.clear();
                        }}
                    />
                    artists access
                </label>
            </div>
            <div>{children}</div>
        </div>
    );
};
