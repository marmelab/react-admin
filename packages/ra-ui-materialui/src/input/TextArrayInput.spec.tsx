import * as React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';

import { Basic, HelperText, Label, Required } from './TextArrayInput.stories';

describe('<TextArrayInput />', () => {
    it('should render the values as chips', () => {
        render(<Basic />);
        const chip1 = screen.getByText('john@example.com');
        expect(chip1.classList.contains('MuiChip-label')).toBe(true);
        const chip2 = screen.getByText('albert@target.dev');
        expect(chip2.classList.contains('MuiChip-label')).toBe(true);
    });
    it('should allow to remove a value', async () => {
        render(<Basic />);
        await screen.findByText(
            '["john@example.com","albert@target.dev"] (object)'
        );
        const deleteButtons = screen.getAllByTestId('CancelIcon');
        fireEvent.click(deleteButtons[0]);
        await screen.findByText('["albert@target.dev"] (object)');
    });
    it('should allow to remove all values one by one', async () => {
        render(<Basic />);
        await screen.findByText(
            '["john@example.com","albert@target.dev"] (object)'
        );
        const deleteButtons = screen.getAllByTestId('CancelIcon');
        fireEvent.click(deleteButtons[1]);
        fireEvent.click(deleteButtons[0]);
        await screen.findByText('[] (object)');
    });
    it('should allow to remove all values using the reset button', async () => {
        render(<Basic />);
        const input = screen.getByLabelText('resources.emails.fields.to');
        fireEvent.click(input);
        const clearButton = screen.getByLabelText('Clear');
        fireEvent.click(clearButton);
        await screen.findByText('[] (object)');
    });
    it('should allow to add a value', async () => {
        render(<Basic />);
        const input = screen.getByLabelText('resources.emails.fields.to');
        fireEvent.change(input, { target: { value: 'bob.brown@example.com' } });
        fireEvent.keyDown(input, { key: 'Enter' });
        await screen.findByText(
            '["john@example.com","albert@target.dev","bob.brown@example.com"] (object)'
        );
    });
    it('should render the helper text', () => {
        render(<HelperText />);
        screen.getByText('Email addresses of the recipients');
    });
    it('should render the custom label', () => {
        render(<Label />);
        screen.getByText('To');
    });
    it('should show required fields as required', () => {
        render(<Required />);
        expect(screen.getAllByText('*').length).toBe(2);
    });
});
