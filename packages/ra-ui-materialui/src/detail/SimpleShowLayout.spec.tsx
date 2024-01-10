import * as React from 'react';
import { render, screen } from '@testing-library/react';
import { RecordContextProvider } from 'ra-core';
import { SimpleShowLayout } from './SimpleShowLayout';
import { Basic, CustomChild, CustomLabel } from './SimpleShowLayout.stories';
import { TextField } from '../field';

describe('<SimpleShowLayout />', () => {
    it('should display children filelds', () => {
        render(
            <RecordContextProvider value={{ source1: 'foo', source2: 'bar' }}>
                <SimpleShowLayout>
                    <TextField source="source1" />
                    <TextField source="source2" />
                </SimpleShowLayout>
            </RecordContextProvider>
        );
        expect(screen.queryByText('foo')).not.toBeNull();
        expect(screen.queryByText('bar')).not.toBeNull();
    });

    it('should add a label for each field', () => {
        render(<Basic />);
        expect(screen.queryByText('Title')).not.toBeNull();
        expect(screen.queryByText('War and Peace')).not.toBeNull();
    });

    it('should accept custom children', () => {
        render(<CustomChild />);
        expect(screen.queryByText('War and Peace')).not.toBeNull();
        expect(screen.queryByText('Leo Tolstoy')).not.toBeNull();
    });

    it('should allows to customize or disable the label', () => {
        render(<CustomLabel />);
        expect(screen.queryByText('Author')).toBeNull();
        expect(screen.queryByText('Author name')).not.toBeNull();
        expect(screen.queryByText('Summary')).toBeNull();
    });
});
