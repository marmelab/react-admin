import * as React from 'react';
import { Basic } from './InfiniteListBase.stories';
import { render, screen, waitFor } from '@testing-library/react';

describe('InfiniteListBase', () => {
    it('should fetch a list of records on mount, put it in a ListContext, and render its children', async () => {
        render(<Basic />);
        expect(screen.queryByText('Loading...')).not.toBeNull();
        await waitFor(() => {
            expect(screen.queryByText('Loading...')).toBeNull();
        });
        await screen.findByText('War and Peace');
    });
    it('should create an InfinitePaginationContext allowing to fetch following pages', async () => {
        render(<Basic />);
        await waitFor(() => {
            expect(screen.queryByText('Loading...')).toBeNull();
        });
        // first page is visible
        await screen.findByText('The Lord of the Rings'); // #5
        // next page is not visible
        expect(screen.queryByText('And Then There Were None')).toBeNull(); // #6
        screen.getByText('Next').click();
        // next page is now visible
        await screen.findByText('And Then There Were None'); // #6
        // first page is still visible
        await screen.findByText('The Lord of the Rings'); // #5
    });
});
