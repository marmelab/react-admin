import * as React from 'react';
import polyglotI18nProvider from 'ra-i18n-polyglot';
import englishMessages from 'ra-language-english';
import { Typography } from '@mui/material';
import { FavoriteBorder, Favorite } from '@mui/icons-material';
import { required, testDataProvider, useRecordContext } from 'ra-core';

import { AdminContext } from '../AdminContext';
import { Create, Edit } from '../detail';
import { SimpleForm } from '../form';
import { CheckboxGroupInput } from './CheckboxGroupInput';
import { ReferenceArrayInput } from './ReferenceArrayInput';
import { TextInput } from './TextInput';

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
            record={{ roles: ['u001', 'u003'] }}
            sx={{ width: 600 }}
        >
            <SimpleForm>
                <CheckboxGroupInput
                    source="roles"
                    choices={[
                        { id: 'admin', name: 'Admin' },
                        { id: 'u001', name: 'Editor' },
                        { id: 'u002', name: 'Moderator' },
                        { id: 'u003', name: 'Reviewer' },
                    ]}
                />
            </SimpleForm>
        </Create>
    </AdminContext>
);

const dataProvider = testDataProvider({
    // @ts-ignore
    getList: () => Promise.resolve({ data: choices, total: choices.length }),
    // @ts-ignore
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

export const LabelPlacement = () => (
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
                    labelPlacement="bottom"
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

export const Options = () => (
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
                    options={{
                        icon: <FavoriteBorder />,
                        checkedIcon: <Favorite />,
                    }}
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

export const Validate = () => (
    <AdminContext i18nProvider={i18nProvider}>
        <Create resource="posts" sx={{ width: 600 }}>
            <SimpleForm>
                <CheckboxGroupInput
                    source="options"
                    choices={choices}
                    validate={[required()]}
                />
                <TextInput source="foo" />
            </SimpleForm>
        </Create>
    </AdminContext>
);

export const HelperText = () => (
    <AdminContext i18nProvider={i18nProvider}>
        <Create resource="posts" sx={{ width: 600 }}>
            <SimpleForm>
                <CheckboxGroupInput
                    source="options"
                    choices={choices}
                    validate={[required()]}
                    helperText="Helper text"
                />
            </SimpleForm>
        </Create>
    </AdminContext>
);

export const TranslateChoice = () => {
    const i18nProvider = polyglotI18nProvider(() => ({
        ...englishMessages,
        'option.tech': 'Tech',
        'option.business': 'Business',
    }));
    return (
        <AdminContext
            i18nProvider={i18nProvider}
            dataProvider={
                {
                    getOne: () =>
                        Promise.resolve({ data: { id: 1, tags: ['tech'] } }),
                    getList: () =>
                        Promise.resolve({
                            data: [
                                { id: 'tech', name: 'option.tech' },
                                { id: 'business', name: 'option.business' },
                            ],
                            total: 2,
                        }),
                    getMany: (_resource, { ids }) =>
                        Promise.resolve({
                            data: [
                                { id: 'tech', name: 'option.tech' },
                                { id: 'business', name: 'option.business' },
                            ].filter(({ id }) => ids.includes(id)),
                        }),
                } as any
            }
        >
            <Edit resource="posts" id="1">
                <SimpleForm>
                    <CheckboxGroupInput
                        label="translateChoice default"
                        source="tags"
                        choices={[
                            { id: 'tech', name: 'option.tech' },
                            { id: 'business', name: 'option.business' },
                        ]}
                    />
                    <CheckboxGroupInput
                        label="translateChoice true"
                        source="tags"
                        choices={[
                            { id: 'tech', name: 'option.tech' },
                            { id: 'business', name: 'option.business' },
                        ]}
                        translateChoice
                    />
                    <CheckboxGroupInput
                        label="translateChoice false"
                        source="tags"
                        choices={[
                            { id: 'tech', name: 'option.tech' },
                            { id: 'business', name: 'option.business' },
                        ]}
                        translateChoice={false}
                    />
                    <ReferenceArrayInput reference="tags" source="tags">
                        <CheckboxGroupInput
                            optionText="name"
                            label="inside ReferenceArrayInput"
                        />
                    </ReferenceArrayInput>
                    <ReferenceArrayInput reference="tags" source="tags">
                        <CheckboxGroupInput
                            optionText="name"
                            label="inside ReferenceArrayInput forced"
                            translateChoice
                        />
                    </ReferenceArrayInput>
                </SimpleForm>
            </Edit>
        </AdminContext>
    );
};
