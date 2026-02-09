import * as React from 'react';
import fakeRestDataProvider from 'ra-data-fakerest';
import generateData from 'data-generator-retail';
import Admin from './Admin';
import {
    addOfflineSupportToQueryClient,
    Identifier,
    Resource,
    useDataProvider,
    useIsOffline,
    useNotify,
    useRecordContext,
    useRefresh,
} from 'ra-core';
import {
    AppBar,
    Button,
    Create,
    DataTable,
    DateInput,
    Edit,
    EditButton,
    Layout,
    List,
    NumberField,
    NumberInput,
    ReferenceField,
    ReferenceInput,
    Show,
    ShowButton,
    SimpleForm,
    SimpleShowLayout,
    TextField,
    TextInput,
    TitlePortal,
    TopToolbar,
} from 'ra-ui-materialui';
import { onlineManager, QueryClient, useMutation } from '@tanstack/react-query';
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client';
import { createAsyncStoragePersister } from '@tanstack/query-async-storage-persister';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

export default {
    title: 'react-admin/offline',
};

const baseDataProvider = fakeRestDataProvider(generateData(), true, 350);
const dataProvider = {
    ...baseDataProvider,
    emptyStock: ({
        id,
        previousData,
    }: {
        id: Identifier;
        previousData: any;
    }) => {
        return baseDataProvider.update('products', {
            id,
            data: { stock: 0 },
            previousData,
        });
    },
};
type CustomDataProvider = typeof dataProvider;

export const FullApp = () => {
    const queryClient = addOfflineSupportToQueryClient({
        dataProvider,
        queryClient: new QueryClient({
            defaultOptions: {
                queries: {
                    gcTime: 1000 * 60 * 60 * 24, // 24 hours
                },
            },
        }),
        resources: ['products'],
    });

    const asyncStoragePersister = createAsyncStoragePersister({
        storage: localStorage,
    });

    return (
        <PersistQueryClientProvider
            client={queryClient}
            persistOptions={{ persister: asyncStoragePersister }}
            onSuccess={() => {
                // Resume mutations after initial restore from localStorage is successful
                queryClient.resumePausedMutations();
            }}
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
    <Edit
        actions={
            <TopToolbar>
                <ShowButton />
                <EmptyStockButton />
            </TopToolbar>
        }
    >
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
    <Show
        actions={
            <TopToolbar>
                <EditButton />
                <EmptyStockButton />
            </TopToolbar>
        }
    >
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

const EmptyStockButton = () => {
    const dataProvider = useDataProvider<CustomDataProvider>();
    const notify = useNotify();
    const refresh = useRefresh();
    const record = useRecordContext();
    const { mutate, isPending } = useMutation({
        mutationKey: ['emptyStock'],
        mutationFn: (params: {
            id: Identifier;
            previousData: Record<string, unknown>;
        }) => dataProvider.emptyStock(params),
        onSuccess: ({ data }) => {
            notify(`Stock of "${data.reference}" emptied`);
            refresh();
        },
        onError: () => {
            notify('An error occured while emptying the stock');
        },
    });
    if (!record) return null;
    return (
        <Button
            label="Empty stock"
            onClick={() => mutate({ id: record.id, previousData: record })}
            disabled={isPending}
        />
    );
};

const CustomLayout = ({ children }) => (
    <Layout appBar={CustomAppBar}>
        {children}
        <ReactQueryDevtools initialIsOpen={false} />
    </Layout>
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
