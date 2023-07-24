import * as React from 'react';
import polyglotI18nProvider from 'ra-i18n-polyglot';
import englishMessages from 'ra-language-english';

import { AdminContext } from '../AdminContext';
import { SimpleShowLayout } from '../detail';
import { TranslatableFields } from './TranslatableFields';
import { TextField } from './TextField';
import { RecordContextProvider } from 'ra-core';

export default { title: 'ra-ui-materialui/fields/TranslatableFields' };

export const Basic = () => (
    <Wrapper>
        <TranslatableFields locales={['en', 'fr']}>
            <TextField source="title" />
            <TextField source="description" />
        </TranslatableFields>
    </Wrapper>
);

export const SingleField = () => (
    <Wrapper>
        <TranslatableFields locales={['en', 'fr']}>
            <TextField source="title" />
        </TranslatableFields>
    </Wrapper>
);

export const AddLabel = () => (
    <Wrapper>
        <TranslatableFields locales={['en', 'fr']}>
            <TextField source="title" addLabel />
            <TextField source="description" addLabel />
        </TranslatableFields>
    </Wrapper>
);

const i18nProvider = polyglotI18nProvider(() => englishMessages);

const Wrapper = ({ children }) => (
    <AdminContext i18nProvider={i18nProvider}>
        <RecordContextProvider
            value={{
                id: 123,
                title: {
                    en: 'Doctors Without Borders',
                    fr: 'Médecins sans frontières',
                },
                description: {
                    en:
                        'International humanitarian medical non-governmental organisation of French origin',
                    fr:
                        "Organisation non gouvernementale (ONG) médicale humanitaire internationale d'origine française fondée en 1971 à Paris",
                },
            }}
        >
            <SimpleShowLayout>{children}</SimpleShowLayout>
        </RecordContextProvider>
    </AdminContext>
);
