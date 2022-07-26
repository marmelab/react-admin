import * as React from 'react';
import { render, screen } from '@testing-library/react';

import { useGetRecordRepresentation } from './useGetRecordRepresentation';
import { ResourceDefinitionContext } from './ResourceDefinitionContext';

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
            <ResourceDefinitionContext.Provider
                value={{
                    definitions: {
                        users: {
                            name: 'users',
                            recordRepresentation: 'last_name',
                        },
                    },
                    register: () => {},
                    unregister: () => {},
                }}
            >
                <UseRecordRepresentation
                    resource="users"
                    record={{ id: 123, first_name: 'John', last_name: 'Doe' }}
                />
            </ResourceDefinitionContext.Provider>
        );
        screen.getByText('Doe');
    });
    it('should return a deep record field if the recordRepresentation is a string with a dot', () => {
        render(
            <ResourceDefinitionContext.Provider
                value={{
                    definitions: {
                        users: {
                            name: 'users',
                            recordRepresentation: 'name.last',
                        },
                    },
                    register: () => {},
                    unregister: () => {},
                }}
            >
                <UseRecordRepresentation
                    resource="users"
                    record={{ id: 123, name: { first: 'John', last: 'Doe' } }}
                />
            </ResourceDefinitionContext.Provider>
        );
        screen.getByText('Doe');
    });
    it('should return a string if the recordRepresentation is a function', () => {
        render(
            <ResourceDefinitionContext.Provider
                value={{
                    definitions: {
                        users: {
                            name: 'users',
                            recordRepresentation: record =>
                                `${record.first_name} ${record.last_name}`,
                        },
                    },
                    register: () => {},
                    unregister: () => {},
                }}
            >
                <UseRecordRepresentation
                    resource="users"
                    record={{ id: 123, first_name: 'John', last_name: 'Doe' }}
                />
            </ResourceDefinitionContext.Provider>
        );
        screen.getByText('John Doe');
    });
    it('should return a React element if the recordRepresentation is a react element', () => {
        const Hello = () => <div>Hello</div>;
        render(
            <ResourceDefinitionContext.Provider
                value={{
                    definitions: {
                        users: {
                            name: 'users',
                            recordRepresentation: <Hello />,
                        },
                    },
                    register: () => {},
                    unregister: () => {},
                }}
            >
                <UseRecordRepresentation
                    resource="users"
                    record={{ id: 123, first_name: 'John', last_name: 'Doe' }}
                />
            </ResourceDefinitionContext.Provider>
        );
        screen.getByText('Hello');
    });
});
