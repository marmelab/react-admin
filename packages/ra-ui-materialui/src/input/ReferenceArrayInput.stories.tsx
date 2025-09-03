import * as React from 'react';
import {
    DataProvider,
    Form,
    Resource,
    testDataProvider,
    TestMemoryRouter,
    useIsOffline,
} from 'ra-core';
import polyglotI18nProvider from 'ra-i18n-polyglot';
import englishMessages from 'ra-language-english';
import fakeRestProvider from 'ra-data-fakerest';

import { AdminContext } from '../AdminContext';
import { AdminUI } from '../AdminUI';
import { Create, Edit } from '../detail';
import { SimpleForm } from '../form';
import { DatagridInput, TextInput } from '../input';
import { TextField } from '../field';
import { ReferenceArrayInput } from './ReferenceArrayInput';
import { AutocompleteArrayInput } from './AutocompleteArrayInput';
import { SelectArrayInput } from './SelectArrayInput';
import { CheckboxGroupInput } from './CheckboxGroupInput';
import { onlineManager } from '@tanstack/react-query';
import { List, Datagrid } from '../list';

export default { title: 'ra-ui-materialui/input/ReferenceArrayInput' };

const tags = [
    { id: 0, name: '3D' },
    { id: 1, name: 'Architecture' },
    { id: 2, name: 'Design' },
    { id: 3, name: 'Painting' },
    { id: 4, name: 'Photography' },
];

const dataProvider = testDataProvider({
    getList: () =>
        // @ts-ignore
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
        <AdminContext dataProvider={dataProvider}>
            <AdminUI>
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
            </AdminUI>
        </AdminContext>
    </TestMemoryRouter>
);

export const AsFilters = () => {
    const fakeData = {
        bands: [
            { id: 1, name: 'band_1', members: [2] },
            { id: 2, name: 'band_2', members: [3] },
        ],
        artists: [
            { id: 1, name: 'artist_1' },
            { id: 2, name: 'artist_2' },
            { id: 3, name: 'artist_3' },
        ],
    };
    return (
        <TestMemoryRouter initialEntries={['/bands']}>
            <AdminContext
                dataProvider={fakeRestProvider(fakeData, false)}
                i18nProvider={i18nProvider}
            >
                <AdminUI>
                    <Resource name="tags" recordRepresentation={'name'} />
                    <Resource
                        name="bands"
                        list={() => (
                            <List
                                filters={[
                                    <ReferenceArrayInput
                                        alwaysOn
                                        key="test"
                                        reference="artists"
                                        source="members"
                                    />,
                                ]}
                            >
                                <Datagrid>
                                    <TextField source="name" />
                                </Datagrid>
                            </List>
                        )}
                    />
                </AdminUI>
            </AdminContext>
        </TestMemoryRouter>
    );
};

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

export const Offline = () => {
    const fakeData = {
        bands: [{ id: 1, name: 'band_1', members: [1, '2'] }],
        artists: [
            { id: 1, name: 'artist_1' },
            { id: 2, name: 'artist_2' },
            { id: 3, name: 'artist_3' },
        ],
    };
    return (
        <TestMemoryRouter>
            <AdminContext
                dataProvider={fakeRestProvider(
                    fakeData,
                    process.env.NODE_ENV !== 'test'
                )}
                i18nProvider={i18nProvider}
            >
                <>
                    <Edit resource="bands" id={1} sx={{ width: 600 }}>
                        <SimpleForm>
                            <RenderChildOnDemand>
                                <ReferenceArrayInput
                                    source="members"
                                    reference="artists"
                                />
                            </RenderChildOnDemand>
                        </SimpleForm>
                    </Edit>
                    <p>
                        <SimulateOfflineButton />
                    </p>
                </>
            </AdminContext>
        </TestMemoryRouter>
    );
};

const SimulateOfflineButton = () => {
    const isOffline = useIsOffline();
    return (
        <button
            type="button"
            onClick={() => onlineManager.setOnline(isOffline)}
        >
            {isOffline ? 'Simulate online' : 'Simulate offline'}
        </button>
    );
};

const RenderChildOnDemand = ({ children }) => {
    const [showChild, setShowChild] = React.useState(false);
    return (
        <>
            <button type="button" onClick={() => setShowChild(!showChild)}>
                Toggle Child
            </button>
            {showChild && <div>{children}</div>}
        </>
    );
};
