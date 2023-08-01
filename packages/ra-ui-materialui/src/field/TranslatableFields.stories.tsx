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
            <TextField source="internal_organizations.OCP" label="OCP" />
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
                internal_organizations: {
                    OCB: {
                        en: 'Brussels operational center',
                        fr: 'Centre opérationnel de Bruxelles',
                    },
                    OCP: {
                        en: 'Paris operational center',
                        fr: 'Centre opérationnel de Paris',
                    },
                },
            }}
        >
            <SimpleShowLayout>{children}</SimpleShowLayout>
        </RecordContextProvider>
    </AdminContext>
);
