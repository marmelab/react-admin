import { waitFor } from '@testing-library/react';
import { act, renderHook } from '@testing-library/react-hooks';

import useFilterState from './useFilterState';

describe('useFilterState', () => {
    it('should initialize filterState with default filter', () => {
        const { result } = renderHook(() => useFilterState({}));
        expect(result.current.filter).toEqual({ q: '' });
    });

    it('should initialize filterState with permanent filter', () => {
        const { result } = renderHook(() =>
            useFilterState({ permanentFilter: { type: 'thisOne' } })
        );

        expect(result.current.filter).toEqual({ q: '', type: 'thisOne' });
    });

    it('should initialize using filterToQuery if provided', () => {
        const { result } = renderHook(() =>
            useFilterState({ filterToQuery: v => ({ search: v }) })
        );
        expect(result.current.filter).toEqual({ search: '' });
    });

    it('should return a setFilter function to update the filter value after a given debounceTime', async () => {
        const { result } = renderHook(() =>
            useFilterState({ debounceTime: 50 })
        );

        expect(result.current.filter).toEqual({ q: '' });

        act(() => result.current.setFilter('needle in a haystack'));

        expect(result.all).toHaveLength(1);
        await waitFor(() => {
            expect(result.all).toHaveLength(2);
        });
        expect(result.current.filter).toEqual({
            q: 'needle in a haystack',
        });
    });

    it('should provide setFilter to update filter value after given debounceTime preserving permanentFilter and filterToQuery', async () => {
        const { result } = renderHook(() =>
            useFilterState({
                permanentFilter: { type: 'thisOne' },
                debounceTime: 50,
                filterToQuery: v => ({ search: v }),
            })
        );

        act(() => result.current.setFilter('needle in a haystack'));
        await waitFor(() => {
            expect(result.current.filter).toEqual({
                type: 'thisOne',
                search: 'needle in a haystack',
            });
        });
    });

    it('should update the filter when the permanentFilter is updated', async () => {
        let permanentFilter = { foo: 'bar' };
        const { result, rerender } = renderHook(() =>
            useFilterState({
                permanentFilter,
                debounceTime: 0,
            })
        );
        expect(result.current.filter).toEqual({ foo: 'bar', q: '' });
        act(() => result.current.setFilter('search'));
        await waitFor(() => {
            expect(result.current.filter).toEqual({ foo: 'bar', q: 'search' });
        });
        permanentFilter = { foo: 'baz' };
        rerender();
        await waitFor(() => {
            expect(result.current.filter).toEqual({ foo: 'baz', q: 'search' });
        });
    });
});
