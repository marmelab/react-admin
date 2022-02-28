import * as React from 'react';
import { Form, testDataProvider } from 'ra-core';
import { AdminContext } from '../AdminContext';

import { DatagridInput } from '../input';
import { TextField } from '../field';
import { ReferenceArrayInput } from './ReferenceArrayInput';
import polyglotI18nProvider from 'ra-i18n-polyglot';
import englishMessages from 'ra-language-english';

export default { title: 'ra-ui-materialui/input/ReferenceArrayInput' };

const dataProvider = testDataProvider({
    getList: () =>
        // @ts-ignore
        Promise.resolve({
            data: [
                { id: 5, name: 'test1' },
                { id: 6, name: 'test2' },
            ],
            total: 2,
        }),
    // @ts-ignore
    getMany: (resource, params) => {
        console.log('getMany', resource, params);
        return Promise.resolve({ data: [{ id: 5, name: 'test1' }] });
    },
});

const i18nProvider = polyglotI18nProvider(() => englishMessages);

export const WithDatagridChild = () => (
    <AdminContext dataProvider={dataProvider} i18nProvider={i18nProvider}>
        <Form
            onSubmit={() => {}}
            defaultValues={{ tag_ids: [5] }}
            render={() => (
                <ReferenceArrayInput
                    reference="tags"
                    resource="posts"
                    source="tag_ids"
                >
                    <DatagridInput rowClick="toggleSelection" sx={{ mt: 6 }}>
                        <TextField source="name" />
                    </DatagridInput>
                </ReferenceArrayInput>
            )}
        />
    </AdminContext>
);
