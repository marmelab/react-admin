import * as React from 'react';
import polyglotI18nProvider from 'ra-i18n-polyglot';
import englishMessages from 'ra-language-english';
import { createTheme } from '@mui/material/styles';

import { AdminContext } from '../AdminContext';
import { Create, Edit } from '../detail';
import { SimpleForm } from '../form';
import { RadioButtonGroupInput } from './RadioButtonGroupInput';
import { FormInspector } from './common';
import { ReferenceInput } from './ReferenceInput';
import { ReferenceArrayInput } from './ReferenceArrayInput';
import { Resource, TestMemoryRouter, testDataProvider } from 'ra-core';
import { Admin } from 'react-admin';

export default { title: 'ra-ui-materialui/input/RadioButtonGroupInput' };

const choices = [
    { id: 'tech', name: 'Tech', details: 'Tech details' },
    { id: 'lifestyle', name: 'Lifestyle', details: 'Lifestyle details' },
    { id: 'people', name: 'People', details: 'People details' },
];

export const Basic = () => (
    <Wrapper>
        <RadioButtonGroupInput source="category" choices={choices} />
    </Wrapper>
);

export const StringChoices = () => (
    <Wrapper>
        <RadioButtonGroupInput
            source="category"
            choices={['Tech', 'Lifestyle', 'People']}
        />
    </Wrapper>
);

export const Disabled = () => (
    <Wrapper>
        <RadioButtonGroupInput source="category" choices={choices} disabled />
    </Wrapper>
);

export const ReadOnly = () => (
    <Wrapper>
        <RadioButtonGroupInput source="category" choices={choices} readOnly />
    </Wrapper>
);

export const Row = () => (
    <Wrapper>
        <RadioButtonGroupInput
            source="category"
            choices={choices}
            row={false}
        />
    </Wrapper>
);

export const DefaultValue = () => (
    <Wrapper>
        <RadioButtonGroupInput
            defaultValue="M"
            choices={[
                { id: 'M', name: 'Male' },
                { id: 'F', name: 'Female' },
            ]}
            source="gender"
        />
    </Wrapper>
);

export const Invalid = () => (
    <Wrapper>
        <RadioButtonGroupInput
            validate={() => 'Not good'}
            choices={[
                { id: 'M', name: 'Male' },
                { id: 'F', name: 'Female' },
            ]}
            source="gender"
        />
    </Wrapper>
);

export const IsPending = () => (
    <Wrapper>
        <RadioButtonGroupInput source="category" isPending />
    </Wrapper>
);

const dataProvider = testDataProvider({
    getList: () => Promise.resolve({ data: choices, total: choices.length }),
    getMany: (resource, params) =>
        Promise.resolve({
            data: choices.filter(choice => params.ids.includes(choice.id)),
            total: choices.length,
        }),
} as any);

export const InsideReferenceArrayInput = () => (
    <TestMemoryRouter initialEntries={['/posts/create']}>
        <Admin
            dataProvider={dataProvider}
            i18nProvider={i18nProvider}
            defaultTheme="light"
        >
            <Resource
                name="categories"
                recordRepresentation={record =>
                    `${record.name} (${record.details})`
                }
            />
            <Resource
                name="posts"
                create={
                    <Create
                        resource="posts"
                        record={{ options: [1, 2] }}
                        sx={{ width: 600 }}
                    >
                        <SimpleForm>
                            <ReferenceArrayInput
                                reference="categories"
                                source="category"
                            >
                                <RadioButtonGroupInput />
                            </ReferenceArrayInput>
                        </SimpleForm>
                    </Create>
                }
            />
        </Admin>
    </TestMemoryRouter>
);

export const InsideReferenceArrayInputWithError = () => (
    <AdminContext
        dataProvider={{
            ...dataProvider,
            getList: () => Promise.reject(new Error('fetch error')),
        }}
        i18nProvider={i18nProvider}
        defaultTheme="light"
    >
        <Create
            resource="posts"
            record={{ options: [1, 2] }}
            sx={{ width: 600 }}
        >
            <SimpleForm>
                <ReferenceArrayInput reference="categories" source="category">
                    <RadioButtonGroupInput />
                </ReferenceArrayInput>
            </SimpleForm>
        </Create>
    </AdminContext>
);

export const Id = () => (
    <>
        <Wrapper>
            <RadioButtonGroupInput
                id="foo"
                source="category"
                choices={choices}
                row={false}
            />
        </Wrapper>
        <Wrapper>
            <RadioButtonGroupInput
                source="category"
                choices={choices}
                row={false}
            />
        </Wrapper>
    </>
);
const i18nProvider = polyglotI18nProvider(() => englishMessages);

const Wrapper = ({ children, theme = undefined }) => (
    <AdminContext
        i18nProvider={i18nProvider}
        defaultTheme="light"
        theme={theme}
    >
        <Create resource="posts">
            <SimpleForm>
                {children}
                <FormInspector name="gender" />
            </SimpleForm>
        </Create>
    </AdminContext>
);

export const TranslateChoice = () => {
    const i18nProvider = polyglotI18nProvider(() => ({
        ...englishMessages,
        'option.male': 'Male',
        'option.female': 'Female',
    }));
    return (
        <AdminContext
            i18nProvider={i18nProvider}
            dataProvider={
                {
                    getOne: () =>
                        Promise.resolve({ data: { id: 1, gender: 'F' } }),
                    getList: () =>
                        Promise.resolve({
                            data: [
                                { id: 'M', name: 'option.male' },
                                { id: 'F', name: 'option.female' },
                            ],
                            total: 2,
                        }),
                    getMany: (_resource, { ids }) =>
                        Promise.resolve({
                            data: [
                                { id: 'M', name: 'option.male' },
                                { id: 'F', name: 'option.female' },
                            ].filter(({ id }) => ids.includes(id)),
                        }),
                } as any
            }
            defaultTheme="light"
        >
            <Edit resource="posts" id="1">
                <SimpleForm>
                    <RadioButtonGroupInput
                        label="translateChoice default"
                        source="gender"
                        id="gender1"
                        choices={[
                            { id: 'M', name: 'option.male' },
                            { id: 'F', name: 'option.female' },
                        ]}
                    />
                    <RadioButtonGroupInput
                        label="translateChoice true"
                        source="gender"
                        id="gender2"
                        choices={[
                            { id: 'M', name: 'option.male' },
                            { id: 'F', name: 'option.female' },
                        ]}
                        translateChoice
                    />
                    <RadioButtonGroupInput
                        label="translateChoice false"
                        source="gender"
                        id="gender3"
                        choices={[
                            { id: 'M', name: 'option.male' },
                            { id: 'F', name: 'option.female' },
                        ]}
                        translateChoice={false}
                    />
                    <ReferenceInput reference="genders" source="gender">
                        <RadioButtonGroupInput
                            optionText="name"
                            label="inside ReferenceInput"
                            id="gender4"
                        />
                    </ReferenceInput>
                    <ReferenceInput reference="genders" source="gender">
                        <RadioButtonGroupInput
                            optionText="name"
                            label="inside ReferenceInput forced"
                            id="gender5"
                            translateChoice
                        />
                    </ReferenceInput>
                </SimpleForm>
            </Edit>
        </AdminContext>
    );
};

export const DisabledChoice = () => (
    <Wrapper>
        <RadioButtonGroupInput
            source="category"
            choices={[
                { id: 'tech', name: 'Tech', details: 'Tech details' },
                {
                    id: 'lifestyle',
                    name: 'Lifestyle',
                    details: 'Lifestyle details',
                },
                {
                    id: 'people',
                    name: 'People',
                    details: 'People details',
                    disabled: true,
                },
            ]}
        />
    </Wrapper>
);

export const Themed = () => (
    <Wrapper
        theme={createTheme({
            components: {
                RaRadioButtonGroupInputItem: {
                    defaultProps: {
                        'data-testid': 'themed',
                    },
                    styleOverrides: {
                        root: {
                            color: 'red',
                        },
                    },
                },
            },
        })}
    >
        <RadioButtonGroupInput source="category" choices={choices} />
    </Wrapper>
);
