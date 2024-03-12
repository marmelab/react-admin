import * as React from 'react';
import polyglotI18nProvider from 'ra-i18n-polyglot';
import englishMessages from 'ra-language-english';
import { StoreContextProvider, memoryStore, useStore } from 'ra-core';
import { deepmerge } from '@mui/utils';

import { AdminContext } from '../AdminContext';
import { Create } from '../detail';
import { SimpleForm } from '../form';
import { ImageField } from '../field';
import {
    defaultLightTheme,
    defaultDarkTheme,
    nanoDarkTheme,
    nanoLightTheme,
    radiantDarkTheme,
    radiantLightTheme,
    houseDarkTheme,
    houseLightTheme,
    useTheme,
} from '../theme';
import {
    AutocompleteInput,
    CheckboxGroupInput,
    TextInput,
    DateInput,
    AutocompleteArrayInput,
    SelectInput,
    BooleanInput,
    SelectArrayInput,
    DateTimeInput,
    NullableBooleanInput,
    NumberInput,
    RadioButtonGroupInput,
    TimeInput,
    TranslatableInputs,
    SearchInput,
    PasswordInput,
    ImageInput,
    ArrayInput,
    SimpleFormIterator,
} from './';

export default {
    title: 'ra-ui-materialui/input',
};

const themes = [
    { name: 'default', light: defaultLightTheme, dark: defaultDarkTheme },
    { name: 'nano', light: nanoLightTheme, dark: nanoDarkTheme },
    { name: 'radiant', light: radiantLightTheme, dark: radiantDarkTheme },
    { name: 'house', light: houseLightTheme, dark: houseDarkTheme },
    {
        name: 'noTheme',
        light: {},
        dark: { palette: { mode: 'dark' as const } },
    },
    {
        name: 'compat',
        light: deepmerge(defaultLightTheme, {
            components: {
                MuiFormControl: { defaultProps: { fullWidth: undefined } },
                MuiTextField: { defaultProps: { fullWidth: undefined } },
                MuiAutocomplete: { defaultProps: { fullWidth: undefined } },
                RaSimpleFormIterator: {
                    defaultProps: { fullWidth: undefined },
                },
                RaTranslatableInputs: {
                    defaultProps: { fullWidth: undefined },
                },
            },
        }),
        dark: deepmerge(defaultDarkTheme, {
            components: {
                MuiFormControl: { defaultProps: { fullWidth: undefined } },
                MuiTextField: { defaultProps: { fullWidth: undefined } },
                MuiAutocomplete: { defaultProps: { fullWidth: undefined } },
                RaSimpleFormIterator: {
                    defaultProps: { fullWidth: undefined },
                },
                RaTranslatableInputs: {
                    defaultProps: { fullWidth: undefined },
                },
            },
        }),
    },
];

const ThemeSwapper = () => {
    const [themeName, setThemeName] = useStore('themeName', 'default');
    const [mode, setMode] = useTheme('light');

    const themeButtons = themes.map(theme => (
        <>
            <button
                key={theme.name}
                onClick={() => {
                    setThemeName(theme.name);
                    setMode('light');
                }}
                style={{
                    fontWeight:
                        theme.name === themeName && mode === 'light'
                            ? 'bold'
                            : 'normal',
                    marginRight: 10,
                }}
            >
                {theme.name} light
            </button>
            <button
                key={`${theme.name}Dark`}
                onClick={() => {
                    setThemeName(theme.name);
                    setMode('dark');
                }}
                style={{
                    fontWeight:
                        theme.name === themeName && mode === 'dark'
                            ? 'bold'
                            : 'normal',
                    marginRight: 10,
                }}
            >
                {theme.name} dark
            </button>
        </>
    ));

    return <div>Theme: {themeButtons}</div>;
};

const i18nProvider = polyglotI18nProvider(() => englishMessages);
const store = memoryStore();

const AllInputsBase = () => {
    const [themeName] = useStore('themeName', 'default');
    const lightTheme = themes.find(theme => theme.name === themeName)?.light;
    const darkTheme = themes.find(theme => theme.name === themeName)?.dark;
    return (
        <AdminContext
            i18nProvider={i18nProvider}
            lightTheme={lightTheme}
            darkTheme={darkTheme}
            defaultTheme="light"
            store={store}
        >
            <ThemeSwapper />
            <Create
                resource="posts"
                record={{ id: 1, title: 'Lorem Ipsum', updated_at: new Date() }}
            >
                <SimpleForm sx={{ maxWidth: { lg: '50em' } }}>
                    <TextInput source="title" helperText="TextInput" />
                    <NumberInput
                        source="average_note"
                        helperText="NumberInput"
                    />
                    <DateInput source="published_at" helperText="DateInput" />
                    <TimeInput
                        source="published_at_time"
                        helperText="TimeInput"
                    />
                    <DateTimeInput
                        source="updated_at"
                        helperText="DateTimeInput"
                    />
                    <AutocompleteInput
                        source="author_id"
                        choices={[
                            { id: 1, name: 'John Doe' },
                            { id: 2, name: 'Jane Doe' },
                        ]}
                        helperText="AutocompleteInput"
                    />
                    <AutocompleteArrayInput
                        source="secondary_authors_id"
                        helperText="AutocompleteArrayInput"
                        choices={[
                            { id: 1, name: 'John Doe' },
                            { id: 2, name: 'Jane Doe' },
                        ]}
                    />
                    <SelectInput
                        source="status"
                        choices={[
                            { id: 'draft', name: 'Draft' },
                            { id: 'published', name: 'Published' },
                        ]}
                        helperText="SelectInput"
                    />
                    <SelectArrayInput
                        source="tags"
                        choices={[
                            { id: 1, name: 'Tech' },
                            { id: 2, name: 'Lifestyle' },
                        ]}
                        helperText="SelectArrayInput"
                    />
                    <RadioButtonGroupInput
                        source="workflow"
                        helperText="RadioButtonGroupInput"
                        choices={[
                            { id: 1, name: 'Simple' },
                            { id: 2, name: 'Manager' },
                            { id: 3, name: 'All' },
                        ]}
                    />
                    <CheckboxGroupInput
                        source="roles"
                        choices={[
                            { id: 'admin', name: 'Admin' },
                            { id: 'u001', name: 'Editor' },
                            { id: 'u002', name: 'Moderator' },
                            { id: 'u003', name: 'Reviewer' },
                        ]}
                        helperText="CheckboxGroupInput"
                    />
                    <NullableBooleanInput
                        source="exclusive"
                        helperText="NullableBooleanInput"
                    />
                    <BooleanInput
                        source="commentable"
                        helperText="BooleanInput"
                    />
                    <ArrayInput source="backlinks" helperText="ArrayInput">
                        <SimpleFormIterator>
                            <TextInput source="url" />
                            <TextInput source="title" />
                        </SimpleFormIterator>
                    </ArrayInput>
                    <TranslatableInputs
                        locales={['en', 'fr']}
                        defaultLocale="en"
                    >
                        <TextInput source="description" />
                        <TextInput source="body" />
                    </TranslatableInputs>
                    <PasswordInput
                        source="password"
                        helperText="PasswordInput"
                    />
                    <SearchInput source="q" helperText="SearchInput" />
                    <ImageInput source="pictures" helperText="ImageInput">
                        <ImageField source="src" title="title" />
                    </ImageInput>
                </SimpleForm>
            </Create>
        </AdminContext>
    );
};

export const AllInputs = () => (
    <StoreContextProvider value={store}>
        <AllInputsBase />
    </StoreContextProvider>
);
