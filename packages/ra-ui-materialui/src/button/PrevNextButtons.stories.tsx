import * as React from 'react';
import fakeRestDataProvider from 'ra-data-fakerest';
import {
    RecordContextProvider,
    Resource,
    ResourceContext,
    testDataProvider,
    TestMemoryRouter,
} from 'ra-core';
import englishMessages from 'ra-language-english';
import polyglotI18nProvider from 'ra-i18n-polyglot';
import { seed, address, internet, name } from 'faker/locale/en_GB';
import { QueryClient } from '@tanstack/react-query';

import {
    AdminUI,
    AdminContext,
    Edit,
    EditButton,
    ListGuesser,
    Show,
    ShowButton,
    SimpleForm,
    SimpleShowLayout,
    TextField,
    TextInput,
    TopToolbar,
} from '../';
import { PrevNextButtons } from './PrevNextButtons';

export default { title: 'ra-ui-materialui/button/PrevNextButtons' };

const i18nProvider = polyglotI18nProvider(() => englishMessages, 'en');

seed(123); // we want consistent results

const data = {
    customers: Array.from(Array(900).keys()).map(id => {
        const first_name = name.firstName();
        const last_name = name.lastName();
        const email = internet.email(first_name, last_name);

        return {
            id,
            first_name,
            last_name,
            email,
            city: address.city(),
        };
    }),
};

const dataProvider = fakeRestDataProvider(
    data,
    process.env.NODE_ENV !== 'test'
);

const MyTopToolbar = ({ children }) => (
    <TopToolbar sx={{ justifyContent: 'space-between' }}>{children}</TopToolbar>
);

const CustomerEdit = ({ actions }: any) => (
    <Edit redirect={false} actions={actions}>
        <SimpleForm warnWhenUnsavedChanges>
            <TextInput source="first_name" key="first_name" />
            <TextInput source="last_name" key="last_name" />
            <TextInput source="email" key="email" />
            <TextInput source="city" key="city" />
        </SimpleForm>
    </Edit>
);

const CustomerShow = ({ actions }: any) => (
    <Show actions={actions}>
        <SimpleShowLayout>
            <TextField source="id" key="id" />
            <TextField source="first_name" key="first_name" />
            <TextField source="last_name" key="last_name" />
            <TextField source="email" key="email" />
            <TextField source="city" key="city" />
        </SimpleShowLayout>
    </Show>
);

export const Basic = () => (
    <TestMemoryRouter>
        <AdminContext dataProvider={dataProvider} i18nProvider={i18nProvider}>
            <AdminUI>
                <Resource
                    name="customers"
                    list={<ListGuesser />}
                    edit={
                        <CustomerEdit
                            actions={
                                <MyTopToolbar>
                                    <PrevNextButtons />
                                    <ShowButton />
                                </MyTopToolbar>
                            }
                        />
                    }
                    show={
                        <CustomerShow
                            actions={
                                <MyTopToolbar>
                                    <PrevNextButtons linkType="show" />
                                    <EditButton />
                                </MyTopToolbar>
                            }
                        />
                    }
                />
            </AdminUI>
        </AdminContext>
    </TestMemoryRouter>
);

export const WithStoreKey = () => (
    <TestMemoryRouter>
        <AdminContext dataProvider={dataProvider} i18nProvider={i18nProvider}>
            <AdminUI>
                <Resource
                    name="customers"
                    list={<ListGuesser storeKey="withStoreKey" />}
                    edit={
                        <CustomerEdit
                            actions={
                                <MyTopToolbar>
                                    <PrevNextButtons storeKey="withStoreKey" />
                                    <ShowButton />
                                </MyTopToolbar>
                            }
                        />
                    }
                    show={
                        <CustomerShow
                            actions={
                                <MyTopToolbar>
                                    <PrevNextButtons
                                        linkType="show"
                                        storeKey="withStoreKey"
                                    />
                                    <EditButton />
                                </MyTopToolbar>
                            }
                        />
                    }
                />
            </AdminUI>
        </AdminContext>
    </TestMemoryRouter>
);

export const WithFilter = () => (
    <TestMemoryRouter>
        <AdminContext dataProvider={dataProvider} i18nProvider={i18nProvider}>
            <AdminUI>
                <Resource
                    name="customers"
                    list={
                        <ListGuesser
                            filter={{ city_q: 'East A' }}
                            sort={{ field: 'first_name', order: 'DESC' }}
                        />
                    }
                    edit={
                        <CustomerEdit
                            actions={
                                <MyTopToolbar>
                                    <PrevNextButtons
                                        sort={{
                                            field: 'first_name',
                                            order: 'DESC',
                                        }}
                                        filter={{ city_q: 'East A' }}
                                    />
                                    <ShowButton />
                                </MyTopToolbar>
                            }
                        />
                    }
                    show={
                        <CustomerShow
                            actions={
                                <MyTopToolbar>
                                    <PrevNextButtons
                                        linkType="show"
                                        sort={{
                                            field: 'first_name',
                                            order: 'DESC',
                                        }}
                                        filter={{ city_q: 'East A' }}
                                    />
                                    <EditButton />
                                </MyTopToolbar>
                            }
                        />
                    }
                />
            </AdminUI>
        </AdminContext>
    </TestMemoryRouter>
);

export const WithQueryFilter = () => (
    <TestMemoryRouter>
        <AdminContext dataProvider={dataProvider} i18nProvider={i18nProvider}>
            <AdminUI>
                <Resource
                    name="customers"
                    list={
                        <ListGuesser
                            filters={[
                                <TextInput
                                    label="Search"
                                    source="q"
                                    alwaysOn
                                />,
                            ]}
                        />
                    }
                    edit={
                        <CustomerEdit
                            actions={
                                <MyTopToolbar>
                                    <PrevNextButtons />
                                    <ShowButton />
                                </MyTopToolbar>
                            }
                        />
                    }
                    show={
                        <CustomerShow
                            actions={
                                <MyTopToolbar>
                                    <PrevNextButtons linkType="show" />
                                    <EditButton />
                                </MyTopToolbar>
                            }
                        />
                    }
                />
            </AdminUI>
        </AdminContext>
    </TestMemoryRouter>
);

export const WithLimit = ({ customDataProvider = dataProvider }) => (
    <TestMemoryRouter>
        <AdminContext
            dataProvider={customDataProvider}
            i18nProvider={i18nProvider}
        >
            <AdminUI>
                <Resource
                    name="customers"
                    list={<ListGuesser />}
                    edit={
                        <CustomerEdit
                            actions={
                                <MyTopToolbar>
                                    <PrevNextButtons limit={500} />
                                    <ShowButton />
                                </MyTopToolbar>
                            }
                        />
                    }
                    show={
                        <CustomerShow
                            actions={
                                <MyTopToolbar>
                                    <PrevNextButtons
                                        linkType="show"
                                        limit={500}
                                    />
                                    <EditButton />
                                </MyTopToolbar>
                            }
                        />
                    }
                />
            </AdminUI>
        </AdminContext>
    </TestMemoryRouter>
);

export const WithStyle = () => (
    <AdminContext dataProvider={dataProvider}>
        <ResourceContext.Provider value="customers">
            <RecordContextProvider value={data.customers[0]}>
                <PrevNextButtons sx={{ color: 'blue' }} />
                <PrevNextButtons
                    linkType="show"
                    sx={{ marginBottom: '20px', color: 'red' }}
                />
            </RecordContextProvider>
        </ResourceContext.Provider>
    </AdminContext>
);

export const ErrorState = () => (
    <AdminContext
        dataProvider={testDataProvider({
            getList: () => Promise.reject('Error'),
        })}
        queryClient={
            new QueryClient({ defaultOptions: { queries: { retry: false } } })
        }
    >
        <ResourceContext.Provider value="customers">
            <RecordContextProvider value={data.customers[0]}>
                <PrevNextButtons />
            </RecordContextProvider>
        </ResourceContext.Provider>
    </AdminContext>
);

export const LoadingState = () => (
    <AdminContext
        dataProvider={testDataProvider({
            getList: () => new Promise(() => {}),
        })}
    >
        <ResourceContext.Provider value="customers">
            <RecordContextProvider value={data.customers[0]}>
                <PrevNextButtons />
            </RecordContextProvider>
        </ResourceContext.Provider>
    </AdminContext>
);
