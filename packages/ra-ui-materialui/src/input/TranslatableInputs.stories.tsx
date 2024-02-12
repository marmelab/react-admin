import * as React from 'react';
import polyglotI18nProvider from 'ra-i18n-polyglot';
import englishMessages from 'ra-language-english';

import { AdminContext } from '../AdminContext';
import { Create, Edit } from '../detail';
import { SimpleForm } from '../form';
import { TranslatableInputs } from './TranslatableInputs';
import { FormInspector } from './common';
import { TextInput } from './TextInput';
import { Resource } from 'ra-core';
import Admin from '../../../react-admin/src/Admin';
import { BooksCreate } from './common/BooksCreate';
import { BooksList } from './common/BooksList';
import { dataProvider } from './common/dataProvider';
import { history } from './common/history';

export default { title: 'ra-ui-materialui/input/TranslatableInputs' };

export const Basic = () => (
    <Wrapper>
        <TranslatableInputs locales={['en', 'fr']}>
            <TextInput source="title" />
            <TextInput source="description" />
        </TranslatableInputs>
    </Wrapper>
);

export const Disabled = () => (
    <Wrapper>
        <TranslatableInputs locales={['en', 'fr']} disabled>
            <TextInput source="title" />
            <TextInput source="description" />
        </TranslatableInputs>
    </Wrapper>
);

export const ReadOnly = () => (
    <Wrapper>
        <TranslatableInputs locales={['en', 'fr']} readOnly>
            <TextInput source="title" />
            <TextInput source="description" />
        </TranslatableInputs>
    </Wrapper>
);

export const FullWidth = () => (
    <Wrapper>
        <TranslatableInputs locales={['en', 'fr']} fullWidth>
            <TextInput source="title" />
            <TextInput source="description" />
        </TranslatableInputs>
    </Wrapper>
);

export const SingleInput = () => (
    <Wrapper>
        <TranslatableInputs locales={['en', 'fr']}>
            <TextInput source="title" />
        </TranslatableInputs>
    </Wrapper>
);

export const Row = () => (
    <Wrapper>
        <TranslatableInputs
            locales={['en', 'fr']}
            StackProps={{ direction: 'row' }}
        >
            <TextInput source="title" />
            <TextInput source="description" sx={{ marginLeft: 2 }} />
        </TranslatableInputs>
    </Wrapper>
);

export const Sx = () => (
    <Wrapper>
        <TranslatableInputs
            locales={['en', 'fr']}
            sx={{ border: 'solid 1px red' }}
        >
            <TextInput source="title" />
            <TextInput source="description" />
        </TranslatableInputs>
    </Wrapper>
);

const i18nProvider = polyglotI18nProvider(() => englishMessages);

const Wrapper = ({ children }) => (
    <AdminContext i18nProvider={i18nProvider}>
        <Create resource="posts">
            <SimpleForm>
                {children}
                <FormInspector name="title" />
            </SimpleForm>
        </Create>
    </AdminContext>
);

const BooksEdit = () => (
    <Edit>
        <SimpleForm>
            <TranslatableInputs locales={['en', 'fr']} readOnly>
                <TextInput source="title" label="Title" />
            </TranslatableInputs>
            <TextInput source="author" />
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
