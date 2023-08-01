import * as React from 'react';
import { TranslatableFields } from './TranslatableFields';
import { TextField } from './TextField';
import { RecordContextProvider } from 'ra-core';

export default { title: 'ra-ui-materialui/fields/TranslatableFields' };

const record = {
    id: 123,
    name: {
        en: 'english name',
        fr: 'french name',
    },
    description: {
        en: 'english description',
        fr: 'french description',
    },
    nested: {
        field: {
            en: 'english nested field',
            fr: 'french nested field',
        },
    },
};

export const Basic = () => (
    <RecordContextProvider value={record}>
        <TranslatableFields locales={['en', 'fr']}>
            <TextField source="name" />
            <TextField source="description" />
            <TextField source="nested.field" />
        </TranslatableFields>
    </RecordContextProvider>
);
