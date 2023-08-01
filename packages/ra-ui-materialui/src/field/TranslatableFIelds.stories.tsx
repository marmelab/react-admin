import * as React from 'react';
import { TranslatableFields } from './TranslatableFields';
import { TextField } from './TextField';
import { RecordContextProvider, useTranslatableContext } from 'ra-core';

export default { title: 'ra-ui-materialui/fields/TranslatableFields' };

const record = {
    id: 123,
    name: {
        en: 'english name',
        fr: 'french name',
    },
    description: {
        en: 'english description',
        fr: 'french description',
    },
    nested: {
        field: {
            en: 'english nested field',
            fr: 'french nested field',
        },
    },
};

export const Basic = () => (
    <RecordContextProvider value={record}>
        <TranslatableFields locales={['en', 'fr']}>
            <TextField source="name" />
            <TextField source="description" />
            <TextField source="nested.field" />
        </TranslatableFields>
    </RecordContextProvider>
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
    <RecordContextProvider value={record}>
        <TranslatableFields
            record={record}
            resource="products"
            locales={['en', 'fr']}
            selector={<Selector />}
        >
            <TextField source="name" />
            <TextField source="description" />
            <TextField source="nested.field" />
        </TranslatableFields>
    </RecordContextProvider>
);
