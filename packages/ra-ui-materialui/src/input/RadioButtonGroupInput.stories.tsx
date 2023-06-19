import * as React from 'react';
import polyglotI18nProvider from 'ra-i18n-polyglot';
import englishMessages from 'ra-language-english';

import { AdminContext } from '../AdminContext';
import { Create } from '../detail';
import { SimpleForm } from '../form';
import { RadioButtonGroupInput } from './RadioButtonGroupInput';
import { FormInspector } from './common';
import { ReferenceArrayInput } from './ReferenceArrayInput';
import { testDataProvider } from 'ra-core';

export default { title: 'ra-ui-materialui/input/RadioButtonGroupInput' };

const choices = [
    { id: 'tech', name: 'Tech' },
    { id: 'lifestyle', name: 'Lifestyle' },
    { id: 'people', name: 'People' },
];

export const Basic = () => (
    <Wrapper>
        <RadioButtonGroupInput source="category" choices={choices} />
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

export const IsLoading = () => (
    <Wrapper>
        <RadioButtonGroupInput source="category" isLoading />
    </Wrapper>
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
                <ReferenceArrayInput reference="categories" source="category">
                    <RadioButtonGroupInput />
                </ReferenceArrayInput>
            </SimpleForm>
        </Create>
    </AdminContext>
);

export const InsideReferenceArrayInputWithError = () => (
    <AdminContext
        dataProvider={{
            ...dataProvider,
            getList: () => Promise.reject(new Error('fetch error')),
        }}
        i18nProvider={i18nProvider}
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

const Wrapper = ({ children }) => (
    <AdminContext i18nProvider={i18nProvider}>
        <Create resource="posts">
            <SimpleForm>
                {children}
                <FormInspector name="gender" />
            </SimpleForm>
        </Create>
    </AdminContext>
);
