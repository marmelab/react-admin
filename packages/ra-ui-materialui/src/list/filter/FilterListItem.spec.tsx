import * as React from 'react';
import expect from 'expect';
import { render, cleanup } from '@testing-library/react';

import { ListContextProvider } from 'ra-core';
import FilterListItem from './FilterListItem';

describe('<FilterListItem/>', () => {
    afterEach(cleanup);

    it("should display the item label when it's a string", () => {
        const { queryByText } = render(
            <ListContextProvider value={{ hideFilter: true }}>
                <FilterListItem label="Foo" value={{ foo: 'bar' }} />
            </ListContextProvider>
        );
        expect(queryByText('Foo')).not.toBeNull();
    });

    it("should display the item label when it's an element", () => {
        const { queryByTestId } = render(
            <ListContextProvider value={{ hideFilter: true }}>
                <FilterListItem
                    label={<span data-testid="123">Foo</span>}
                    value={{ foo: 'bar' }}
                />
            </ListContextProvider>
        );
        expect(queryByTestId('123')).not.toBeNull();
    });

    it('should not appear selected if filterValues is empty', () => {
        const { getByText } = render(
            <ListContextProvider value={{ hideFilter: true }}>
                <FilterListItem label="Foo" value={{ foo: 'bar' }} />
            </ListContextProvider>
        );
        expect(getByText('Foo').parentElement.dataset.selected).toBe('false');
    });

    it('should not appear selected if filterValues does not contain value', () => {
        const { getByText } = render(
            <ListContextProvider
                value={{ hideFilter: true, filterValues: { bar: 'baz' } }}
            >
                <FilterListItem label="Foo" value={{ foo: 'bar' }} />
            </ListContextProvider>
        );
        expect(getByText('Foo').parentElement.dataset.selected).toBe('false');
    });

    it('should appear selected if filterValues is equal to value', () => {
        const { getByText } = render(
            <ListContextProvider
                value={{ hideFilter: true, filterValues: { foo: 'bar' } }}
            >
                <FilterListItem label="Foo" value={{ foo: 'bar' }} />
            </ListContextProvider>
        );
        expect(getByText('Foo').parentElement.dataset.selected).toBe('true');
    });

    it('should appear selected if filterValues is equal to value for nested filters', () => {
        const { getByText } = render(
            <ListContextProvider
                value={{
                    hideFilter: true,
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
        expect(getByText('Foo').parentElement.dataset.selected).toBe('true');
    });

    it('should appear selected if filterValues contains value', () => {
        const { getByText } = render(
            <ListContextProvider
                value={{
                    hideFilter: true,
                    filterValues: { foo: 'bar', bar: 'baz' },
                }}
            >
                <FilterListItem label="Foo" value={{ foo: 'bar' }} />
            </ListContextProvider>
        );
        expect(getByText('Foo').parentElement.dataset.selected).toBe('true');
    });
});
