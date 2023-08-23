import * as React from 'react';
import fakeRestDataProvider from 'ra-data-fakerest';
import {
    RecordContextProvider,
    Resource,
    ResourceContext,
    testDataProvider,
} from 'ra-core';
import {
    AdminUI,
    Edit,
    EditButton,
    ListGuesser,
    PrevNextButtons,
    Show,
    ShowButton,
    SimpleForm,
    SimpleShowLayout,
    TextField,
    TextInput,
    TopToolbar,
} from 'react-admin';
import englishMessages from 'ra-language-english';
import polyglotI18nProvider from 'ra-i18n-polyglot';
import { MemoryRouter } from 'react-router';
import { seed, address, internet, name } from 'faker/locale/en_GB';
import { QueryClient } from 'react-query';

import { AdminContext } from '../AdminContext';

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

const dataProvider = fakeRestDataProvider(data);

const MyTopToolbar = ({ children }) => (
    <TopToolbar
        sx={{
            justifyContent: 'space-between',
        }}
    >
        {children}
    </TopToolbar>
);

const defaultFields = [
    <TextField source="id" key="id" />,
    <TextField source="first_name" key="first_name" />,
    <TextField source="last_name" key="last_name" />,
    <TextField source="email" key="email" />,
    <TextField source="city" key="city" />,
];

const defaultInputs = [
    <TextInput source="first_name" key="first_name" />,
    <TextInput source="last_name" key="last_name" />,
    <TextInput source="email" key="email" />,
    <TextInput source="city" key="city" />,
];

const DefaultSimpleForm = () => (
    <SimpleForm warnWhenUnsavedChanges>{defaultInputs}</SimpleForm>
);
const DefaultSimpleShowLayout = () => (
    <SimpleShowLayout>{defaultFields}</SimpleShowLayout>
);

export const Basic = () => (
    <MemoryRouter>
        <AdminContext dataProvider={dataProvider} i18nProvider={i18nProvider}>
            <AdminUI>
                <Resource
                    name="customers"
                    list={<ListGuesser />}
                    edit={
                        <Edit
                            redirect={false}
                            actions={
                                <MyTopToolbar>
                                    <PrevNextButtons />
                                    <ShowButton />
                                </MyTopToolbar>
                            }
                        >
                            <DefaultSimpleForm />
                        </Edit>
                    }
                    show={
                        <Show
                            actions={
                                <MyTopToolbar>
                                    <PrevNextButtons linkType="show" />
                                </MyTopToolbar>
                            }
                        >
                            <DefaultSimpleShowLayout />
                        </Show>
                    }
                />
            </AdminUI>
        </AdminContext>
    </MemoryRouter>
);

export const WithStoreKey = () => (
    <MemoryRouter>
        <AdminContext dataProvider={dataProvider} i18nProvider={i18nProvider}>
            <AdminUI>
                <Resource
                    name="customers"
                    list={<ListGuesser storeKey="withStoreKey" />}
                    edit={
                        <Edit
                            redirect={false}
                            actions={
                                <MyTopToolbar>
                                    <PrevNextButtons storeKey="withStoreKey" />
                                    <ShowButton />
                                </MyTopToolbar>
                            }
                        >
                            <DefaultSimpleForm />
                        </Edit>
                    }
                    show={
                        <Show
                            actions={
                                <MyTopToolbar>
                                    <PrevNextButtons
                                        linkType="show"
                                        storeKey="withStoreKey"
                                    />
                                    <EditButton />
                                </MyTopToolbar>
                            }
                        >
                            <DefaultSimpleShowLayout />
                        </Show>
                    }
                />
            </AdminUI>
        </AdminContext>
    </MemoryRouter>
);

export const WithFilter = () => (
    <MemoryRouter>
        <AdminContext dataProvider={dataProvider} i18nProvider={i18nProvider}>
            <AdminUI>
                <Resource
                    name="customers"
                    list={
                        <ListGuesser
                            filter={{ q: 'East a' }}
                            sort={{ field: 'first_name', order: 'DESC' }}
                        />
                    }
                    edit={
                        <Edit
                            redirect={false}
                            actions={
                                <MyTopToolbar>
                                    <PrevNextButtons
                                        sort={{
                                            field: 'first_name',
                                            order: 'DESC',
                                        }}
                                        filter={{ q: 'East a' }}
                                    />
                                    <ShowButton />
                                </MyTopToolbar>
                            }
                        >
                            <DefaultSimpleForm />
                        </Edit>
                    }
                    show={
                        <Show
                            actions={
                                <MyTopToolbar>
                                    <PrevNextButtons
                                        linkType="show"
                                        sort={{
                                            field: 'first_name',
                                            order: 'DESC',
                                        }}
                                        filter={{ q: 'East a' }}
                                    />
                                    <EditButton />
                                </MyTopToolbar>
                            }
                        >
                            <DefaultSimpleShowLayout />
                        </Show>
                    }
                />
            </AdminUI>
        </AdminContext>
    </MemoryRouter>
);

export const WithQueryFilter = () => (
    <MemoryRouter>
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
                        <Edit
                            redirect={false}
                            actions={
                                <MyTopToolbar>
                                    <PrevNextButtons />
                                    <ShowButton />
                                </MyTopToolbar>
                            }
                        >
                            <DefaultSimpleForm />
                        </Edit>
                    }
                    show={
                        <Show
                            actions={
                                <MyTopToolbar>
                                    <PrevNextButtons linkType="show" />
                                    <EditButton />
                                </MyTopToolbar>
                            }
                        >
                            <DefaultSimpleShowLayout />
                        </Show>
                    }
                />
            </AdminUI>
        </AdminContext>
    </MemoryRouter>
);

export const WithLimit = ({ customDataProvider = dataProvider }) => (
    <MemoryRouter>
        <AdminContext
            dataProvider={customDataProvider}
            i18nProvider={i18nProvider}
        >
            <AdminUI>
                <Resource
                    name="customers"
                    list={<ListGuesser />}
                    edit={
                        <Edit
                            redirect={false}
                            actions={
                                <MyTopToolbar>
                                    <PrevNextButtons limit={500} />
                                    <ShowButton />
                                </MyTopToolbar>
                            }
                        >
                            <DefaultSimpleForm />
                        </Edit>
                    }
                    show={
                        <Show
                            actions={
                                <MyTopToolbar>
                                    <PrevNextButtons
                                        linkType="show"
                                        limit={500}
                                    />
                                    <ShowButton />
                                </MyTopToolbar>
                            }
                        >
                            <DefaultSimpleShowLayout />
                        </Show>
                    }
                />
            </AdminUI>
        </AdminContext>
    </MemoryRouter>
);

export const WithStyle = () => (
    <AdminContext dataProvider={dataProvider}>
        <ResourceContext.Provider value="customers">
            <RecordContextProvider value={data.customers[0]}>
                <PrevNextButtons
                    sx={{
                        color: 'blue',
                    }}
                />
                <PrevNextButtons
                    linkType="show"
                    sx={{
                        '& .RaPrevNextButton-list': {
                            marginBottom: '20px',
                            color: 'red',
                        },
                    }}
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
