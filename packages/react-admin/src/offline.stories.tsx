import * as React from 'react';
import fakeRestDataProvider from 'ra-data-fakerest';
import generateData from 'data-generator-retail';
import Admin from './Admin';
import { Resource, useIsOffline } from 'ra-core';
import {
    AppBar,
    Button,
    Create,
    DataTable,
    DateInput,
    Edit,
    Layout,
    List,
    NumberField,
    NumberInput,
    ReferenceField,
    ReferenceInput,
    Show,
    SimpleForm,
    SimpleShowLayout,
    TextField,
    TextInput,
    TitlePortal,
} from 'ra-ui-materialui';
import { onlineManager, QueryClient } from '@tanstack/react-query';
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client';
import { createAsyncStoragePersister } from '@tanstack/query-async-storage-persister';

export default {
    title: 'react-admin/offline',
};

export const FullApp = () => {
    const dataProvider = fakeRestDataProvider(generateData(), true, 350);

    const queryClient = new QueryClient({
        defaultOptions: {
            queries: {
                gcTime: 1000 * 60 * 60 * 24, // 24 hours
            },
        },
    });

    const asyncStoragePersister = createAsyncStoragePersister({
        storage: localStorage,
    });

    return (
        <PersistQueryClientProvider
            client={queryClient}
            persistOptions={{ persister: asyncStoragePersister }}
        >
            <Admin
                dataProvider={dataProvider}
                queryClient={queryClient}
                layout={CustomLayout}
            >
                <Resource
                    name="products"
                    list={ProductList}
                    edit={ProductEdit}
                    create={ProductCreate}
                    show={ProductShow}
                />
            </Admin>
        </PersistQueryClientProvider>
    );
};

const ProductList = () => (
    <List>
        <DataTable>
            <DataTable.Col source="reference" />
            <DataTable.Col source="category_id">
                <ReferenceField source="category_id" reference="categories" />
            </DataTable.Col>
        </DataTable>
    </List>
);

const ProductEdit = () => (
    <Edit>
        <ProductForm />
    </Edit>
);

const ProductCreate = () => (
    <Create
        mutationMode="optimistic"
        transform={data => ({
            id: crypto.randomUUID(),
            ...data,
        })}
    >
        <ProductForm />
    </Create>
);

const ProductForm = () => (
    <SimpleForm>
        <TextInput source="reference" />
        <ReferenceInput source="category_id" reference="categories" />
        <TextInput source="description" />
        <NumberInput source="width" />
        <NumberInput source="height" />
        <NumberInput source="price" />
        <TextInput source="thumbnail" />
        <TextInput source="image" />
        <DateInput source="stock" />
        <NumberInput source="sales" />
    </SimpleForm>
);

const ProductShow = () => (
    <Show>
        <SimpleShowLayout>
            <TextField source="id" />
            <TextField source="reference" />
            <ReferenceField source="category_id" reference="categories" />
            <TextField source="description" />
            <NumberField source="width" />
            <NumberField source="height" />
            <NumberField source="price" />
            <TextField source="thumbnail" />
            <TextField source="image" />
            <NumberField source="stock" />
            <NumberField source="sales" />
        </SimpleShowLayout>
    </Show>
);

const CustomLayout = ({ children }) => (
    <Layout appBar={CustomAppBar}>{children}</Layout>
);

const CustomAppBar = () => {
    const isOffline = useIsOffline();
    return (
        <AppBar color="primary">
            <TitlePortal />
            <Button
                onClick={() => {
                    onlineManager.setOnline(isOffline);
                }}
            >
                {isOffline ? 'Simulate online' : 'Simulate offline'}
            </Button>
        </AppBar>
    );
};
