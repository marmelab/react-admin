import renderHook from '../util/renderHook';
import useFilterState from './useFilterState';
import { act } from 'react-testing-library';

describe('useFilterState', () => {
    it('should initialize filterState with default filter', () => {
        const { childrenProps } = renderHook(() => useFilterState({}));

        expect(childrenProps.filter).toEqual({ q: '' });
    });

    it('should initialize filterState with permanent filter', () => {
        const { childrenProps } = renderHook(() =>
            useFilterState({ permanentFilter: { type: 'thisOne' } })
        );

        expect(childrenProps.filter).toEqual({ q: '', type: 'thisOne' });
    });

    it('should initialize using filterToQuery if provided', () => {
        const { childrenProps } = renderHook(() =>
            useFilterState({ filterToQuery: v => ({ search: v }) })
        );

        expect(childrenProps.filter).toEqual({ search: '' });
    });

    it('should provide setFilter to update filter value after given debounceTime', async () => {
        const { childrenProps, childrenMock } = renderHook(() =>
            useFilterState({ debounceTime: 10 })
        );

        expect(childrenProps.filter).toEqual({ q: '' });

        act(() => childrenProps.setFilter('needle in a haystack'));

        expect(childrenMock).toBeCalledTimes(1);
        await new Promise(resolve => setTimeout(resolve, 10));

        expect(childrenMock).toBeCalledTimes(2);

        expect(childrenMock.mock.calls[1][0].filter).toEqual({
            q: 'needle in a haystack',
        });
    });

    it('should provide setFilter to update filter value after given debounceTime preserving permanentFilter and filterToQuery', async () => {
        const { childrenProps, childrenMock } = renderHook(() =>
            useFilterState({
                debounceTime: 10,
                permanentFilter: { type: 'thisOne' },
                filterToQuery: v => ({ search: v }),
            })
        );

        act(() => childrenProps.setFilter('needle in a haystack'));

        expect(childrenMock).toBeCalledTimes(1);
        await new Promise(resolve => setTimeout(resolve, 10));

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
