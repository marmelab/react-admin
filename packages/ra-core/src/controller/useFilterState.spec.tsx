import * as React from 'react';
import { renderHook } from 'ra-test';
import useFilterState from './useFilterState';
import { render, act, waitFor } from '@testing-library/react';

describe('useFilterState', () => {
    it('should initialize filterState with default filter', () => {
        const { hookValue } = renderHook(() => useFilterState({}));

        expect(hookValue.filter).toEqual({ q: '' });
    });

    it('should initialize filterState with permanent filter', () => {
        const { hookValue } = renderHook(() =>
            useFilterState({ permanentFilter: { type: 'thisOne' } })
        );

        expect(hookValue.filter).toEqual({ q: '', type: 'thisOne' });
    });

    it('should initialize using filterToQuery if provided', () => {
        const { hookValue } = renderHook(() =>
            useFilterState({ filterToQuery: v => ({ search: v }) })
        );

        expect(hookValue.filter).toEqual({ search: '' });
    });

    it('should return a setFilter function to update the filter value after a given debounceTime', async () => {
        const { hookValue, childrenMock } = renderHook(() =>
            useFilterState({ debounceTime: 50 })
        );

        expect(hookValue.filter).toEqual({ q: '' });

        act(() => hookValue.setFilter('needle in a haystack'));

        expect(childrenMock).toBeCalledTimes(1);
        await waitFor(() => {
            expect(childrenMock).toBeCalledTimes(2);
        });

        expect(childrenMock.mock.calls[1][0].filter).toEqual({
            q: 'needle in a haystack',
        });
    });

    it('should provide setFilter to update filter value after given debounceTime preserving permanentFilter and filterToQuery', async () => {
        let ret = { filter: null, setFilter: v => null };
        const permanentFilter = { type: 'thisOne' }; // define outside of the component or the useEffect runs indefinitely
        const Test = () => {
            const { filter, setFilter } = useFilterState({
                permanentFilter,
                debounceTime: 50,
                filterToQuery: v => ({ search: v }),
            });
            ret = { filter, setFilter };
            return <p>done</p>;
        };
        render(<Test />);

        act(() => ret.setFilter('needle in a haystack'));
        await waitFor(() => {
            expect(ret.filter).toEqual({
                type: 'thisOne',
                search: 'needle in a haystack',
            });
        });
    });

    it('should update the filter when the permanentFilter is updated', async () => {
        let ret = { filter: null, setFilter: v => null };
        const Test = ({ permanentFilter }) => {
            const { filter, setFilter } = useFilterState({
                permanentFilter,
                debounceTime: 0,
            });
            ret = { filter, setFilter };
            return <p>done</p>;
        };
        const { rerender } = render(<Test permanentFilter={{ foo: 'bar' }} />);
        expect(ret.filter).toEqual({ foo: 'bar', q: '' });
        act(() => ret.setFilter('search'));
        await waitFor(() => {
            expect(ret.filter).toEqual({ foo: 'bar', q: 'search' });
        });
        rerender(<Test permanentFilter={{ foo: 'baz' }} />);
        await waitFor(() => {
            expect(ret.filter).toEqual({ foo: 'baz', q: 'search' });
        });
    });
});
