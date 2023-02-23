import * as React from 'react';
import expect from 'expect';
import { render, screen } from '@testing-library/react';

import { ListContextProvider, ListControllerResult } from 'ra-core';
import { FilterListItem } from './FilterListItem';
import { Cumulative } from './FilterList.stories';

const defaultListContext: ListControllerResult = {
    data: [],
    displayedFilters: null,
    filterValues: null,
    hasNextPage: false,
    hasPreviousPage: false,
    hideFilter: (filterName: string) => {},
    isFetching: false,
    isLoading: false,
    onSelect: (ids: any[]) => {},
    onToggleItem: (id: any) => {},
    onUnselectItems: () => {},
    page: 1,
    perPage: 10,
    refetch: () => {},
    resource: 'posts',
    selectedIds: [],
    setFilters: (filters: any) => {},
    setPage: (page: number) => {},
    setPerPage: (perPage: number) => {},
    setSort: (sort: any) => {},
    showFilter: (filterName: string) => {},
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

    it('should allow to customize isSelected and toggleFilter', () => {
        const { container } = render(<Cumulative />);

        expect(
            Array.from(
                container.querySelectorAll<HTMLElement>(
                    '[data-selected="true"]'
                )
            ).map(item => item.textContent)
        ).toEqual(['News', 'Tutorials']);

        screen.getByText(JSON.stringify({ category: ['tutorials', 'news'] }));

        screen.getByText('News').click();

        expect(
            Array.from(
                container.querySelectorAll<HTMLElement>(
                    '[data-selected="true"]'
                )
            ).map(item => item.textContent)
        ).toEqual(['Tutorials']);
        screen.getByText(JSON.stringify({ category: ['tutorials'] }));

        screen.getByText('Tutorials').click();

        expect(
            Array.from(
                container.querySelectorAll<HTMLElement>(
                    '[data-selected="true"]'
                )
            ).map(item => item.textContent)
        ).toEqual([]);
        expect(screen.getAllByText(JSON.stringify({})).length).toBe(2);

        screen.getByText('Tests').click();

        expect(
            Array.from(
                container.querySelectorAll<HTMLElement>(
                    '[data-selected="true"]'
                )
            ).map(item => item.textContent)
        ).toEqual(['Tests']);
        screen.getByText(JSON.stringify({ category: ['tests'] }));
    });
});
