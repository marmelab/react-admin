import * as React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import expect from 'expect';
import { Basic, AccessControl } from './EditButton.stories';

const invalidButtonDomProps = {
    redirect: 'list',
    resource: 'books',
};

describe('<EditButton />', () => {
    it('should render a button with no DOM errors', () => {
        const spy = jest.spyOn(console, 'error').mockImplementation(() => {});

        render(<Basic buttonProps={invalidButtonDomProps} />);

        expect(spy).not.toHaveBeenCalled();
        expect(screen.getByLabelText('Edit').tagName).toEqual('A');
        expect(screen.getByLabelText('Edit').getAttribute('href')).toEqual(
            '/books/1'
        );

        spy.mockRestore();
    });

    it('should only render when users have the right to edit', async () => {
        render(<AccessControl />);
        await screen.findByText('War and Peace');
        expect(screen.queryAllByLabelText('Edit')).toHaveLength(0);
        fireEvent.click(screen.getByLabelText('Allow editing books'));
        await waitFor(() => {
            // 9 because War and Peace is handled separately
            expect(screen.queryAllByLabelText('Edit')).toHaveLength(9);
        });
    });

    it('should only render when users have the right to edit the specific record', async () => {
        render(<AccessControl />);
        await screen.findByText('War and Peace');
        expect(screen.queryByLabelText('Edit')).toBeNull();
        fireEvent.click(screen.getByLabelText('Allow editing War and Peace'));
        await waitFor(() => {
            expect(screen.queryAllByLabelText('Edit')).toHaveLength(1);
        });
    });
});
