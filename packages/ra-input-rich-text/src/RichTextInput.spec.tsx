import * as React from 'react';
import expect from 'expect';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Basic, EditorRecreation } from './RichTextInput.stories';

describe('<RichTextInput />', () => {
    it('should update its content when fields value changes and add a trailing break to it', async () => {
        const record = { id: 123, body: '<h1>Hello world!</h1>' };
        const { container, rerender } = render(<Basic record={record} />);

        await waitFor(() => {
            expect(container.querySelector('.ProseMirror')?.innerHTML).toEqual(
                '<h1>Hello world!</h1><p><br class="ProseMirror-trailingBreak"></p>'
            );
        });

        const newRecord = { id: 123, body: '<h1>Goodbye world!</h1>' };
        rerender(<Basic record={newRecord} />);

        await waitFor(() => {
            expect(container.querySelector('.ProseMirror')?.innerHTML).toEqual(
                '<h1>Goodbye world!</h1><p><br class="ProseMirror-trailingBreak"></p>'
            );
        });
    });

    it('should update its content when the editor is recreated while the field value changes', async () => {
        const { container } = render(<EditorRecreation />);

        await waitFor(() => {
            expect(container.querySelector('.ProseMirror')?.innerHTML).toEqual(
                '<p>This post is a draft, you can edit it.</p>'
            );
        });

        await userEvent.click(screen.getByText('Switch post'));

        await waitFor(() => {
            expect(container.querySelector('.ProseMirror')?.innerHTML).toEqual(
                '<p>This post is published, it is read-only.</p>'
            );
        });
    });
});
