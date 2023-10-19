import * as React from 'react';
import { createMemoryHistory } from 'history';
import { Admin, AdminContext } from 'react-admin';
import { Resource, required, useGetList } from 'ra-core';
import polyglotI18nProvider from 'ra-i18n-polyglot';
import englishMessages from 'ra-language-english';

import { Create, Edit } from '../detail';
import { SimpleForm } from '../form';
import { SelectInput } from './SelectInput';
import { TextInput } from './TextInput';
import { ReferenceInput } from './ReferenceInput';
import { SaveButton } from '../button/SaveButton';
import { Toolbar } from '../form/Toolbar';
import { FormInspector } from './common';

export default { title: 'ra-ui-materialui/input/SelectInput' };

export const Basic = () => (
    <Wrapper>
        <SelectInput
            source="gender"
            choices={[
                { id: 'M', name: 'Male ' },
                { id: 'F', name: 'Female' },
            ]}
        />
    </Wrapper>
);

export const DefaultValue = () => (
    <Wrapper>
        <SelectInput
            source="gender"
            choices={[
                { id: 'M', name: 'Male ' },
                { id: 'F', name: 'Female' },
            ]}
            defaultValue="F"
        />
    </Wrapper>
);

export const InitialValue = () => (
    <AdminContext
        i18nProvider={i18nProvider}
        dataProvider={
            {
                getOne: () => Promise.resolve({ data: { id: 1, gender: 'F' } }),
            } as any
        }
    >
        <Edit resource="posts" id="1">
            <SimpleForm>
                <SelectInput
                    source="gender"
                    choices={[
                        { id: 'M', name: 'Male ' },
                        { id: 'F', name: 'Female' },
                    ]}
                />
                <FormInspector name="gender" />
            </SimpleForm>
        </Edit>
    </AdminContext>
);

export const Disabled = () => (
    <Wrapper>
        <SelectInput
            source="gender"
            choices={[
                { id: 'M', name: 'Male ' },
                { id: 'F', name: 'Female' },
            ]}
            disabled
        />
    </Wrapper>
);

export const IsLoading = () => (
    <Wrapper>
        <SelectInput source="gender" isLoading />
    </Wrapper>
);

export const Validate = () => (
    <Wrapper>
        <SelectInput
            source="gender"
            choices={[
                { id: 'M', name: 'Male ' },
                { id: 'F', name: 'Female' },
            ]}
            validate={() => 'error'}
        />
    </Wrapper>
);

export const Required = () => (
    <Wrapper>
        <SelectInput
            source="gender"
            choices={[
                { id: 'M', name: 'Male ' },
                { id: 'F', name: 'Female' },
            ]}
            validate={required()}
        />
    </Wrapper>
);

export const EmptyText = ({ onSuccess = console.log }) => (
    <Wrapper onSuccess={onSuccess}>
        <SelectInput
            source="gender"
            choices={[
                { id: 'M', name: 'Male ' },
                { id: 'F', name: 'Female' },
            ]}
            emptyText="None"
        />
    </Wrapper>
);

export const EmptyValue = ({ emptyValue = 'foo' }) => (
    <Wrapper>
        <SelectInput
            source="gender"
            choices={[
                { id: 'M', name: 'Male ' },
                { id: 'F', name: 'Female' },
            ]}
            emptyValue={emptyValue}
        />
    </Wrapper>
);
EmptyValue.argTypes = {
    emptyValue: {
        options: ['foo', '0', 'null', 'undefined', 'empty string'],
        mapping: {
            foo: 'foo',
            0: 0,
            null: null,
            undefined: undefined,
            'empty string': '',
        },
        control: { type: 'select' },
    },
};

export const Sort = () => (
    <Wrapper>
        <SelectInput
            source="status"
            choices={[
                { id: 'created', name: 'Created' },
                { id: 'sent', name: 'Sent' },
                { id: 'inbox', name: 'Inbox' },
                { id: 'spam', name: 'Spam' },
                { id: 'error', name: 'Error' },
            ]}
            validate={() => 'error'}
        />
    </Wrapper>
);

const i18nProvider = polyglotI18nProvider(() => englishMessages);

const Wrapper = ({ children, onSuccess = console.log }) => (
    <AdminContext
        i18nProvider={i18nProvider}
        dataProvider={
            {
                create: (resource, params) =>
                    Promise.resolve({ data: { id: 1, ...params.data } }),
            } as any
        }
    >
        <Create resource="posts" mutationOptions={{ onSuccess }}>
            <SimpleForm
                toolbar={
                    <Toolbar>
                        <SaveButton alwaysEnable />
                    </Toolbar>
                }
            >
                {children}
                <FormInspector name="gender" />
            </SimpleForm>
        </Create>
    </AdminContext>
);

const authors = [
    { id: 1, first_name: 'Leo', last_name: 'Tolstoy', language: 'Russian' },
    { id: 2, first_name: 'Victor', last_name: 'Hugo', language: 'French' },
    {
        id: 3,
        first_name: 'William',
        last_name: 'Shakespeare',
        language: 'English',
    },
    {
        id: 4,
        first_name: 'Charles',
        last_name: 'Baudelaire',
        language: 'French',
    },
    { id: 5, first_name: 'Marcel', last_name: 'Proust', language: 'French' },
];

const dataProviderWithAuthors = {
    getOne: () =>
        Promise.resolve({
            data: {
                id: 1,
                title: 'War and Peace',
                author: 1,
                summary:
                    "War and Peace broadly focuses on Napoleon's invasion of Russia, and the impact it had on Tsarist society. The book explores themes such as revolution, revolution and empire, the growth and decline of various states and the impact it had on their economies, culture, and society.",
                year: 1869,
            },
        }),
    getMany: (_resource, params) =>
        Promise.resolve({
            data: authors.filter(author => params.ids.includes(author.id)),
        }),
    getList: () =>
        new Promise(resolve => {
            // eslint-disable-next-line eqeqeq
            setTimeout(
                () =>
                    resolve({
                        data: authors,
                        total: authors.length,
                    }),
                500
            );
            return;
        }),
    update: (_resource, params) => Promise.resolve(params),
    create: (_resource, params) => {
        const newAuthor = {
            id: authors.length + 1,
            first_name: params.data.first_name,
            last_name: params.data.last_name,
            language: params.data.language,
        };
        authors.push(newAuthor);
        return Promise.resolve({ data: newAuthor });
    },
} as any;

const history = createMemoryHistory({ initialEntries: ['/books/1'] });

export const FetchChoices = () => {
    const BookAuthorsInput = () => {
        const { data, isLoading } = useGetList('authors');
        return (
            <SelectInput
                source="author"
                choices={data}
                optionText={record =>
                    `${record.first_name} ${record.last_name}`
                }
                isLoading={isLoading}
            />
        );
    };
    return (
        <Admin dataProvider={dataProviderWithAuthors} history={history}>
            <Resource
                name="authors"
                recordRepresentation={record =>
                    `${record.first_name} ${record.last_name}`
                }
            />
            <Resource
                name="books"
                edit={() => (
                    <Edit
                        mutationMode="pessimistic"
                        mutationOptions={{
                            onSuccess: data => {
                                console.log(data);
                            },
                        }}
                    >
                        <SimpleForm>
                            <BookAuthorsInput />
                            <FormInspector name="author" />
                        </SimpleForm>
                    </Edit>
                )}
            />
        </Admin>
    );
};

export const InsideReferenceInput = () => (
    <Admin dataProvider={dataProviderWithAuthors} history={history}>
        <Resource
            name="authors"
            recordRepresentation={record =>
                `${record.first_name} ${record.last_name}`
            }
        />
        <Resource
            name="books"
            edit={() => (
                <Edit
                    mutationMode="pessimistic"
                    mutationOptions={{
                        onSuccess: data => {
                            console.log(data);
                        },
                    }}
                >
                    <SimpleForm>
                        <ReferenceInput reference="authors" source="author">
                            <SelectInput />
                        </ReferenceInput>
                        <FormInspector name="author" />
                    </SimpleForm>
                </Edit>
            )}
        />
    </Admin>
);

export const InsideReferenceInputDefaultValue = ({
    onSuccess = console.log,
}) => (
    <Admin
        dataProvider={{
            ...dataProviderWithAuthors,
            getOne: () =>
                Promise.resolve({
                    data: {
                        id: 1,
                        title: 'War and Peace',
                        // trigger default value
                        author: undefined,
                        summary:
                            "War and Peace broadly focuses on Napoleon's invasion of Russia, and the impact it had on Tsarist society. The book explores themes such as revolution, revolution and empire, the growth and decline of various states and the impact it had on their economies, culture, and society.",
                        year: 1869,
                    },
                }),
        }}
        history={history}
    >
        <Resource
            name="authors"
            recordRepresentation={record =>
                `${record.first_name} ${record.last_name}`
            }
        />
        <Resource
            name="books"
            edit={() => (
                <Edit
                    mutationMode="pessimistic"
                    mutationOptions={{ onSuccess }}
                >
                    <SimpleForm>
                        <TextInput source="title" />
                        <ReferenceInput reference="authors" source="author">
                            <SelectInput />
                        </ReferenceInput>
                        <FormInspector name="author" />
                    </SimpleForm>
                </Edit>
            )}
        />
    </Admin>
);

export const InsideReferenceInputWithError = () => (
    <Admin
        dataProvider={{
            ...dataProviderWithAuthors,
            getList: () => Promise.reject('error'),
        }}
        history={history}
    >
        <Resource
            name="authors"
            recordRepresentation={record =>
                `${record.first_name} ${record.last_name}`
            }
        />
        <Resource
            name="books"
            edit={() => (
                <Edit
                    mutationMode="pessimistic"
                    mutationOptions={{
                        onSuccess: data => {
                            console.log(data);
                        },
                    }}
                >
                    <SimpleForm>
                        <ReferenceInput reference="authors" source="author">
                            <SelectInput />
                        </ReferenceInput>
                        <FormInspector name="author" />
                    </SimpleForm>
                </Edit>
            )}
        />
    </Admin>
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
        >
            <Edit resource="posts" id="1">
                <SimpleForm>
                    <SelectInput
                        label="translateChoice default"
                        source="gender"
                        id="gender1"
                        choices={[
                            { id: 'M', name: 'option.male' },
                            { id: 'F', name: 'option.female' },
                        ]}
                    />
                    <SelectInput
                        label="translateChoice true"
                        source="gender"
                        id="gender2"
                        choices={[
                            { id: 'M', name: 'option.male' },
                            { id: 'F', name: 'option.female' },
                        ]}
                        translateChoice
                    />
                    <SelectInput
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
                        <SelectInput
                            optionText="name"
                            label="inside ReferenceInput"
                            id="gender4"
                        />
                    </ReferenceInput>
                    <ReferenceInput reference="genders" source="gender">
                        <SelectInput
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
