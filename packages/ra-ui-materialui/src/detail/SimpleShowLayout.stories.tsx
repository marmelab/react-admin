import * as React from 'react';
import { Grid, Divider as MuiDivider } from '@mui/material';
import {
    RecordContextProvider,
    ResourceContext,
    useRecordContext,
    WithRecord,
} from 'ra-core';
import { Labeled } from '../Labeled';
import { TextField, NumberField } from '../field';
import { SimpleShowLayout } from './SimpleShowLayout';

export default { title: 'ra-ui-materialui/detail/SimpleShowLayout' };

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
            <SimpleShowLayout>
                <TextField source="id" />
                <TextField source="title" />
                <TextField source="author" />
                <TextField source="summary" />
                <NumberField source="year" />
            </SimpleShowLayout>
        </RecordContextProvider>
    </ResourceContext.Provider>
);

const BookTitle = () => {
    const record = useRecordContext();
    return record ? <span>{record.title}</span> : null;
};

export const CustomChild = () => (
    <ResourceContext.Provider value="books">
        <RecordContextProvider value={record}>
            <SimpleShowLayout>
                <BookTitle />
                <WithRecord render={record => <span>{record.author}</span>} />
            </SimpleShowLayout>
        </RecordContextProvider>
    </ResourceContext.Provider>
);

export const CustomLabel = () => (
    <ResourceContext.Provider value="books">
        <RecordContextProvider value={record}>
            <SimpleShowLayout>
                <TextField label="Identifier" source="id" />
                <TextField source="title" />
                <Labeled label="Author name">
                    <TextField source="author" />
                </Labeled>
                <TextField label={false} source="summary" />
                <NumberField source="year" />
            </SimpleShowLayout>
        </RecordContextProvider>
    </ResourceContext.Provider>
);

export const Spacing = () => (
    <ResourceContext.Provider value="books">
        <RecordContextProvider value={record}>
            <SimpleShowLayout spacing={3}>
                <TextField source="id" />
                <TextField source="title" />
                <TextField source="author" />
                <TextField source="summary" />
                <NumberField source="year" />
            </SimpleShowLayout>
        </RecordContextProvider>
    </ResourceContext.Provider>
);

export const Divider = () => (
    <ResourceContext.Provider value="books">
        <RecordContextProvider value={record}>
            <SimpleShowLayout divider={<MuiDivider />}>
                <TextField source="id" />
                <TextField source="title" />
                <TextField source="author" />
                <TextField source="summary" />
                <NumberField source="year" />
            </SimpleShowLayout>
        </RecordContextProvider>
    </ResourceContext.Provider>
);

export const SX = () => (
    <ResourceContext.Provider value="books">
        <RecordContextProvider value={record}>
            <SimpleShowLayout
                sx={{
                    margin: 2,
                    padding: 2,
                    bgcolor: 'text.disabled',
                }}
            >
                <TextField source="id" />
                <TextField source="title" />
                <TextField source="author" />
                <TextField source="summary" />
                <NumberField source="year" />
            </SimpleShowLayout>
        </RecordContextProvider>
    </ResourceContext.Provider>
);

export const SeveralColumns = () => (
    <ResourceContext.Provider value="books">
        <RecordContextProvider value={record}>
            <Grid container spacing={2}>
                <Grid item xs={6}>
                    <SimpleShowLayout>
                        <TextField source="id" />
                        <TextField source="title" />
                    </SimpleShowLayout>
                </Grid>
                <Grid item xs={6}>
                    <SimpleShowLayout>
                        <TextField source="author" />
                        <TextField source="summary" />
                        <NumberField source="year" />
                    </SimpleShowLayout>
                </Grid>
            </Grid>
        </RecordContextProvider>
    </ResourceContext.Provider>
);
