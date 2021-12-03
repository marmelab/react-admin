import * as React from 'react';
import { Admin } from 'react-admin';
import { Resource, required } from 'ra-core';
import { createMemoryHistory } from 'history';

import { Edit } from '../detail';
import { SimpleForm } from '../form';
import { AutocompleteInput } from './AutocompleteInput';
import { ReferenceInput } from './ReferenceInput';

export default { title: 'ra-ui-materialui/input/AutocompleteInput' };

const dataProvider = {
    getOne: (resource, params) =>
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
    update: (resource, params) => Promise.resolve(params),
} as any;

const history = createMemoryHistory({ initialEntries: ['/books/1'] });

const BookEdit = () => {
    const choices = [
        { id: 1, name: 'Leo Tolstoy' },
        { id: 2, name: 'Victor Hugo' },
        { id: 3, name: 'William Shakespeare' },
        { id: 4, name: 'Charles Baudelaire' },
        { id: 5, name: 'Marcel Proust' },
    ];
    return (
        <Edit
            mutationMode="pessimistic"
            mutationOptions={{
                onSuccess: data => {
                    console.log(data);
                },
            }}
        >
            <SimpleForm>
                <AutocompleteInput
                    source="author"
                    choices={choices}
                    validate={required()}
                />
            </SimpleForm>
        </Edit>
    );
};

export const Basic = () => (
    <Admin dataProvider={dataProvider} history={history}>
        <Resource name="books" edit={BookEdit} />
    </Admin>
);

const BookEditCustomText = () => {
    const choices = [
        { id: 1, fullName: 'Leo Tolstoy' },
        { id: 2, fullName: 'Victor Hugo' },
        { id: 3, fullName: 'William Shakespeare' },
        { id: 4, fullName: 'Charles Baudelaire' },
        { id: 5, fullName: 'Marcel Proust' },
    ];
    return (
        <Edit
            mutationMode="pessimistic"
            mutationOptions={{
                onSuccess: data => {
                    console.log(data);
                },
            }}
        >
            <SimpleForm>
                <AutocompleteInput
                    source="author"
                    optionText="fullName"
                    choices={choices}
                />
            </SimpleForm>
        </Edit>
    );
};

export const CustomText = () => (
    <Admin dataProvider={dataProvider} history={history}>
        <Resource name="books" edit={BookEditCustomText} />
    </Admin>
);

const BookEditCustomTextFunction = () => {
    const choices = [
        { id: 1, fullName: 'Leo Tolstoy' },
        { id: 2, fullName: 'Victor Hugo' },
        { id: 3, fullName: 'William Shakespeare' },
        { id: 4, fullName: 'Charles Baudelaire' },
        { id: 5, fullName: 'Marcel Proust' },
    ];
    return (
        <Edit
            mutationMode="pessimistic"
            mutationOptions={{
                onSuccess: data => {
                    console.log(data);
                },
            }}
        >
            <SimpleForm>
                <AutocompleteInput
                    source="author"
                    optionText={choice => choice?.fullName}
                    choices={choices}
                />
            </SimpleForm>
        </Edit>
    );
};

export const CustomTextFunction = () => (
    <Admin dataProvider={dataProvider} history={history}>
        <Resource name="books" edit={BookEditCustomTextFunction} />
    </Admin>
);

const BookEditCustomOptions = () => {
    const choices = [
        { id: 1, fullName: 'Leo Tolstoy', language: 'Russian' },
        { id: 2, fullName: 'Victor Hugo', language: 'French' },
        { id: 3, fullName: 'William Shakespeare', language: 'English' },
        { id: 4, fullName: 'Charles Baudelaire', language: 'French' },
        { id: 5, fullName: 'Marcel Proust', language: 'French' },
    ];
    return (
        <Edit
            mutationMode="pessimistic"
            mutationOptions={{
                onSuccess: data => {
                    console.log(data);
                },
            }}
        >
            <SimpleForm>
                <AutocompleteInput
                    source="author"
                    optionText="fullName"
                    choices={choices}
                    options={{
                        renderOption: (props, choice) => (
                            <div {...props}>
                                {choice.fullName} <i>({choice.language})</i>
                            </div>
                        ),
                    }}
                />
            </SimpleForm>
        </Edit>
    );
};

export const CustomOptions = () => (
    <Admin dataProvider={dataProvider} history={history}>
        <Resource name="books" edit={BookEditCustomOptions} />
    </Admin>
);

const choicesForCreationSupport = [
    { id: 1, name: 'Leo Tolstoy' },
    { id: 2, name: 'Victor Hugo' },
    { id: 3, name: 'William Shakespeare' },
    { id: 4, name: 'Charles Baudelaire' },
    { id: 5, name: 'Marcel Proust' },
];
const BookEditWithCreationSupport = () => (
    <Edit
        mutationMode="pessimistic"
        mutationOptions={{
            onSuccess: data => {
                console.log(data);
            },
        }}
    >
        <SimpleForm>
            <AutocompleteInput
                source="author"
                choices={choicesForCreationSupport}
                onCreate={filter => {
                    const newAuthorName = window.prompt(
                        'Enter a new author',
                        filter
                    );

                    if (newAuthorName) {
                        const newAuthor = {
                            id: choicesForCreationSupport.length + 1,
                            name: newAuthorName,
                        };
                        choicesForCreationSupport.push(newAuthor);
                        return newAuthor;
                    }
                }}
            />
        </SimpleForm>
    </Edit>
);

export const CreationSupport = () => (
    <Admin dataProvider={dataProvider} history={history}>
        <Resource name="books" edit={BookEditWithCreationSupport} />
    </Admin>
);

const authors = [
    { id: 1, name: 'Leo Tolstoy', language: 'Russian' },
    { id: 2, name: 'Victor Hugo', language: 'French' },
    { id: 3, name: 'William Shakespeare', language: 'English' },
    { id: 4, name: 'Charles Baudelaire', language: 'French' },
    { id: 5, name: 'Marcel Proust', language: 'French' },
];

const dataProviderWithAuthors = {
    getOne: (resource, params) =>
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
    getMany: (resource, params) =>
        Promise.resolve({
            data: authors.filter(author => params.ids.includes(author.id)),
        }),
    getList: (resource, params) =>
        new Promise(resolve => {
            if (params.filter.q == undefined) {
                resolve({
                    data: authors,
                    total: authors.length,
                });
            }

            const filteredAuthors = authors.filter(author =>
                author.name
                    .toLowerCase()
                    .includes(params.filter.q.toLowerCase())
            );

            resolve({
                data: filteredAuthors,
                total: filteredAuthors.length,
            });
        }),
    update: (resource, params) => Promise.resolve(params),
} as any;

const BookEditWithReference = () => (
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
                <AutocompleteInput />
            </ReferenceInput>
        </SimpleForm>
    </Edit>
);

export const InsideReferenceInput = () => (
    <Admin dataProvider={dataProviderWithAuthors} history={history}>
        <Resource name="authors" />
        <Resource name="books" edit={BookEditWithReference} />
    </Admin>
);
