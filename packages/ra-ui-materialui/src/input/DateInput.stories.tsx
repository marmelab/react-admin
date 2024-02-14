import * as React from 'react';
import polyglotI18nProvider from 'ra-i18n-polyglot';
import englishMessages from 'ra-language-english';
import { Resource, minValue } from 'ra-core';

import { AdminContext } from '../AdminContext';
import { Create, Edit } from '../detail';
import { SimpleForm } from '../form';
import { DateInput } from './DateInput';
import { FormInspector } from './common';
import { history } from './common/history';
import { Admin } from 'react-admin';
import { TextInput } from './TextInput';
import { BooksCreate } from './common/BooksCreate';
import { BooksList } from './common/BooksList';
import { dataProvider } from './common/dataProvider';

export default { title: 'ra-ui-materialui/input/DateInput' };

export const Basic = () => (
    <Wrapper>
        <DateInput source="published" />
    </Wrapper>
);

export const FullWidth = () => (
    <Wrapper>
        <DateInput source="published" fullWidth />
    </Wrapper>
);

export const Disabled = () => (
    <Wrapper>
        <DateInput source="published" disabled />
    </Wrapper>
);

export const ReadOnly = () => (
    <Wrapper>
        <DateInput source="published" readOnly />
    </Wrapper>
);

export const Validate = () => (
    <Wrapper>
        <DateInput source="published" validate={minValue('2022-10-26')} />
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
            <DateInput source="time" readOnly />
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
