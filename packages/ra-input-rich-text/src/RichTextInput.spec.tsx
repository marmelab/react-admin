import * as React from 'react';
import expect from 'expect';
import { fireEvent, screen, render, waitFor } from '@testing-library/react';
import { Basic, Ref } from './RichTextInput.stories';

describe('<RichTextInput />', () => {
    it('should update its content when fields value changes', async () => {
        const record = { id: 123, body: '<h1>Hello world!</h1>' };
        const { container, rerender } = render(<Basic record={record} />);

        await waitFor(() => {
            expect(container.querySelector('#body')?.innerHTML).toEqual(
                '<h1>Hello world!</h1>'
            );
        });

        const newRecord = { id: 123, body: '<h1>Goodbye world!</h1>' };
        rerender(<Basic record={newRecord} />);

        await waitFor(() => {
            expect(container.querySelector('#body')?.innerHTML).toEqual(
                '<h1>Goodbye world!</h1>'
            );
        });
    });
    it("should update its content with the ref editor's commands", async () => {
        const record = { id: 123, body: '<h1>Hello world!</h1>' };
        const { container } = render(<Ref record={record} />);

        await waitFor(() => {
            expect(container.querySelector('#body')?.innerHTML).toEqual(
                '<h1>Hello world!</h1>'
            );
        });

        fireEvent.click(screen.getByRole('button', { name: 'Use template' }));

        await waitFor(() => {
            expect(container.querySelector('#body')?.innerHTML).toEqual(
                '<h3>Here is my template</h3>'
            );
        });
    });
});
