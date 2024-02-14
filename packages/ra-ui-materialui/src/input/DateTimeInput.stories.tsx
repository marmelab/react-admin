import * as React from 'react';
import polyglotI18nProvider from 'ra-i18n-polyglot';
import englishMessages from 'ra-language-english';

import { AdminContext } from '../AdminContext';
import { Create, Edit } from '../detail';
import { SimpleForm } from '../form';
import { DateTimeInput } from './DateTimeInput';
import { FormInspector } from './common';
import { Resource } from 'ra-core';
import { Admin } from 'react-admin';
import { TextInput } from './TextInput';
import { BooksCreate } from './common/BooksCreate';
import { BooksList } from './common/BooksList';
import { dataProvider } from './common/dataProvider';
import { history } from './common/history';

export default { title: 'ra-ui-materialui/input/DateTimeInput' };

export const Basic = () => (
    <Wrapper>
        <DateTimeInput source="published" />
    </Wrapper>
);

export const FullWidth = () => (
    <Wrapper>
        <DateTimeInput source="published" fullWidth />
    </Wrapper>
);

export const Disabled = () => (
    <Wrapper>
        <DateTimeInput source="published" disabled />
    </Wrapper>
);

export const ReadOnly = () => (
    <Wrapper>
        <DateTimeInput source="published" readOnly />
    </Wrapper>
);

const i18nProvider = polyglotI18nProvider(() => englishMessages);

const Wrapper = ({ children }) => (
    <AdminContext i18nProvider={i18nProvider}>
        <Create resource="posts">
            <SimpleForm>
                {children}
                <FormInspector name="published" />
            </SimpleForm>
        </Create>
    </AdminContext>
);

const BooksEdit = () => (
    <Edit>
        <SimpleForm>
            <TextInput source="title.en" label="Title" />
            <DateTimeInput source="time" readOnly />
        </SimpleForm>
    </Edit>
);

export const FullApp = () => {
    React.useEffect(() => {
        history.replace('/books/5/edit');
    }, []);

    return (
        <Admin dataProvider={dataProvider} history={history}>
            <Resource
                name="books"
                list={BooksList}
                edit={BooksEdit}
                create={BooksCreate}
            />
        </Admin>
    );
};
