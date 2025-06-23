import * as React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';

import { Basic } from './InPlaceEditor.stories';

describe('InPlaceEditor', () => {
    it('should render the field value on mount', async () => {
        render(<Basic delay={0} />);
        await screen.findByText('John Doe');
    });
    it('should reveal an input on click', async () => {
        render(<Basic delay={0} />);
        const value = await screen.findByText('John Doe');
        value.click();
        await screen.findByDisplayValue('John Doe');
    });
    it('should let the user change the value', async () => {
        render(<Basic delay={0} />);
        const value = await screen.findByText('John Doe');
        value.click();
        const input = await screen.findByDisplayValue('John Doe');
        fireEvent.change(input, { target: { value: 'Jane Doe' } });
        fireEvent.blur(input);
        await screen.findByText('Jane Doe');
    });
    it('should revert to the previous version on error', async () => {
        jest.spyOn(console, 'error').mockImplementation(() => {});
        render(<Basic delay={0} updateFails />);
        const value = await screen.findByText('John Doe');
        value.click();
        const input = await screen.findByDisplayValue('John Doe');
        fireEvent.change(input, { target: { value: 'Jane Doe' } });
        fireEvent.blur(input);
        await screen.findByText('Jane Doe');
        await screen.findByText('John Doe');
    });
    describe('notifyOnSuccess', () => {
        it('should show a notification on success', async () => {
            render(<Basic delay={0} notifyOnSuccess />);
            const value = await screen.findByText('John Doe');
            value.click();
            const input = await screen.findByDisplayValue('John Doe');
            fireEvent.change(input, { target: { value: 'Jane Doe' } });
            fireEvent.blur(input);
            await screen.findByText('Element updated');
        });
    });
    describe('showButtons', () => {
        it('should render save and cancel buttons', async () => {
            render(<Basic delay={0} showButtons />);
            const value = await screen.findByText('John Doe');
            value.click();
            await screen.findByLabelText('Save');
            await screen.findByLabelText('Cancel');
        });
    });
});
