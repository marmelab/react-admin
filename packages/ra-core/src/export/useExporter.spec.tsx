import * as React from 'react';
import expect from 'expect';
import { waitFor, render, fireEvent, screen } from '@testing-library/react';

import { getAllKeys } from './useExporter';
import {
    AccessControl,
    AccessControlWithoutAuthProvider,
    AccessControlWithoutAuthProviderCanAccess,
} from './useExporter.stories';

describe('useExporter', () => {
    it('should call given customExporter with keys deemed accessible by authProvider.canAccess', async () => {
        const customExporter = jest.fn();
        render(<AccessControl customExporter={customExporter} />);
        fireEvent.click(await screen.findByText('Export'));

        await waitFor(() => {
            expect(customExporter).toBeCalledTimes(1);
        });
        expect(customExporter).toHaveBeenCalledWith(
            [
                {
                    title: 'How to implement access control',
                },
                {
                    title: 'How to test access control',
                    author: 'John Doe',
                },
            ],
            null,
            null,
            'posts'
        );

        fireEvent.click(await screen.findByLabelText('posts.id access'));
        fireEvent.click(await screen.findByText('Export'));
        await waitFor(() => {
            expect(customExporter).toBeCalledTimes(2);
        });
        expect(customExporter).toHaveBeenCalledWith(
            [
                {
                    id: 1,
                    title: 'How to implement access control',
                },
                {
                    id: 2,
                    title: 'How to test access control',
                    author: 'John Doe',
                },
            ],
            null,
            null,
            'posts'
        );
    });

    it('should call given customExporter with all keys when no authProvider', async () => {
        const customExporter = jest.fn();
        render(
            <AccessControlWithoutAuthProvider customExporter={customExporter} />
        );
        fireEvent.click(await screen.findByText('Export'));
        await waitFor(() => {
            expect(customExporter).toBeCalledTimes(1);
        });
        expect(customExporter).toHaveBeenCalledWith(
            [
                {
                    id: 1,
                    title: 'How to implement access control',
                },
                {
                    id: 2,
                    title: 'How to test access control',
                    author: 'John Doe',
                },
            ],
            null,
            null,
            'posts'
        );
    });
    it('should call given customExporter with all keys when no authProvider.canAccess', async () => {
        const customExporter = jest.fn();
        render(
            <AccessControlWithoutAuthProviderCanAccess
                customExporter={customExporter}
            />
        );
        fireEvent.click(await screen.findByText('Export'));
        await waitFor(() => {
            expect(customExporter).toBeCalledTimes(1);
        });
        expect(customExporter).toHaveBeenCalledWith(
            [
                {
                    id: 1,
                    title: 'How to implement access control',
                },
                {
                    id: 2,
                    title: 'How to test access control',
                    author: 'John Doe',
                },
            ],
            null,
            null,
            'posts'
        );
    });

    describe('getAllKeys', () => {
        it('should return the list of all keys inside the array', () => {
            const keys = getAllKeys([
                { id: 1, title: 'Title' },
                { author: 'John Doe' },
                { comments: {} },
            ]);

            expect(keys).toEqual(['id', 'title', 'author', 'comments']);
        });
        it('should return an empty array when the array is empty', () => {
            const keys = getAllKeys([]);

            expect(keys).toEqual([]);
        });
        it('should return an empty array when no array given', () => {
            const keys = getAllKeys(undefined);

            expect(keys).toEqual([]);
        });
    });
});
