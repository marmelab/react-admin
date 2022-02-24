import * as React from 'react';
import { RecordContextProvider, ResourceContext } from 'ra-core';
import { TextField } from './field';
import { Labeled } from './Labeled';

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

export const CustomLabel = () => (
    <ResourceContext.Provider value="books">
        <RecordContextProvider value={record}>
            <Labeled>
                <TextField label="My custom Title" source="title" />
            </Labeled>
        </RecordContextProvider>
    </ResourceContext.Provider>
);

export const ExplicitLabel = () => (
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
