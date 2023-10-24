import * as React from 'react';
import {
    ResourceContextProvider,
    ResourceDefinitionContextProvider,
} from '../../core';
import { RecordContextProvider } from './RecordContext';
import { RecordRepresentation } from './RecordRepresentation';
import { useRecordContext } from './useRecordContext';
export default {
    title: 'ra-core/controller/record/RecordRepresentation',
};

const Book = {
    id: 1,
    title: "The Hitchhiker's Guide to the Galaxy",
    author: 'Douglas Adams',
    publishedAt: '1979-10-12',
};

export const NoRecordRepresentation = () => (
    <ResourceContextProvider value="books">
        <ResourceDefinitionContextProvider
            definitions={{
                books: {
                    name: 'books',
                    hasList: true,
                    hasEdit: true,
                    hasShow: true,
                    hasCreate: true,
                },
            }}
        >
            <RecordContextProvider value={Book}>
                <RecordRepresentation />
            </RecordContextProvider>
        </ResourceDefinitionContextProvider>
    </ResourceContextProvider>
);

export const StringRecordRepresentation = () => (
    <ResourceContextProvider value="books">
        <ResourceDefinitionContextProvider
            definitions={{
                books: {
                    name: 'books',
                    hasList: true,
                    hasEdit: true,
                    hasShow: true,
                    hasCreate: true,
                    recordRepresentation: 'title',
                },
            }}
        >
            <RecordContextProvider value={Book}>
                <RecordRepresentation />
            </RecordContextProvider>
        </ResourceDefinitionContextProvider>
    </ResourceContextProvider>
);

export const FunctionRecordRepresentation = () => (
    <ResourceContextProvider value="books">
        <ResourceDefinitionContextProvider
            definitions={{
                books: {
                    name: 'books',
                    hasList: true,
                    hasEdit: true,
                    hasShow: true,
                    hasCreate: true,
                    recordRepresentation: record =>
                        `${record.title} by ${record.author}`,
                },
            }}
        >
            <RecordContextProvider value={Book}>
                <RecordRepresentation />
            </RecordContextProvider>
        </ResourceDefinitionContextProvider>
    </ResourceContextProvider>
);

const BookRepresentation = () => {
    const record = useRecordContext();

    if (!record) return null;

    return (
        <p>
            <b>{record.title}</b>{' '}
            <i>
                (by {record.author}) -{' '}
                {new Date(record.publishedAt).getFullYear()}
            </i>
        </p>
    );
};
export const ComponentRecordRepresentation = () => (
    <ResourceContextProvider value="books">
        <ResourceDefinitionContextProvider
            definitions={{
                books: {
                    name: 'books',
                    hasList: true,
                    hasEdit: true,
                    hasShow: true,
                    hasCreate: true,
                    recordRepresentation: <BookRepresentation />,
                },
            }}
        >
            <RecordContextProvider value={Book}>
                <RecordRepresentation />
            </RecordContextProvider>
        </ResourceDefinitionContextProvider>
    </ResourceContextProvider>
);
