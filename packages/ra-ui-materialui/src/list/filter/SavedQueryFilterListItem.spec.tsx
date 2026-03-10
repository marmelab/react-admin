import * as React from 'react';
import expect from 'expect';
import { render, screen, fireEvent } from '@testing-library/react';
import { ListContextProvider, ListControllerResult } from 'ra-core';

import { SavedQueryFilterListItem } from './SavedQueryFilterListItem';

const defaultListContext: ListControllerResult = {
    data: [],
    displayedFilters: {},
    filterValues: {},
    hasNextPage: false,
    hasPreviousPage: false,
    hideFilter: () => {},
    isFetching: false,
    isLoading: false,
    onSelect: () => {},
    onToggleItem: () => {},
    onUnselectItems: () => {},
    page: 1,
    perPage: 10,
    refetch: () => {},
    resource: 'posts',
    selectedIds: [],
    setFilters: () => {},
    setPage: () => {},
    setPerPage: () => {},
    setSort: () => {},
    showFilter: () => {},
    sort: { field: 'id', order: 'ASC' },
    total: 0,
    error: null,
    isPending: false,
    onSelectAll: () => {},
};

const savedQuery = {
    label: 'My Saved Query',
    value: {
        filter: { status: 'published' },
        displayedFilters: [],
        sort: { field: 'title', order: 'ASC' as const },
        perPage: 25,
    },
};

describe('<SavedQueryFilterListItem />', () => {
    it('should display the item label', () => {
        render(
            <ListContextProvider value={defaultListContext}>
                <SavedQueryFilterListItem
                    label={savedQuery.label}
                    value={savedQuery.value}
                />
            </ListContextProvider>
        );
        expect(screen.queryByText('My Saved Query')).not.toBeNull();
    });

    it('should call setFilters and setPage when the item is clicked and not selected', () => {
        const setFilters = jest.fn();
        const setPage = jest.fn();

        render(
            <ListContextProvider
                value={{ ...defaultListContext, setFilters, setPage }}
            >
                <SavedQueryFilterListItem
                    label={savedQuery.label}
                    value={savedQuery.value}
                />
            </ListContextProvider>
        );

        fireEvent.click(screen.getByText('My Saved Query'));
        expect(setFilters).toHaveBeenCalledWith(
            savedQuery.value.filter,
            savedQuery.value.displayedFilters
        );
        expect(setPage).toHaveBeenCalledWith(1);
    });

    it('should call setFilters with empty objects and setPage when the item is clicked and already selected', () => {
        const setFilters = jest.fn();
        const setPage = jest.fn();

        render(
            <ListContextProvider
                value={{
                    ...defaultListContext,
                    filterValues: savedQuery.value.filter,
                    sort: savedQuery.value.sort,
                    perPage: savedQuery.value.perPage,
                    displayedFilters: savedQuery.value.displayedFilters,
                    setFilters,
                    setPage,
                }}
            >
                <SavedQueryFilterListItem
                    label={savedQuery.label}
                    value={savedQuery.value}
                />
            </ListContextProvider>
        );

        fireEvent.click(screen.getByText('My Saved Query'));
        expect(setFilters).toHaveBeenCalledWith({}, {});
        expect(setPage).toHaveBeenCalledWith(1);
    });
});
