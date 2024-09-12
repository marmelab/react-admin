import * as React from 'react';
import {
    AuthProvider,
    DataProvider,
    Form,
    ResourceContextProvider,
    testDataProvider,
    TestMemoryRouter,
} from 'ra-core';
import polyglotI18nProvider from 'ra-i18n-polyglot';
import englishMessages from 'ra-language-english';
import { Admin, Resource } from 'react-admin';
import fakeRestProvider from 'ra-data-fakerest';

import { AdminContext } from '../AdminContext';
import { Create, Edit } from '../detail';
import { SimpleForm } from '../form';
import { DatagridInput, TextInput } from '../input';
import { TextField } from '../field';
import { ReferenceArrayInput } from './ReferenceArrayInput';
import { AutocompleteArrayInput } from './AutocompleteArrayInput';
import { SelectArrayInput } from './SelectArrayInput';
import { CheckboxGroupInput } from './CheckboxGroupInput';
import { QueryClient } from '@tanstack/react-query';

export default { title: 'ra-ui-materialui/input/ReferenceArrayInput' };

const tags = [
    { id: 0, name: '3D' },
    { id: 1, name: 'Architecture' },
    { id: 2, name: 'Design' },
    { id: 3, name: 'Painting' },
    { id: 4, name: 'Photography' },
];

const dataProvider = testDataProvider({
    // @ts-ignore
    getList: () =>
        Promise.resolve({
            data: tags,
            total: tags.length,
        }),
    // @ts-ignore
    getMany: (resource, params) => {
        console.log('getMany', resource, params);
        return Promise.resolve({
            data: params.ids.map(id => tags.find(tag => tag.id === id)),
        });
    },
});

const i18nProvider = polyglotI18nProvider(() => englishMessages);

export const Basic = () => (
    <TestMemoryRouter initialEntries={['/posts/create']}>
        <Admin dataProvider={dataProvider}>
            <Resource name="tags" recordRepresentation={'name'} />
            <Resource
                name="posts"
                create={() => (
                    <Create
                        resource="posts"
                        record={{ tags_ids: [1, 3] }}
                        sx={{ width: 600 }}
                    >
                        <SimpleForm>
                            <ReferenceArrayInput
                                reference="tags"
                                resource="posts"
                                source="tags_ids"
                            />
                        </SimpleForm>
                    </Create>
                )}
            />
        </Admin>
    </TestMemoryRouter>
);

export const WithAutocompleteInput = () => (
    <AdminContext
        dataProvider={dataProvider}
        i18nProvider={i18nProvider}
        defaultTheme="light"
    >
        <Form onSubmit={() => {}} defaultValues={{ tag_ids: [1, 3] }}>
            <ReferenceArrayInput
                reference="tags"
                resource="posts"
                source="tag_ids"
            >
                <AutocompleteArrayInput optionText="name" />
            </ReferenceArrayInput>
        </Form>
    </AdminContext>
);

export const ErrorAutocomplete = () => (
    <AdminContext
        dataProvider={
            {
                getList: () => Promise.reject(new Error('fetch error')),
                getMany: () =>
                    Promise.resolve({ data: [{ id: 5, name: 'test1' }] }),
            } as unknown as DataProvider
        }
        i18nProvider={i18nProvider}
        defaultTheme="light"
    >
        <Form onSubmit={() => {}} defaultValues={{ tag_ids: [1, 3] }}>
            <ReferenceArrayInput
                reference="tags"
                resource="posts"
                source="tag_ids"
            >
                <AutocompleteArrayInput optionText="name" />
            </ReferenceArrayInput>
        </Form>
    </AdminContext>
);

export const WithSelectArrayInput = () => (
    <AdminContext
        dataProvider={dataProvider}
        i18nProvider={i18nProvider}
        defaultTheme="light"
    >
        <Form onSubmit={() => {}} defaultValues={{ tag_ids: [1, 3] }}>
            <ReferenceArrayInput
                reference="tags"
                resource="posts"
                source="tag_ids"
            >
                <SelectArrayInput optionText="name" />
            </ReferenceArrayInput>
        </Form>
    </AdminContext>
);

export const ErrorSelectArray = () => (
    <AdminContext
        dataProvider={
            {
                getList: () => Promise.reject(new Error('fetch error')),
                getMany: () =>
                    Promise.resolve({ data: [{ id: 5, name: 'test1' }] }),
            } as unknown as DataProvider
        }
        i18nProvider={i18nProvider}
        defaultTheme="light"
    >
        <Form onSubmit={() => {}} defaultValues={{ tag_ids: [1, 3] }}>
            <ReferenceArrayInput
                reference="tags"
                resource="posts"
                source="tag_ids"
            >
                <SelectArrayInput optionText="name" />
            </ReferenceArrayInput>
        </Form>
    </AdminContext>
);

export const WithCheckboxGroupInput = () => (
    <AdminContext
        dataProvider={dataProvider}
        i18nProvider={i18nProvider}
        defaultTheme="light"
    >
        <Form onSubmit={() => {}} defaultValues={{ tag_ids: [1, 3] }}>
            <ReferenceArrayInput
                reference="tags"
                resource="posts"
                source="tag_ids"
            >
                <CheckboxGroupInput optionText="name" />
            </ReferenceArrayInput>
        </Form>
    </AdminContext>
);

export const ErrorCheckboxGroupInput = () => (
    <AdminContext
        dataProvider={
            {
                getList: () => Promise.reject(new Error('fetch error')),
                getMany: () =>
                    Promise.resolve({ data: [{ id: 5, name: 'test1' }] }),
            } as unknown as DataProvider
        }
        i18nProvider={i18nProvider}
        defaultTheme="light"
    >
        <Form onSubmit={() => {}} defaultValues={{ tag_ids: [1, 3] }}>
            <ReferenceArrayInput
                reference="tags"
                resource="posts"
                source="tag_ids"
            >
                <CheckboxGroupInput optionText="name" />
            </ReferenceArrayInput>
        </Form>
    </AdminContext>
);

export const WithDatagridInput = () => (
    <AdminContext
        dataProvider={dataProvider}
        i18nProvider={i18nProvider}
        defaultTheme="light"
    >
        <Form onSubmit={() => {}} defaultValues={{ tag_ids: [1, 3] }}>
            <ReferenceArrayInput
                reference="tags"
                resource="posts"
                source="tag_ids"
            >
                <DatagridInput rowClick="toggleSelection" sx={{ mt: 6 }}>
                    <TextField source="name" />
                </DatagridInput>
            </ReferenceArrayInput>
        </Form>
    </AdminContext>
);

export const ErrorDatagridInput = () => (
    <AdminContext
        dataProvider={
            {
                getList: () => Promise.reject(new Error('fetch error')),
                getMany: () =>
                    Promise.resolve({
                        data: [{ id: 5, name: 'test1' }],
                    }),
            } as unknown as DataProvider
        }
        i18nProvider={i18nProvider}
        defaultTheme="light"
    >
        <Form onSubmit={() => {}} defaultValues={{ tag_ids: [1, 3] }}>
            <ReferenceArrayInput
                reference="tags"
                resource="posts"
                source="tag_ids"
            >
                <DatagridInput rowClick="toggleSelection" sx={{ mt: 6 }}>
                    <TextField source="name" />
                </DatagridInput>
            </ReferenceArrayInput>
        </Form>
    </AdminContext>
);

export const DifferentIdTypes = () => {
    const fakeData = {
        bands: [{ id: 1, name: 'band_1', members: [1, '2'] }],
        artists: [
            { id: 1, name: 'artist_1' },
            { id: 2, name: 'artist_2' },
            { id: 3, name: 'artist_3' },
        ],
    };
    return (
        <AdminContext
            dataProvider={fakeRestProvider(fakeData, false)}
            defaultTheme="light"
        >
            <Edit resource="bands" id={1} sx={{ width: 600 }}>
                <SimpleForm>
                    <TextInput source="name" fullWidth />
                    <ReferenceArrayInput source="members" reference="artists" />
                </SimpleForm>
            </Edit>
        </AdminContext>
    );
};

export const AccessControl = ({
    initialAuthorizedResources = {
        tags: true,
    },
}: {
    initialAuthorizedResources?: {
        tags: boolean;
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
    initialAuthorizedResources: { tags: boolean };
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
            <ResourceContextProvider value="posts">
                <AccessControlUI
                    authorizedResources={authorizedResources}
                    setAuthorizedResources={setAuthorizedResources}
                    queryClient={queryClient}
                >
                    <Create>
                        <SimpleForm>
                            <TextInput source="title" />
                            <ReferenceArrayInput
                                source="tags"
                                reference="tags"
                            />
                        </SimpleForm>
                    </Create>
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
        tags: boolean;
    };
    queryClient: QueryClient;
}) => {
    return (
        <div>
            <div>
                <label>
                    <input
                        type="checkbox"
                        checked={authorizedResources['tags']}
                        onChange={() => {
                            setAuthorizedResources(state => ({
                                ...state,
                                tags: !authorizedResources['tags'],
                            }));

                            queryClient.clear();
                        }}
                    />
                    tags access
                </label>
            </div>
            <div>{children}</div>
        </div>
    );
};
