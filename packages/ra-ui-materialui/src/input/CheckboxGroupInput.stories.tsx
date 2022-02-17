import * as React from 'react';
import polyglotI18nProvider from 'ra-i18n-polyglot';
import englishMessages from 'ra-language-english';

import { AdminContext } from '../AdminContext';
import { Create } from '../detail';
import { SimpleForm } from '../form';
import { CheckboxGroupInput } from './CheckboxGroupInput';
import { Typography } from '@mui/material';
import { testDataProvider, useRecordContext } from 'ra-core';
import { ReferenceArrayInput } from './ReferenceArrayInput';

export default { title: 'ra-ui-materialui/input/CheckboxGroupInput' };

const i18nProvider = polyglotI18nProvider(() => englishMessages);

const choices = [
    { id: 1, name: 'Option 1', details: 'This is option 1' },
    { id: 2, name: 'Option 2', details: 'This is option 2' },
    { id: 3, name: 'Option 3', details: 'This is option 3' },
    { id: 4, name: 'Option 4', details: 'This is option 4' },
    { id: 5, name: 'Option 5', details: 'This is option 5' },
    { id: 6, name: 'Option 6', details: 'This is option 6' },
];

export const Basic = () => (
    <AdminContext i18nProvider={i18nProvider}>
        <Create
            resource="posts"
            record={{ options: [1, 2] }}
            sx={{ width: 600 }}
        >
            <SimpleForm>
                <CheckboxGroupInput source="options" choices={choices} />
            </SimpleForm>
        </Create>
    </AdminContext>
);

const dataProvider = testDataProvider({
    getList: () => Promise.resolve({ data: choices, total: choices.length }),
    getMany: (resource, params) =>
        Promise.resolve({
            data: choices.filter(choice => params.ids.includes(choice.id)),
            total: choices.length,
        }),
});

export const InsideReferenceArrayInput = () => (
    <AdminContext dataProvider={dataProvider} i18nProvider={i18nProvider}>
        <Create
            resource="posts"
            record={{ options: [1, 2] }}
            sx={{ width: 600 }}
        >
            <SimpleForm>
                <ReferenceArrayInput reference="options" source="options">
                    <CheckboxGroupInput />
                </ReferenceArrayInput>
            </SimpleForm>
        </Create>
    </AdminContext>
);

export const Disabled = () => (
    <AdminContext i18nProvider={i18nProvider}>
        <Create
            resource="posts"
            record={{ options: [1, 2] }}
            sx={{ width: 600 }}
        >
            <SimpleForm>
                <CheckboxGroupInput
                    source="options"
                    disabled
                    choices={choices}
                />
            </SimpleForm>
        </Create>
    </AdminContext>
);

export const Column = () => (
    <AdminContext i18nProvider={i18nProvider}>
        <Create
            resource="posts"
            record={{ options: [1, 2] }}
            sx={{ width: 600 }}
        >
            <SimpleForm>
                <CheckboxGroupInput
                    source="options"
                    choices={choices}
                    row={false}
                />
            </SimpleForm>
        </Create>
    </AdminContext>
);

export const CustomOptionText = () => (
    <AdminContext i18nProvider={i18nProvider}>
        <Create
            resource="posts"
            record={{ options: [1, 2] }}
            sx={{ width: 600 }}
        >
            <SimpleForm>
                <CheckboxGroupInput
                    source="options"
                    optionText={<OptionText />}
                    choices={choices}
                    row={false}
                    sx={{
                        '& .MuiFormControlLabel-root': {
                            alignItems: 'start',
                        },
                    }}
                />
            </SimpleForm>
        </Create>
    </AdminContext>
);

const OptionText = () => {
    const record = useRecordContext();
    return (
        <>
            <Typography sx={{ marginTop: 0.5 }}>{record.name}</Typography>
            <Typography color="textSecondary" sx={{ marginBottom: 2 }}>
                {record.details}
            </Typography>
        </>
    );
};
