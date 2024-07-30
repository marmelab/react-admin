import * as React from 'react';
import { render, screen } from '@testing-library/react';

import { useGetRecordRepresentation } from './useGetRecordRepresentation';
import { ResourceDefinitionContextProvider } from './ResourceDefinitionContext';

const UseRecordRepresentation = ({ resource, record }) => {
    const getRecordRepresentation = useGetRecordRepresentation(resource);
    return <>{getRecordRepresentation(record)}</>;
};

describe('useRecordRepresentation', () => {
    it('should return the record id by default', () => {
        render(
            <UseRecordRepresentation resource="users" record={{ id: 123 }} />
        );
        screen.getByText('#123');
    });
    it('should return a record field if the recordRepresentation is a string', () => {
        render(
            <ResourceDefinitionContextProvider
                definitions={{
                    users: {
                        name: 'users',
                        recordRepresentation: 'last_name',
                    },
                }}
            >
                <UseRecordRepresentation
                    resource="users"
                    record={{ id: 123, first_name: 'John', last_name: 'Doe' }}
                />
            </ResourceDefinitionContextProvider>
        );
        screen.getByText('Doe');
    });

    it('should return a deep record field if the recordRepresentation is a string with a dot', () => {
        render(
            <ResourceDefinitionContextProvider
                definitions={{
                    users: {
                        name: 'users',
                        recordRepresentation: 'name.last',
                    },
                }}
            >
                <UseRecordRepresentation
                    resource="users"
                    record={{ id: 123, name: { first: 'John', last: 'Doe' } }}
                />
            </ResourceDefinitionContextProvider>
        );
        screen.getByText('Doe');
    });

    it('should return a string if the recordRepresentation is a function', () => {
        render(
            <ResourceDefinitionContextProvider
                definitions={{
                    users: {
                        name: 'users',
                        recordRepresentation: record =>
                            `${record.first_name} ${record.last_name}`,
                    },
                }}
            >
                <UseRecordRepresentation
                    resource="users"
                    record={{ id: 123, first_name: 'John', last_name: 'Doe' }}
                />
            </ResourceDefinitionContextProvider>
        );
        screen.getByText('John Doe');
    });

    it('should return a React element if the recordRepresentation is a react element', () => {
        const Hello = () => <div>Hello</div>;
        render(
            <ResourceDefinitionContextProvider
                definitions={{
                    users: {
                        name: 'users',
                        recordRepresentation: <Hello />,
                    },
                }}
            >
                <UseRecordRepresentation
                    resource="users"
                    record={{ id: 123, first_name: 'John', last_name: 'Doe' }}
                />
            </ResourceDefinitionContextProvider>
        );
        screen.getByText('Hello');
    });
    it('should return the record name at first', () => {
        render(
            <UseRecordRepresentation
                resource="users"
                record={{
                    name: 'Ipsum',
                    title: 'Lorem',
                    label: 'lorem-ipsum',
                    reference: '456',
                    id: '123',
                    author: 'John Doe',
                }}
            />
        );
        screen.getByText('Ipsum');
    });
    it('should return the record title at second', () => {
        render(
            <UseRecordRepresentation
                resource="users"
                record={{
                    title: 'Lorem',
                    label: 'lorem-ipsum',
                    reference: '456',
                    id: '123',
                    author: 'John Doe',
                }}
            />
        );
        screen.getByText('Lorem');
    });
    it('should return the record label at third', () => {
        render(
            <UseRecordRepresentation
                resource="users"
                record={{
                    label: 'lorem-ipsum',
                    reference: '456',
                    id: '123',
                    author: 'John Doe',
                }}
            />
        );
        screen.getByText('lorem-ipsum');
    });
    it('should return the record reference at fourth', () => {
        render(
            <UseRecordRepresentation
                resource="users"
                record={{ reference: '456', id: '123', author: 'John Doe' }}
            />
        );
        screen.getByText('456');
    });
    it('should return the record id by default', () => {
        render(
            <UseRecordRepresentation
                resource="users"
                record={{ id: '123', author: 'John Doe' }}
            />
        );
        screen.getByText('#123');
    });
});
