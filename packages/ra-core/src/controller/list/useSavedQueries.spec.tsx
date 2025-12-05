import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import { Basic } from './useSavedQueries.stories';

describe('useSavedQueries', () => {
    it('should allow to save a query', async () => {
        render(<Basic />);
        fireEvent.change(await screen.findByLabelText('Title'), {
            target: { value: 'Post 1' },
        });
        fireEvent.click(await screen.findByText('Save current query'));
        await screen.findByText('My saved query: Post 1 - unpublished');
    });

    it('should allow to apply a query', async () => {
        render(<Basic />);
        await screen.findByText('1-2 of 2');
        fireEvent.change(await screen.findByLabelText('Title'), {
            target: { value: 'Post 1' },
        });
        await screen.findByText('1-1 of 1');
        fireEvent.click(await screen.findByText('Save current query'));
        await screen.findByText('My saved query: Post 1 - unpublished');
        fireEvent.change(await screen.findByLabelText('Title'), {
            target: { value: '' },
        });
        await screen.findByText('1-2 of 2');
        fireEvent.click(await screen.findByText('Apply'));
        await screen.findByText('1-1 of 1');
    });

    it('should allow to remove a query', async () => {
        render(<Basic />);
        fireEvent.change(await screen.findByLabelText('Title'), {
            target: { value: 'Post 1' },
        });
        fireEvent.click(await screen.findByText('Save current query'));
        await screen.findByText('My saved query: Post 1 - unpublished');
        fireEvent.click(await screen.findByText('Remove'));
        await screen.findByText(
            'No saved queries yet. Set a filter to save it.'
        );
    });
});
