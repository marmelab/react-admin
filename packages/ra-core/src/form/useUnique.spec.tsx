import * as React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import {
    Basic,
    DataProviderErrorOnValidation,
    WithAdditionalFilters,
    WithMessage,
} from './useUnique.stories';

describe('useUnique', () => {
    it('should show the default error when the field value already exists', async () => {
        render(<Basic />);

        await screen.findByDisplayValue('John Doe');

        fireEvent.click(screen.getByText('Submit'));

        await screen.findByText('Must be unique');
    });

    it('should not show the default error when the field value does not already exists', async () => {
        window.alert = jest.fn();
        render(<Basic />);

        await screen.findByDisplayValue('John Doe');
        fireEvent.change(screen.getByDisplayValue('John Doe'), {
            target: { value: 'Jordan Doe' },
        });

        fireEvent.click(screen.getByText('Submit'));

        expect(screen.queryByText('Must be unique')).toBeNull();
    });

    it('should show a custom error when the field value already exists and message is provided', async () => {
        render(<WithMessage />);

        await screen.findByDisplayValue('John Doe');

        fireEvent.click(screen.getByText('Submit'));

        await screen.findByText('Someone is already registered with this name');
    });

    it('should not show the custom error when the field value does not already exists and message is provided', async () => {
        window.alert = jest.fn();
        render(<Basic />);

        await screen.findByDisplayValue('John Doe');
        fireEvent.change(screen.getByDisplayValue('John Doe'), {
            target: { value: 'Jordan Doe' },
        });

        fireEvent.click(screen.getByText('Submit'));

        expect(
            screen.queryByText('Someone is already registered with this name')
        ).toBeNull();
    });

    it('should call the dataProvider with additional filter when provided', async () => {
        render(<WithAdditionalFilters />);

        await screen.findByDisplayValue('John Doe');

        fireEvent.click(screen.getByText('Submit'));

        expect(screen.queryByText('Must be unique')).toBeNull();

        fireEvent.change(screen.getByDisplayValue('John Doe'), {
            // Jane exists but is linked to another organization than BigCorp (the default)
            target: { value: 'Jane Doe' },
        });

        fireEvent.click(screen.getByText('Submit'));

        expect(screen.queryByText('Must be unique')).toBeNull();
    });

    it('should show an error when the dataProvider fails', async () => {
        render(<DataProviderErrorOnValidation />);

        await screen.findByDisplayValue('John Doe');
        // The dataProvider for this story fails one over two times
        // Here's the first time, it should show an error
        fireEvent.click(screen.getByText('Submit'));
        expect(screen.queryByText('Server communication error')).toBeNull();

        // Here's the second time, it should show the validation message
        fireEvent.click(screen.getByText('Submit'));
        expect(screen.queryByText('Must be unique')).toBeNull();
    });
});
