import * as React from 'react';
import { render, screen } from '@testing-library/react';
import { RecordContextProvider } from 'ra-core';
import { SimpleShowLayout } from './SimpleShowLayout';
import {
    Basic,
    CustomChild,
    CustomLabel,
    I18nKey,
} from './SimpleShowLayout.stories';
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
        screen.getByText('foo');
        screen.getByText('bar');
    });

    it('should add a label for each field', () => {
        render(<Basic />);
        screen.getByText('Title');
        screen.getByText('War and Peace');
    });

    it('should translate the labels', () => {
        render(<I18nKey />);
        screen.getByText('resources.books.fields.id');
        screen.getByText('resources.books.fields.title');
        screen.getByText('resources.books.fields.author');
        screen.getByText('resources.books.fields.summary');
        screen.getByText('resources.books.fields.year');
    });

    it('should accept custom children', () => {
        render(<CustomChild />);
        screen.getByText('War and Peace');
        screen.getByText('Leo Tolstoy');
    });

    it('should allows to customize or disable the label', () => {
        render(<CustomLabel />);
        expect(screen.queryByText('Author')).toBeNull();
        expect(screen.queryByText('Author name')).not.toBeNull();
        expect(screen.queryByText('Summary')).toBeNull();
    });
});
