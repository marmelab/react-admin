import * as React from 'react';
import { AdminContext } from '../AdminContext';
import fakeRestDataProvider from 'ra-data-fakerest';
import { Resource } from 'ra-core';
import {
    AdminUI,
    Create,
    Datagrid,
    Edit,
    EditButton,
    List,
    PrevNextButton,
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

export default { title: 'ra-ui-materialui/button/PrevNextButton' };

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

const dataProvider = fakeRestDataProvider({
    ...data,
    ...{
        customers: [
            // add some persisted customers to the data
            ...data.customers,
            ...[
                {
                    id: 901,
                    first_name: 'Martin',
                    last_name: 'McFly',
                    email: 'Martin.McFly@yahoo.com',
                    city: 'Hill Valley',
                },
                {
                    id: 902,
                    first_name: 'Emmett',
                    last_name: 'Brown',
                    email: 'Emmett.Brown@yahoo.com',
                    city: 'Hill Valley',
                },
                {
                    id: 903,
                    first_name: 'Biff',
                    last_name: 'Tannen',
                    email: 'Biff.Tannen@yahoo.com',
                    city: 'Hill Valley',
                },
                {
                    id: 904,
                    first_name: 'Clara',
                    last_name: 'Clayton',
                    email: 'Clara.Clayton@yahoo.com',
                    city: 'Hill Valley',
                },
                {
                    id: 905,
                    first_name: 'Martin',
                    last_name: 'Scorsese',
                    email: 'Martin.Scorsese@yahoo.com',
                    city: 'New York',
                },
            ],
        ],
    },
});

const MyTopToolbar = ({ children }) => (
    <TopToolbar
        sx={{
            justifyContent: 'space-between',
        }}
    >
        {children}
    </TopToolbar>
);

const defaultFiedls = [
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

export const Basic = () => (
    <MemoryRouter>
        <AdminContext dataProvider={dataProvider} i18nProvider={i18nProvider}>
            <AdminUI>
                <Resource
                    name="customers"
                    list={
                        <List>
                            <Datagrid rowClick="edit">{defaultFiedls}</Datagrid>
                        </List>
                    }
                    edit={
                        <Edit
                            actions={
                                <MyTopToolbar>
                                    <PrevNextButton />
                                    <ShowButton />
                                </MyTopToolbar>
                            }
                        >
                            <SimpleForm>{defaultInputs}</SimpleForm>
                        </Edit>
                    }
                    show={
                        <Show
                            actions={
                                <MyTopToolbar>
                                    <PrevNextButton />
                                    <PrevNextButton linkType="show" />
                                </MyTopToolbar>
                            }
                        >
                            <SimpleShowLayout>{defaultFiedls}</SimpleShowLayout>
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
                    list={
                        <List storeKey="withStoreKey">
                            <Datagrid rowClick="edit">{defaultFiedls}</Datagrid>
                        </List>
                    }
                    edit={
                        <Edit
                            actions={
                                <MyTopToolbar>
                                    <PrevNextButton storeKey="withStoreKey" />
                                    <ShowButton />
                                </MyTopToolbar>
                            }
                        >
                            <SimpleForm>{defaultInputs}</SimpleForm>
                        </Edit>
                    }
                    show={
                        <Show
                            actions={
                                <MyTopToolbar>
                                    <PrevNextButton
                                        linkType="show"
                                        storeKey="withStoreKey"
                                    />
                                    <EditButton />
                                </MyTopToolbar>
                            }
                        >
                            <SimpleShowLayout>{defaultInputs}</SimpleShowLayout>
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
                        <List
                            filter={{ city: 'Hill Valley' }}
                            filters={[
                                <TextInput
                                    label="Search"
                                    source="q"
                                    alwaysOn
                                />,
                            ]}
                            sort={{ field: 'first_name', order: 'DESC' }}
                        >
                            <Datagrid rowClick="edit">{defaultFiedls}</Datagrid>
                        </List>
                    }
                    edit={
                        <Edit
                            actions={
                                <MyTopToolbar>
                                    <PrevNextButton
                                        listParams={{
                                            filter: { city: 'Hill Valley' },
                                            sort: 'first_name',
                                            order: 'DESC',
                                        }}
                                    />
                                    <ShowButton />
                                </MyTopToolbar>
                            }
                        >
                            <SimpleForm>{defaultInputs}</SimpleForm>
                        </Edit>
                    }
                    show={
                        <Show
                            actions={
                                <MyTopToolbar>
                                    <PrevNextButton
                                        linkType="show"
                                        listParams={{
                                            filter: { city: 'Hill Valley' },
                                            sort: 'first_name',
                                            order: 'DESC',
                                        }}
                                    />
                                    <EditButton />
                                </MyTopToolbar>
                            }
                        >
                            <SimpleShowLayout>{defaultFiedls}</SimpleShowLayout>
                        </Show>
                    }
                />
            </AdminUI>
        </AdminContext>
    </MemoryRouter>
);

export const WithLimit = () => (
    <MemoryRouter>
        <AdminContext dataProvider={dataProvider} i18nProvider={i18nProvider}>
            <AdminUI>
                <Resource
                    name="customers"
                    list={
                        <List>
                            <Datagrid rowClick="edit">{defaultFiedls}</Datagrid>
                        </List>
                    }
                    edit={
                        <Edit
                            actions={
                                <MyTopToolbar>
                                    <PrevNextButton limit={500} />
                                    <ShowButton />
                                </MyTopToolbar>
                            }
                        >
                            <SimpleForm>{defaultInputs}</SimpleForm>
                        </Edit>
                    }
                    show={
                        <Show
                            actions={
                                <MyTopToolbar>
                                    <PrevNextButton
                                        linkType="show"
                                        limit={500}
                                    />
                                    <ShowButton />
                                </MyTopToolbar>
                            }
                        >
                            <SimpleShowLayout>{defaultFiedls}</SimpleShowLayout>
                        </Show>
                    }
                />
            </AdminUI>
        </AdminContext>
    </MemoryRouter>
);

export const ShouldNotDisplayed = () => (
    <MemoryRouter>
        <AdminContext dataProvider={dataProvider} i18nProvider={i18nProvider}>
            <Create
                resource="customers"
                actions={
                    <MyTopToolbar>
                        <PrevNextButton />
                    </MyTopToolbar>
                }
            >
                <SimpleForm>{defaultInputs}</SimpleForm>
            </Create>
        </AdminContext>
    </MemoryRouter>
);
