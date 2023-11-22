import * as React from 'react';
import expect from 'expect';
import { render, screen, waitFor } from '@testing-library/react';

import { ListContextProvider, ListControllerResult } from 'ra-core';
import GoogleIcon from '@mui/icons-material/Google';
import { FilterListItem } from './FilterListItem';
import { Cumulative } from './FilterList.stories';

const defaultListContext: ListControllerResult = {
    data: [],
    displayedFilters: null,
    filterValues: null,
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
    sort: { field: '', order: 'ASC' },
    total: 0,
};

describe('<FilterListItem/>', () => {
    it("should display the item label when it's a string", () => {
        render(
            <ListContextProvider value={defaultListContext}>
                <FilterListItem label="Foo" value={{ foo: 'bar' }} />
            </ListContextProvider>
        );
        expect(screen.queryByText('Foo')).not.toBeNull();
    });

    it("should display the item label when it's an element", () => {
        render(
            <ListContextProvider value={defaultListContext}>
                <FilterListItem
                    label={<span data-testid="123">Foo</span>}
                    value={{ foo: 'bar' }}
                />
            </ListContextProvider>
        );
        expect(screen.queryByTestId('123')).not.toBeNull();
    });

    it("should display the item icon if it's provided", () => {
        render(
            <ListContextProvider value={defaultListContext}>
                <FilterListItem
                    label="Foo"
                    value={{ foo: 'bar' }}
                    icon={<GoogleIcon />}
                />
            </ListContextProvider>
        );
        expect(screen.queryByTestId('GoogleIcon')).not.toBeNull();
    });

    it('should not appear selected if filterValues is empty', () => {
        render(
            <ListContextProvider value={defaultListContext}>
                <FilterListItem label="Foo" value={{ foo: 'bar' }} />
            </ListContextProvider>
        );
        expect(screen.getByText('Foo').parentElement?.dataset.selected).toBe(
            'false'
        );
    });

    it('should not appear selected if filterValues does not contain value', () => {
        render(
            <ListContextProvider
                value={{ ...defaultListContext, filterValues: { bar: 'baz' } }}
            >
                <FilterListItem label="Foo" value={{ foo: 'bar' }} />
            </ListContextProvider>
        );
        expect(screen.getByText('Foo').parentElement?.dataset.selected).toBe(
            'false'
        );
    });

    it('should appear selected if filterValues is equal to value', () => {
        render(
            <ListContextProvider
                value={{ ...defaultListContext, filterValues: { foo: 'bar' } }}
            >
                <FilterListItem label="Foo" value={{ foo: 'bar' }} />
            </ListContextProvider>
        );
        expect(screen.getByText('Foo').parentElement?.dataset.selected).toBe(
            'true'
        );
    });

    it('should appear selected if filterValues is equal to value for nested filters', () => {
        render(
            <ListContextProvider
                value={{
                    ...defaultListContext,
                    filterValues: {
                        $and: [
                            {
                                'marketData.IssrDsclsrDdln.Dt.Dt': {
                                    $gte: { $date: 'yesterday' },
                                },
                            },
                            {
                                'marketData.IssrDsclsrDdln.Dt.Dt': {
                                    $lte: { $date: 'today' },
                                },
                            },
                        ],
                    },
                }}
            >
                <FilterListItem
                    label="Foo"
                    value={{
                        $and: [
                            {
                                'marketData.IssrDsclsrDdln.Dt.Dt': {
                                    $gte: { $date: 'yesterday' },
                                },
                            },
                            {
                                'marketData.IssrDsclsrDdln.Dt.Dt': {
                                    $lte: { $date: 'today' },
                                },
                            },
                        ],
                    }}
                />
            </ListContextProvider>
        );
        expect(screen.getByText('Foo').parentElement?.dataset.selected).toBe(
            'true'
        );
    });

    it('should appear selected if filterValues contains value', () => {
        render(
            <ListContextProvider
                value={{
                    ...defaultListContext,
                    filterValues: { foo: 'bar', bar: 'baz' },
                }}
            >
                <FilterListItem label="Foo" value={{ foo: 'bar' }} />
            </ListContextProvider>
        );
        expect(screen.getByText('Foo').parentElement?.dataset.selected).toBe(
            'true'
        );
    });

    it('should allow to customize isSelected and toggleFilter', async () => {
        const { container } = render(<Cumulative />);

        expect(getSelectedItemsLabels(container)).toEqual([
            'News',
            'Tutorials',
        ]);
        screen.getByText(JSON.stringify({ category: ['tutorials', 'news'] }));

        screen.getByText('News').click();

        await waitFor(() =>
            expect(getSelectedItemsLabels(container)).toEqual(['Tutorials'])
        );
        await screen.findByText(JSON.stringify({ category: ['tutorials'] }));

        screen.getByText('Tutorials').click();

        await waitFor(() =>
            expect(getSelectedItemsLabels(container)).toEqual([])
        );
        expect(screen.getAllByText(JSON.stringify({})).length).toBe(2);

        screen.getByText('Tests').click();

        await waitFor(() =>
            expect(getSelectedItemsLabels(container)).toEqual(['Tests'])
        );
        await screen.findByText(JSON.stringify({ category: ['tests'] }));
    });
});

const getSelectedItemsLabels = (container: HTMLElement) =>
    Array.from(
        container.querySelectorAll<HTMLElement>('[data-selected="true"]')
    ).map(item => item.textContent);
