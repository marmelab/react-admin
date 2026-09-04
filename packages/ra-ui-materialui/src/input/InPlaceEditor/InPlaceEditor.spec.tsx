import * as React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';

import { Basic, CancelOnBlur, Editor } from './InPlaceEditor.stories';

const DismissibleBasic = () => {
    const [isVisible, setIsVisible] = React.useState(true);
    return (
        <>
            {isVisible ? <Basic delay={0} /> : null}
            <button onClick={() => setIsVisible(false)}>Next</button>
        </>
    );
};

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
    it('should save when focus moves outside the editor', async () => {
        render(
            <>
                <Basic delay={0} />
                <button>Next</button>
            </>
        );
        const value = await screen.findByText('John Doe');
        value.click();
        const input = await screen.findByDisplayValue('John Doe');
        input.focus();
        fireEvent.change(input, { target: { value: 'Jane Doe' } });
        const nextButton = screen.getByRole('button', { name: 'Next' });
        nextButton.focus();
        await screen.findByText('Jane Doe');
    });
    it('should save before an outside action unmounts the editor', async () => {
        render(<DismissibleBasic />);
        const value = await screen.findByText('John Doe');
        value.click();
        const input = await screen.findByDisplayValue('John Doe');
        input.focus();
        fireEvent.change(input, { target: { value: 'Jane Doe' } });
        const form = input.closest('form');
        if (!form) {
            throw new Error('Could not find the InPlaceEditor form');
        }
        const handleSubmit = jest.fn();
        form.addEventListener('submit', handleSubmit);
        const nextButton = screen.getByRole('button', { name: 'Next' });
        nextButton.focus();
        fireEvent.click(nextButton);
        expect(screen.queryByDisplayValue('Jane Doe')).toBeNull();
        expect(handleSubmit).toHaveBeenCalledTimes(1);
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
    describe('cancelOnBlur', () => {
        it('should cancel when focus moves outside the editor', async () => {
            render(
                <>
                    <CancelOnBlur />
                    <button>Next</button>
                </>
            );
            const value = await screen.findByText('John Doe');
            value.click();
            const input = await screen.findByDisplayValue('John Doe');
            input.focus();
            fireEvent.change(input, { target: { value: 'Jane Doe' } });
            const nextButton = screen.getByRole('button', { name: 'Next' });
            nextButton.focus();
            await screen.findByText('John Doe');
        });
    });
    describe('editor', () => {
        it('should keep editing when focus moves to a portaled control', async () => {
            render(<Editor />);
            const value = await screen.findByText('Customer');
            value.click();
            await screen.findByRole('listbox', undefined, {
                timeout: 1000,
            });
            const selectedOption = await screen.findByRole(
                'option',
                { name: 'Customer' },
                { timeout: 1000 }
            );
            expect(document.activeElement).toBe(selectedOption);
            await screen.findByRole('combobox', { hidden: true });
        });
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
        it('should keep editing when focus moves to an action button', async () => {
            render(<Basic delay={0} showButtons />);
            const value = await screen.findByText('John Doe');
            value.click();
            const input = await screen.findByDisplayValue('John Doe');
            input.focus();
            fireEvent.change(input, { target: { value: 'Jane Doe' } });
            const saveButton = await screen.findByLabelText('Save');
            saveButton.focus();
            await screen.findByDisplayValue('Jane Doe');
        });
    });
});
