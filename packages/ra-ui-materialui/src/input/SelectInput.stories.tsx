import * as React from 'react';
import { createMemoryHistory } from 'history';
import { Admin, AdminContext } from 'react-admin';
import { Resource } from 'ra-core';
import polyglotI18nProvider from 'ra-i18n-polyglot';
import englishMessages from 'ra-language-english';

import { Create, Edit } from '../detail';
import { SimpleForm } from '../form';
import { SelectInput } from './SelectInput';
import { ReferenceInput } from './ReferenceInput';

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

const i18nProvider = polyglotI18nProvider(() => englishMessages);

const Wrapper = ({ children }) => (
    <AdminContext i18nProvider={i18nProvider}>
        <Create resource="posts">
            <SimpleForm>{children}</SimpleForm>
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
    update: (resource, params) => Promise.resolve(params),
    create: (resource, params) => {
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
                <SelectInput fullWidth />
            </ReferenceInput>
        </SimpleForm>
    </Edit>
);

const history = createMemoryHistory({ initialEntries: ['/books/1'] });

export const InsideReferenceInput = () => (
    <Admin dataProvider={dataProviderWithAuthors} history={history}>
        <Resource
            name="authors"
            recordRepresentation={record =>
                `${record.first_name} ${record.last_name}`
            }
        />
        <Resource name="books" edit={BookEditWithReference} />
    </Admin>
);
