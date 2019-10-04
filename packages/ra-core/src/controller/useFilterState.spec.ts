import renderHook from '../util/renderHook';
import useFilterState from './useFilterState';
import { act } from '@testing-library/react';

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
        await new Promise(resolve => setTimeout(resolve, 70));

        expect(childrenMock).toBeCalledTimes(2);

        expect(childrenMock.mock.calls[1][0].filter).toEqual({
            q: 'needle in a haystack',
        });
    });

    it('should provide setFilter to update filter value after given debounceTime preserving permanentFilter and filterToQuery', async () => {
        const { hookValue, childrenMock } = renderHook(() =>
            useFilterState({
                debounceTime: 50,
                permanentFilter: { type: 'thisOne' },
                filterToQuery: v => ({ search: v }),
            })
        );

        act(() => hookValue.setFilter('needle in a haystack'));

        expect(childrenMock).toBeCalledTimes(1);
        await new Promise(resolve => setTimeout(resolve, 70));

        expect(childrenMock).toBeCalledTimes(2);

        expect(childrenMock.mock.calls[0][0].filter).toEqual({
            type: 'thisOne',
            search: '',
        });

        expect(childrenMock.mock.calls[1][0].filter).toEqual({
            type: 'thisOne',
            search: 'needle in a haystack',
        });
    });
});
