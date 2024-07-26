import * as React from 'react';
import {
    I18nContextProvider,
    RecordContextProvider,
    ResourceContext,
} from 'ra-core';
import { TextField } from './field';
import { Labeled } from './Labeled';
import { Box, Stack } from '@mui/material';

export default { title: 'ra-ui-materialui/detail/Labeled' };

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
            <Labeled>
                <TextField source="title" />
            </Labeled>
        </RecordContextProvider>
    </ResourceContext.Provider>
);

export const LabelIntrospection = () => (
    <ResourceContext.Provider value="books">
        <RecordContextProvider value={record}>
            <Labeled>
                <TextField label="My custom Title" source="title" />
            </Labeled>
        </RecordContextProvider>
    </ResourceContext.Provider>
);

export const Label = () => (
    <ResourceContext.Provider value="books">
        <RecordContextProvider value={record}>
            <Labeled label="My custom Title">
                <TextField source="title" />
            </Labeled>
        </RecordContextProvider>
    </ResourceContext.Provider>
);

export const NoLabel = () => (
    <ResourceContext.Provider value="books">
        <RecordContextProvider value={record}>
            <Labeled>
                <TextField label={false} source="title" />
            </Labeled>
        </RecordContextProvider>
    </ResourceContext.Provider>
);

export const Color = () => (
    <ResourceContext.Provider value="books">
        <RecordContextProvider value={record}>
            <Stack gap={1} sx={{ m: 1 }}>
                <Labeled>
                    <TextField source="title" />
                </Labeled>
                <Labeled color="success.main">
                    <TextField source="title" />
                </Labeled>
                <Labeled color="#abcdef">
                    <TextField source="title" />
                </Labeled>
            </Stack>
        </RecordContextProvider>
    </ResourceContext.Provider>
);

export const IsRequired = () => (
    <ResourceContext.Provider value="books">
        <RecordContextProvider value={record}>
            <Labeled isRequired>
                <TextField source="title" />
            </Labeled>
        </RecordContextProvider>
    </ResourceContext.Provider>
);

export const NonField = () => (
    <Labeled>
        <span>War and Peace</span>
    </Labeled>
);

export const NoDoubleLabel = () => (
    <ResourceContext.Provider value="books">
        <RecordContextProvider value={record}>
            <Labeled>
                <Labeled label="My custom Title">
                    <TextField source="title" />
                </Labeled>
            </Labeled>
        </RecordContextProvider>
    </ResourceContext.Provider>
);

export const FullWidth = () => (
    <Stack alignItems="flex-start">
        <ResourceContext.Provider value="books">
            <RecordContextProvider value={record}>
                <Labeled label="title" fullWidth>
                    <Box border="1px solid">
                        <TextField source="title" />
                    </Box>
                </Labeled>
            </RecordContextProvider>
        </ResourceContext.Provider>
    </Stack>
);

export const FullWidthNoLabel = () => (
    <Stack alignItems="flex-start">
        <ResourceContext.Provider value="books">
            <RecordContextProvider value={record}>
                <Labeled label={false} fullWidth>
                    <Box border="1px solid">
                        <TextField source="title" />
                    </Box>
                </Labeled>
            </RecordContextProvider>
        </ResourceContext.Provider>
    </Stack>
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
                <Labeled>
                    <TextField source="title" />
                </Labeled>
            </RecordContextProvider>
        </ResourceContext.Provider>
    </I18nContextProvider>
);
