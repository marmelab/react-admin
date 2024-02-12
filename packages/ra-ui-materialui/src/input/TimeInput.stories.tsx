import * as React from 'react';
import polyglotI18nProvider from 'ra-i18n-polyglot';
import englishMessages from 'ra-language-english';

import { AdminContext } from '../AdminContext';
import { Create, Edit } from '../detail';
import { SimpleForm } from '../form';
import { TimeInput } from './TimeInput';
import { FormInspector } from './common';
import { TextInput } from './TextInput';
import { NumberInput } from './NumberInput';
import { dataProvider } from './common/dataProvider';
import { history } from './common/history';
import Admin from '../../../react-admin/src/Admin';
import { Resource } from 'ra-core';
import { BooksList } from './common/BooksList';
import { BooksCreate } from './common/BooksCreate';

export default { title: 'ra-ui-materialui/input/TimeInput' };

export const Basic = () => (
    <Wrapper>
        <TimeInput source="published" />
    </Wrapper>
);

export const FullWidth = () => (
    <Wrapper>
        <TimeInput source="published" fullWidth />
    </Wrapper>
);

export const Disabled = () => (
    <Wrapper>
        <TimeInput source="published" disabled />
    </Wrapper>
);
export const ReadOnly = () => (
    <Wrapper>
        <TimeInput source="published" readOnly />
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
            <TextInput source="title.en" label="Title" readOnly />
            <TextInput source="author" />
            <NumberInput source="year" />
            <TimeInput source="time" readOnly />
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
