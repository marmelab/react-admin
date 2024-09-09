import * as React from 'react';
import { render, screen } from '@testing-library/react';
import { NoFilter, WithFilter } from './ListNoResults.stories';

describe('ListNoResults', () => {
    it('should display no results found message when no filter', async () => {
        render(<NoFilter />);
        await screen.findByText('No results found.');
    });

    it('should display no results found message and a clear filter link when there is a filter', async () => {
        render(<WithFilter />);
        await screen.findByText('No results found with the current filters.');
        screen.getByText('Clear filters').click();
        await screen.findByText('{"id":1}');
    });
});
