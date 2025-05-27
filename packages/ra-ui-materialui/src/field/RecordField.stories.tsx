import * as React from 'react';
import { Stack, Typography } from '@mui/material';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import {
    I18nContextProvider,
    RecordContextProvider,
    ResourceContext,
} from 'ra-core';

import { NumberField, TextField } from '.';
import { RecordField } from './RecordField';

export default { title: 'ra-ui-materialui/fields/RecordField' };

const record = {
    id: 1,
    title: 'War and Peace',
    author: 'Leo Tolstoy',
    summary:
        "War and Peace broadly focuses on Napoleon's invasion of Russia, and the impact it had on Tsarist society. The book explores themes such as revolution, revolution and empire, the growth and decline of various states and the impact it had on their economies, culture, and society.",
    year: 1869,
};

export const Basic = () => (
    <ResourceContext.Provider value="books">
        <RecordContextProvider value={record}>
            <Stack gap={1} sx={{ py: 1, px: 2 }}>
                <RecordField source="id" />
                <RecordField source="title" />
                <RecordField source="author" />
                <RecordField source="summary" />
                <RecordField source="year" field={NumberField} />
            </Stack>
        </RecordContextProvider>
    </ResourceContext.Provider>
);

export const Source = () => (
    <ResourceContext.Provider value="books">
        <RecordContextProvider
            value={{
                id: 1,
                'author.name': 'Leo Tolstoy',
            }}
        >
            <Stack>
                <RecordField source="author.name" />
                <RecordField source="missing.field" />
            </Stack>
        </RecordContextProvider>
    </ResourceContext.Provider>
);

export const Field = () => (
    <ResourceContext.Provider value="books">
        <RecordContextProvider value={record}>
            <Stack>
                <RecordField source="year" field={NumberField} />
            </Stack>
        </RecordContextProvider>
    </ResourceContext.Provider>
);

const translations = {
    'books.title.missing': 'No title',
    'books.year.missing': '0',
};

export const Empty = () => (
    <I18nContextProvider
        value={{
            getLocale: () => 'en',
            translate: m => translations[m] || m,
            changeLocale: async () => {},
        }}
    >
        <ResourceContext.Provider value="books">
            <RecordContextProvider value={{}}>
                <Stack>
                    <RecordField source="title" empty="books.title.missing" />
                    <RecordField
                        source="author"
                        empty={<>Unknown author</>}
                        render={record => record.author}
                    />
                    <RecordField
                        source="year"
                        field={NumberField}
                        empty="books.year.missing"
                    />
                </Stack>
            </RecordContextProvider>
        </ResourceContext.Provider>
    </I18nContextProvider>
);

export const Render = () => (
    <ResourceContext.Provider value="books">
        <RecordContextProvider value={record}>
            <Stack>
                <RecordField
                    label="Title"
                    render={record => record.title.toUpperCase()}
                />
                <RecordField
                    source="author"
                    render={record => (
                        <span>{record.author.toUpperCase()}</span>
                    )}
                />
                <RecordField
                    label="Missing field"
                    render={record => record.missingField}
                />
                <RecordContextProvider value={undefined}>
                    <RecordField
                        label="Summary"
                        render={record => record.summary}
                    />
                </RecordContextProvider>
            </Stack>
        </RecordContextProvider>
    </ResourceContext.Provider>
);

export const Children = () => (
    <ResourceContext.Provider value="books">
        <RecordContextProvider value={record}>
            <Stack>
                <RecordField label="Author">
                    <TextField source="author" variant="body1" />{' '}
                    <Typography component="span">(DECD)</Typography>
                </RecordField>
            </Stack>
        </RecordContextProvider>
    </ResourceContext.Provider>
);

export const Label = () => (
    <ResourceContext.Provider value="books">
        <RecordContextProvider value={record}>
            <Stack gap={1} sx={{ py: 1, px: 2 }}>
                <RecordField label="Identifier" source="id" />
                <RecordField source="title" />
                <RecordField label="Author name" source="author" />
                <RecordField label={false} source="summary" />
                <RecordField source="year" field={NumberField} />
            </Stack>
        </RecordContextProvider>
    </ResourceContext.Provider>
);

export const DirectionRow = () => (
    <ResourceContext.Provider value="books">
        <RecordContextProvider value={record}>
            <Stack gap={1} sx={{ py: 1, px: 2 }} direction="row">
                <RecordField source="id" />
                <RecordField source="title" />
                <RecordField source="author" />
                <RecordField source="summary" />
                <RecordField source="year" field={NumberField} />
            </Stack>
        </RecordContextProvider>
    </ResourceContext.Provider>
);

export const Variant = () => (
    <ResourceContext.Provider value="books">
        <RecordContextProvider value={record}>
            <Typography gutterBottom>Default label width</Typography>
            <Stack>
                <RecordField
                    variant="inline"
                    source="id"
                    TypographyProps={{ sx: { width: 200 } }}
                />
                <RecordField variant="inline" source="title" />
                <RecordField variant="inline" source="author" />
                <RecordField variant="inline" source="summary" />
                <RecordField
                    variant="inline"
                    source="year"
                    field={NumberField}
                />
            </Stack>
            <Typography gutterBottom>Custom label width</Typography>
            <ThemeProvider
                theme={createTheme({
                    components: {
                        RaRecordField: {
                            defaultProps: {
                                variant: 'inline',
                            },
                        },
                    },
                })}
            >
                <Stack sx={{ '& .RaRecordField-label': { width: 200 } }}>
                    <RecordField variant="inline" source="id" />
                    <RecordField variant="inline" source="title" />
                    <RecordField variant="inline" source="author" />
                    <RecordField variant="inline" source="summary" />
                    <RecordField
                        variant="inline"
                        source="year"
                        field={NumberField}
                    />
                </Stack>
                <Typography gutterBottom>Default variant via theme</Typography>
                <Stack>
                    <RecordField
                        source="id"
                        TypographyProps={{ sx: { width: 200 } }}
                    />
                    <RecordField source="title" />
                    <RecordField source="author" />
                    <RecordField source="summary" />
                    <RecordField source="year" field={NumberField} />
                </Stack>
            </ThemeProvider>
        </RecordContextProvider>
    </ResourceContext.Provider>
);

export const SX = () => (
    <ResourceContext.Provider value="books">
        <RecordContextProvider value={record}>
            <Stack gap={1} sx={{ py: 1, px: 2 }}>
                <RecordField source="id" sx={{ opacity: 0.5 }} />
                <RecordField source="title" sx={{ color: 'info.main' }} />
                <RecordField
                    source="author"
                    sx={{ borderLeft: 'solid 2px green', pl: 1 }}
                />
                <RecordField source="summary">
                    <TextField source="summary" sx={{ fontStyle: 'italic' }} />
                </RecordField>
                <RecordField
                    source="year"
                    field={NumberField}
                    sx={{ '& .RaRecordField-label': { color: 'red' } }}
                />
            </Stack>
        </RecordContextProvider>
    </ResourceContext.Provider>
);

export const I18nKey = () => (
    <I18nContextProvider
        value={{
            getLocale: () => 'en',
            translate: m => m,
            changeLocale: async () => {},
        }}
    >
        <ResourceContext.Provider value="books">
            <RecordContextProvider value={record}>
                <Stack gap={1} sx={{ py: 1, px: 2 }}>
                    <RecordField source="id" />
                    <RecordField source="title" />
                    <RecordField source="author" />
                    <RecordField source="summary" />
                    <RecordField source="year" field={NumberField} />
                </Stack>
            </RecordContextProvider>
        </ResourceContext.Provider>
    </I18nContextProvider>
);

type Book = {
    id: string;
    title: string;
    author: string;
    summary: string;
    year: number;
};

export const Generic = () => {
    const Field = RecordField<Book>;
    return (
        <ResourceContext.Provider value="books">
            <RecordContextProvider value={record}>
                <Stack gap={1} sx={{ py: 1, px: 2 }}>
                    <Field source="id" />
                    <Field source="title" />
                    <Field source="author" />
                    <Field source="summary" />
                    <Field source="year" field={NumberField} />
                </Stack>
            </RecordContextProvider>
        </ResourceContext.Provider>
    );
};

export const Nested = () => (
    <ResourceContext.Provider value="books">
        <RecordContextProvider value={record}>
            <Stack gap={1} sx={{ py: 1, px: 2 }}>
                <RecordField source="title" />
                <RecordField source="summary" />
                <RecordField label="Others">
                    <Stack direction="row" sx={{ padding: 0 }}>
                        <RecordField source="id" sx={{ width: 50 }} />
                        <RecordField source="author" sx={{ width: 150 }} />
                        <RecordField source="year" field={NumberField} />
                    </Stack>
                </RecordField>
            </Stack>
        </RecordContextProvider>
    </ResourceContext.Provider>
);
