import * as React from 'react';
import { render, screen } from '@testing-library/react';
import { NoFilter, WithFilter } from './ListNoResults.stories';
import { ListContextProvider } from 'ra-core';
import { ListView } from './ListView';

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
    it('renders Empty when list is empty with only permanent filters', () => {
        render(
            <ListContextProvider
                value={{
                    data: [],
                    total: 0,
                    filterValues: { is_published: true },
                    isPending: false,
                    hasPreviousPage: false,
                    hasNextPage: false,
                    resource: 'posts',
                }}
            >
                <ListView
                    permanentFilter={{ is_published: true }}
                    empty={<div>No posts found</div>}
                >
                    <div />
                </ListView>
            </ListContextProvider>
        );

        screen.getByText('No posts found');
    });
});
