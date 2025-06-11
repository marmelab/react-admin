import { RecordContextProvider } from 'ra-core';
import polyglotI18nProvider from 'ra-i18n-polyglot';
import englishMessages from 'ra-language-english';
import frenchMessages from 'ra-language-french';
import * as React from 'react';
import { deepmerge } from '@mui/utils';
import { createTheme, ThemeOptions } from '@mui/material';

import { AdminContext } from '../AdminContext';
import { Labeled } from '../Labeled';
import { SelectField } from './SelectField';

export default {
    title: 'ra-ui-materialui/fields/SelectField',
};

const i18nProvider = polyglotI18nProvider(
    locale => (locale === 'fr' ? frenchMessages : englishMessages),
    'en',
    [
        { locale: 'en', name: 'English' },
        { locale: 'fr', name: 'Français' },
    ]
);

const record = {
    id: 1,
    gender: 'M',
    language: 'ar',
    country: 'Albania',
    data: 'no results',
};

const genderChoices = [
    { id: 'M', name: 'Male' },
    { id: 'F', name: 'Female' },
];

export const Basic = () => (
    <Wrapper record={record}>
        <SelectField source="gender" choices={genderChoices} />
    </Wrapper>
);

const languages = [
    { id: 'am', name: 'Amharic', nativeName: 'አማርኛ' },
    { id: 'ar', name: 'Arabic', nativeName: 'العربية' },
];
export const OptionText = () => (
    <Wrapper record={record}>
        <SelectField
            source="language"
            choices={languages}
            optionText="nativeName"
        />
    </Wrapper>
);

const countries = [{ name: 'Arabic', code: 'ar' }];
export const OptionValue = () => (
    <Wrapper record={record}>
        <SelectField source="language" choices={countries} optionValue="code" />
    </Wrapper>
);

const optionRenderer = choice => `${choice.first_name} ${choice.last_name}`;
const authors = [{ id: 1, first_name: 'John', last_name: 'Doe' }];
export const OptionTextFunction = () => (
    <Wrapper record={{ id: 1 }}>
        <SelectField
            source="id"
            choices={authors}
            optionText={optionRenderer}
        />
    </Wrapper>
);

const translateChoice = [
    { id: 'no results', name: 'ra.navigation.no_results' },
];
export const TranslateChoice = () => (
    <Wrapper record={record}>
        <Labeled
            label="translateChoice={true}"
            sx={{ border: '1px solid', margin: '1rem', padding: '1rem' }}
        >
            <SelectField
                source="data"
                choices={translateChoice}
                // translateChoice={true} is set by default
            />
        </Labeled>
        <Labeled
            label="translateChoice={false}"
            sx={{ border: '1px solid', margin: '1rem', padding: '1rem' }}
        >
            <SelectField
                source="data"
                choices={translateChoice}
                translateChoice={false}
            />
        </Labeled>
    </Wrapper>
);

export const Themed = () => (
    <Wrapper
        record={record}
        theme={deepmerge(createTheme(), {
            components: {
                RaSelectField: {
                    defaultProps: {
                        'data-testid': 'themed',
                    },
                    styleOverrides: {
                        root: {
                            color: 'hotpink',
                        },
                    },
                },
            },
        } as ThemeOptions)}
    >
        <SelectField source="gender" choices={genderChoices} />
    </Wrapper>
);

const Wrapper = ({
    children,
    record,
    theme = undefined,
    defaultTheme = 'light',
}) => (
    <AdminContext
        i18nProvider={i18nProvider}
        theme={theme}
        defaultTheme={defaultTheme as any}
    >
        <RecordContextProvider value={record}>{children}</RecordContextProvider>
    </AdminContext>
);
