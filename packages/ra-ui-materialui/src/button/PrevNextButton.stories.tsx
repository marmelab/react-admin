import * as React from 'react';
import { AdminContext } from '../AdminContext';
import fakeRestDataProvider from 'ra-data-fakerest';
import { Resource } from 'ra-core';
import {
    AdminUI,
    Create,
    Datagrid,
    Edit,
    List,
    PrevNextButton,
    Show,
    SimpleForm,
    SimpleShowLayout,
    TextField,
    TextInput,
} from 'react-admin';
import englishMessages from 'ra-language-english';
import polyglotI18nProvider from 'ra-i18n-polyglot';
import generateData from 'data-generator-retail';

export default { title: 'ra-ui-materialui/button/PrevNextButton' };

const i18nProvider = polyglotI18nProvider(() => englishMessages, 'en');

const defaultCustomerData = {
    city: 'Hill Valley',
    address: null,
    zipcode: null,
    stateAbbr: null,
    birthday: null,
    first_seen: '2021-08-22T23:43:18.742Z',
    last_seen: '2023-04-22T07:24:29.127Z',
    has_ordered: false,
    latest_purchase: null,
    has_newsletter: true,
    groups: [],
    nb_commands: 0,
    total_spent: 0,
};

const data = generateData();

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
                    ...defaultCustomerData,
                },
                {
                    id: 902,
                    first_name: 'Emmett',
                    last_name: 'Brown',
                    email: 'Emmett.Brown@yahoo.com',
                    ...defaultCustomerData,
                },
                {
                    id: 903,
                    first_name: 'Biff',
                    last_name: 'Tannen',
                    email: 'Biff.Tannen@yahoo.com',
                    ...defaultCustomerData,
                },
                {
                    id: 904,
                    first_name: 'Clara',
                    last_name: 'Clayton',
                    email: 'Clara.Clayton@yahoo.com',
                    ...defaultCustomerData,
                },
            ],
        ],
    },
});

export const Basic = () => (
    <AdminContext dataProvider={dataProvider} i18nProvider={i18nProvider}>
        <AdminUI>
            <Resource
                name="customers"
                list={
                    <List>
                        <Datagrid rowClick="edit">
                            <TextField source="id" />
                            <TextField source="first_name" />
                            <TextField source="last_name" />
                            <TextField source="email" />
                            <TextField source="city" />
                        </Datagrid>
                    </List>
                }
                edit={
                    <Edit>
                        <SimpleForm>
                            <TextInput source="first_name" />
                            <TextInput source="last_name" />
                            <TextInput source="email" />
                            <TextInput source="city" />
                            <PrevNextButton />
                        </SimpleForm>
                    </Edit>
                }
                show={
                    <Show>
                        <SimpleShowLayout>
                            <TextField source="id" />
                            <TextField source="first_name" />
                            <TextField source="last_name" />
                            <TextField source="email" />
                            <TextField source="city" />
                            <PrevNextButton linkType="show" />
                        </SimpleShowLayout>
                    </Show>
                }
            />
        </AdminUI>
    </AdminContext>
);

export const WithStoreKey = () => (
    <AdminContext dataProvider={dataProvider} i18nProvider={i18nProvider}>
        <AdminUI>
            <Resource
                name="customers"
                list={
                    <List storeKey="withStoreKey">
                        <Datagrid rowClick="edit">
                            <TextField source="id" />

                            <TextField source="first_name" />
                            <TextField source="last_name" />
                            <TextField source="email" />
                            <TextField source="city" />
                        </Datagrid>
                    </List>
                }
                edit={
                    <Edit>
                        <SimpleForm>
                            <TextInput source="first_name" />
                            <TextInput source="last_name" />
                            <TextInput source="email" />
                            <TextInput source="city" />
                            <PrevNextButton storeKey="withStoreKey" />
                        </SimpleForm>
                    </Edit>
                }
                show={
                    <Show>
                        <SimpleShowLayout>
                            <TextField source="id" />

                            <TextField source="first_name" />
                            <TextField source="last_name" />
                            <TextField source="email" />
                            <TextField source="city" />
                            <PrevNextButton
                                linkType="show"
                                storeKey="withStoreKey"
                            />
                        </SimpleShowLayout>
                    </Show>
                }
            />
        </AdminUI>
    </AdminContext>
);

export const WithFilter = () => (
    <AdminContext dataProvider={dataProvider} i18nProvider={i18nProvider}>
        <AdminUI>
            <Resource
                name="customers"
                list={
                    <List filter={{ city: 'Hill Valley' }}>
                        <Datagrid rowClick="edit">
                            <TextField source="id" />

                            <TextField source="first_name" />
                            <TextField source="last_name" />
                            <TextField source="email" />
                            <TextField source="city" />
                        </Datagrid>
                    </List>
                }
                edit={
                    <Edit>
                        <SimpleForm>
                            <TextInput source="first_name" />
                            <TextInput source="last_name" />
                            <TextInput source="email" />
                            <TextInput source="city" />
                            <PrevNextButton />
                        </SimpleForm>
                    </Edit>
                }
                show={
                    <Show>
                        <SimpleShowLayout>
                            <TextField source="id" />

                            <TextField source="first_name" />
                            <TextField source="last_name" />
                            <TextField source="email" />
                            <TextField source="city" />
                            <PrevNextButton linkType="show" />
                        </SimpleShowLayout>
                    </Show>
                }
            />
        </AdminUI>
    </AdminContext>
);

export const WithLimit = () => (
    <AdminContext dataProvider={dataProvider} i18nProvider={i18nProvider}>
        <AdminUI>
            <Resource
                name="customers"
                list={
                    <List>
                        <Datagrid rowClick="edit">
                            <TextField source="id" />

                            <TextField source="first_name" />
                            <TextField source="last_name" />
                            <TextField source="email" />
                            <TextField source="city" />
                        </Datagrid>
                    </List>
                }
                edit={
                    <Edit>
                        <SimpleForm>
                            <TextInput source="first_name" />
                            <TextInput source="last_name" />
                            <TextInput source="email" />
                            <TextInput source="city" />
                            <PrevNextButton limit={4} />
                        </SimpleForm>
                    </Edit>
                }
                show={
                    <Show>
                        <SimpleShowLayout>
                            <TextField source="id" />

                            <TextField source="first_name" />
                            <TextField source="last_name" />
                            <TextField source="email" />
                            <TextField source="city" />
                            <PrevNextButton linkType="show" limit={4} />
                        </SimpleShowLayout>
                    </Show>
                }
            />
        </AdminUI>
    </AdminContext>
);

export const ShouldNotDisplayed = () => (
    <AdminContext dataProvider={dataProvider} i18nProvider={i18nProvider}>
        <Create resource="customers">
            <SimpleForm>
                <TextInput source="first_name" />
                <TextInput source="last_name" />
                <TextInput source="email" />
                <TextInput source="city" />
                <PrevNextButton />
            </SimpleForm>
        </Create>
    </AdminContext>
);
