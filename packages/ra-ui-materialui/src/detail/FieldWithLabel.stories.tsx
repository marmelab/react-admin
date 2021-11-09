import * as React from 'react';
import {
    RecordContextProvider,
    ResourceContext,
    useRecordContext,
    WithRecord,
} from 'ra-core';
import { TextField } from '../field/TextField';
import { FieldWithLabel } from './FieldWithLabel';

export default { title: 'ra-ui-materialui/detail/FieldWithLabel' };

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
            <FieldWithLabel>
                <TextField source="title" />
            </FieldWithLabel>
        </RecordContextProvider>
    </ResourceContext.Provider>
);

export const CustomLabel = () => (
    <ResourceContext.Provider value="books">
        <RecordContextProvider value={record}>
            <FieldWithLabel>
                <TextField label="My custom Title" source="title" />
            </FieldWithLabel>
        </RecordContextProvider>
    </ResourceContext.Provider>
);

export const ExplicitLabel = () => (
    <ResourceContext.Provider value="books">
        <RecordContextProvider value={record}>
            <FieldWithLabel label="My custom Title">
                <TextField source="title" />
            </FieldWithLabel>
        </RecordContextProvider>
    </ResourceContext.Provider>
);

export const NoLabel = () => (
    <ResourceContext.Provider value="books">
        <RecordContextProvider value={record}>
            <FieldWithLabel>
                <TextField label={false} source="title" />
            </FieldWithLabel>
        </RecordContextProvider>
    </ResourceContext.Provider>
);

export const NonField = () => (
    <FieldWithLabel>
        <span>War and Peace</span>
    </FieldWithLabel>
);

export const NoDoubleLabel = () => (
    <ResourceContext.Provider value="books">
        <RecordContextProvider value={record}>
            <FieldWithLabel>
                <FieldWithLabel label="My custom Title">
                    <TextField source="title" />
                </FieldWithLabel>
            </FieldWithLabel>
        </RecordContextProvider>
    </ResourceContext.Provider>
);
