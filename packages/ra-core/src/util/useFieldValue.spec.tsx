import * as React from 'react';
import { render, screen } from '@testing-library/react';
import { useFieldValue, UseFieldValueOptions } from './useFieldValue';
import { RecordContextProvider } from '../controller';

describe('useFieldValue', () => {
    const Component = (props: UseFieldValueOptions) => {
        return <div>{useFieldValue(props) ?? 'None'}</div>;
    };

    it('should return undefined if no record is available', async () => {
        render(<Component source="name" />);

        await screen.findByText('None');
    });

    it('should return the provided defaultValue if no record is available', async () => {
        render(<Component source="name" defaultValue="Molly Millions" />);

        await screen.findByText('Molly Millions');
    });

    it('should return the provided defaultValue if the record does not have a value for the source', async () => {
        render(
            <RecordContextProvider value={{ id: 123 }}>
                <Component source="name" defaultValue="Peter Riviera" />
            </RecordContextProvider>
        );

        await screen.findByText('Peter Riviera');
    });

    it('should return the field value from the record in RecordContext', async () => {
        render(
            <RecordContextProvider value={{ name: 'John Wick' }}>
                <Component source="name" />
            </RecordContextProvider>
        );

        await screen.findByText('John Wick');
    });

    it('should return the field value from the record in props', async () => {
        render(
            <RecordContextProvider value={{ id: 2, name: 'John Wick' }}>
                <Component
                    source="name"
                    record={{ id: 1, name: 'Johnny Silverhand' }}
                />
            </RecordContextProvider>
        );

        await screen.findByText('Johnny Silverhand');
    });

    it('should return the field value from a deep path', async () => {
        render(
            <RecordContextProvider
                value={{ id: 2, name: { firstName: 'John', lastName: 'Wick' } }}
            >
                <Component source="name.firstName" />
            </RecordContextProvider>
        );

        await screen.findByText('John');
    });
});
