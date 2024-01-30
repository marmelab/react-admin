import * as React from 'react';
import { render, screen } from '@testing-library/react';
import { useFieldValue, UseFieldValueOptions } from './useFieldValue';
import { RecordContextProvider } from '../controller';
import { SourceContextProvider } from '..';

describe('useFieldValue', () => {
    const Component = (props: UseFieldValueOptions) => {
        return <div>{useFieldValue(props) ?? 'None'}</div>;
    };

    it('should return undefined if no record is available', async () => {
        render(<Component source="name" />);

        await screen.findByText('None');
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

    it('should return the field value from the record inside a SourceContext', async () => {
        render(
            <RecordContextProvider
                value={{
                    id: 2,
                    name: { fr: 'Neuromancien', en: 'Neuromancer' },
                }}
            >
                <SourceContextProvider
                    value={{
                        getSource(source) {
                            return `${source}.fr`;
                        },
                        getLabel: source => source,
                    }}
                >
                    <Component source="name" />
                </SourceContextProvider>
            </RecordContextProvider>
        );

        await screen.findByText('Neuromancien');
    });
});
