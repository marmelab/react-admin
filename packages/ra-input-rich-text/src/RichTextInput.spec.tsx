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

    it('should only load string values in the editor', async () => {
        const record = {
            id: 123,
            body: {
                type: 'doc',
                content: [
                    {
                        type: 'paragraph',
                        content: [{ type: 'text', text: 'From JSON' }],
                    },
                ],
            },
        };
        const { container } = render(<Basic record={record} />);

        await waitFor(() => {
            expect(container.querySelector('.ProseMirror')).not.toBeNull();
        });
        expect(container.querySelector('.ProseMirror')?.textContent).toEqual(
            ''
        );
    });

    it('should only render plain highlight colors', async () => {
        const record = {
            id: 123,
            body: '<p><mark data-color="red; font-weight: bold">first</mark> <mark data-color="#ffcc00">second</mark></p>',
        };
        render(<Basic record={record} />);

        const first = await screen.findByText('first');
        expect(first.style.fontWeight).toEqual('');
        expect(first.style.backgroundColor).toEqual('');
        expect(screen.getByText('second').style.backgroundColor).toEqual(
            'rgb(255, 204, 0)'
        );
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
