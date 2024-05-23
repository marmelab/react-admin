import {
    RecordContextProvider,
    Resource,
    ResourceContextProvider,
    useTranslatableContext,
} from 'ra-core';
import fakeRestDataProvider from 'ra-data-fakerest';
import polyglotI18nProvider from 'ra-i18n-polyglot';
import englishMessages from 'ra-language-english';
import * as React from 'react';
import { AdminContext, AdminContextProps } from '../AdminContext';
import { AdminUI } from '../AdminUI';
import { Show, SimpleShowLayout } from '../detail';
import { TextField } from './TextField';
import { TranslatableFields } from './TranslatableFields';
import { ListGuesser } from '../list';

export default { title: 'ra-ui-materialui/fields/TranslatableFields' };

const defaultData = [
    {
        id: 123,
        title: {
            en: 'Doctors Without Borders',
            fr: 'Médecins sans frontières',
        },
        description: {
            en: 'International humanitarian medical non-governmental organisation of French origin',
            fr: "Organisation non gouvernementale (ONG) médicale humanitaire internationale d'origine française fondée en 1971 à Paris",
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
    },
];
const i18nProvider = polyglotI18nProvider(() => englishMessages);

const Wrapper = ({
    children,
    ...props
}: Omit<AdminContextProps, 'children'> & { children: React.ReactNode }) => (
    <AdminContext defaultTheme="light" {...props}>
        <ResourceContextProvider value="ngos">
            <RecordContextProvider value={defaultData[0]}>
                <SimpleShowLayout>{children}</SimpleShowLayout>
            </RecordContextProvider>
        </ResourceContextProvider>
    </AdminContext>
);

export const Basic = () => (
    <Wrapper i18nProvider={i18nProvider}>
        <TranslatableFields locales={['en', 'fr']}>
            <TextField source="title" />,
            <TextField source="description" />,
        </TranslatableFields>
    </Wrapper>
);

export const WithoutI18nProvider = () => (
    <Wrapper>
        <TranslatableFields locales={['en', 'fr']}>
            <TextField source="title" />,
            <TextField source="description" />,
        </TranslatableFields>
    </Wrapper>
);

export const SingleField = () => (
    <Wrapper i18nProvider={i18nProvider}>
        <TranslatableFields locales={['en', 'fr']}>
            <TextField source="title" />
        </TranslatableFields>
    </Wrapper>
);

const Selector = () => {
    const { locales, selectLocale, selectedLocale } = useTranslatableContext();

    const handleChange = event => {
        selectLocale(event.target.value);
    };

    return (
        <select
            aria-label="Select the locale"
            onChange={handleChange}
            value={selectedLocale}
        >
            {locales.map(locale => (
                <option
                    key={locale}
                    value={locale}
                    id={`translatable-header-${locale}`}
                >
                    {locale}
                </option>
            ))}
        </select>
    );
};

export const CustomSelector = () => (
    <Wrapper i18nProvider={i18nProvider}>
        <TranslatableFields locales={['en', 'fr']} selector={<Selector />}>
            <TextField source="title" />
            <TextField source="description" />
        </TranslatableFields>
    </Wrapper>
);

export const NestedFields = () => (
    <Wrapper i18nProvider={i18nProvider}>
        <TranslatableFields locales={['en', 'fr']}>
            <TextField source="internal_organizations.OCP" />
        </TranslatableFields>
    </Wrapper>
);

export const WithLabels = () => (
    <Wrapper i18nProvider={i18nProvider}>
        <TranslatableFields locales={['en', 'fr']}>
            <TextField source="title" label="My Title" />,
            <TextField source="description" label="My Desc" />,
        </TranslatableFields>
    </Wrapper>
);

const dataProvider = fakeRestDataProvider({
    ngos: defaultData,
});

const ShowNgo = () => (
    <Show>
        <SimpleShowLayout>
            <TranslatableFields locales={['en', 'fr']}>
                <TextField source="title" />,
                <TextField source="description" />,
            </TranslatableFields>
        </SimpleShowLayout>
    </Show>
);

export const FullApp = () => (
    <AdminContext dataProvider={dataProvider} i18nProvider={i18nProvider}>
        <AdminUI>
            <Resource name="ngos" list={ListGuesser} show={ShowNgo} />
        </AdminUI>
    </AdminContext>
);
