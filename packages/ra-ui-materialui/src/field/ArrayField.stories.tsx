import { testDataProvider } from 'ra-core';
import * as React from 'react';
import {
    AdminContext,
    Datagrid,
    DateField,
    Show,
    UrlField,
    SimpleList,
    SimpleShowLayout,
} from '..';
import { ArrayField } from './ArrayField';

export default { title: 'ra-ui-materialui/fields/ArrayField' };

const dataProvider = testDataProvider({
    getOne: (resource, params) =>
        Promise.resolve({
            data:
                params.id === 'empty'
                    ? {
                          id: 'empty',
                          backlinks: [],
                          title: 'Lorem Ipsum',
                      }
                    : {
                          id: 'not-empty',
                          backlinks: [
                              { date: '2020-01-01', url: 'http://example.com' },
                              { date: '2020-01-02', url: 'http://example.com' },
                          ],
                          title: 'Lorem Ipsum',
                      },
        }),
});

export const WithDatagrid = () => (
    <AdminContext dataProvider={dataProvider}>
        <Show resource="posts" id="not-empty">
            <SimpleShowLayout>
                <ArrayField source="backlinks">
                    <Datagrid>
                        <DateField source="date" />
                        <UrlField source="url" />
                    </Datagrid>
                </ArrayField>
            </SimpleShowLayout>
        </Show>
    </AdminContext>
);

export const WithDatagridDefaultEmpty = () => (
    <AdminContext dataProvider={dataProvider}>
        <Show resource="posts" id="empty">
            <SimpleShowLayout>
                <ArrayField source="backlinks">
                    <Datagrid>
                        <DateField source="date" />
                        <UrlField source="url" />
                    </Datagrid>
                </ArrayField>
            </SimpleShowLayout>
        </Show>
    </AdminContext>
);

export const WithDatagridFalseEmpty = () => (
    <AdminContext dataProvider={dataProvider}>
        <Show resource="posts" id="empty">
            <SimpleShowLayout>
                <ArrayField source="backlinks">
                    <Datagrid empty={false}>
                        <DateField source="date" />
                        <UrlField source="url" />
                    </Datagrid>
                </ArrayField>
            </SimpleShowLayout>
        </Show>
    </AdminContext>
);

export const WithSimpleList = () => (
    <AdminContext dataProvider={dataProvider}>
        <Show resource="posts" id="not-empty">
            <SimpleShowLayout>
                <ArrayField source="backlinks">
                    <SimpleList
                        primaryText={record => record.url}
                        secondaryText={record => record.date}
                    />
                </ArrayField>
            </SimpleShowLayout>
        </Show>
    </AdminContext>
);

export const WithSimpleListDefaultEmpty = () => (
    <AdminContext dataProvider={dataProvider}>
        <Show resource="posts" id="empty">
            <SimpleShowLayout>
                <ArrayField source="backlinks">
                    <SimpleList />
                </ArrayField>
            </SimpleShowLayout>
        </Show>
    </AdminContext>
);

export const WithSimpleListFalseEmpty = () => (
    <AdminContext dataProvider={dataProvider}>
        <Show resource="posts" id="empty">
            <SimpleShowLayout>
                <ArrayField source="backlinks">
                    <SimpleList empty={false} />
                </ArrayField>
            </SimpleShowLayout>
        </Show>
    </AdminContext>
);
