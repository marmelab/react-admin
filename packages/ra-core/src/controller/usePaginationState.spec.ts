import { act, renderHook } from '@testing-library/react-hooks';

import usePaginationState from './usePaginationState';

describe('usePaginationState', () => {
    it('should initialize pagination state with default', () => {
        const { result } = renderHook(() => usePaginationState());
        expect(result.current.pagination).toEqual({ page: 1, perPage: 25 });
    });

    it('should take given page and perPage props to initialize with', () => {
        const { result } = renderHook(() =>
            usePaginationState({ perPage: 50, page: 10 })
        );
        expect(result.current.pagination).toEqual({ page: 10, perPage: 50 });
    });

    it('should update perPage state when the perPage props update', () => {
        let perPage = 50,
            page = 10;
        const { result, rerender } = renderHook(() =>
            usePaginationState({ perPage, page })
        );
        expect(result.current.pagination).toEqual({ page: 10, perPage: 50 });
        perPage = 100;
        rerender();

        expect(result.all).toHaveLength(3);

        expect(result.current.pagination).toEqual({
            page: 1,
            perPage: 100,
        });
    });

    it('should provide a setPagination function to update the pagination state (page + perPage)', () => {
        const { result } = renderHook(() => usePaginationState());
        expect(result.current.pagination).toEqual({ page: 1, perPage: 25 });

        act(() => result.current.setPagination({ perPage: 100, page: 20 }));

        expect(result.all).toHaveLength(2);

        expect(result.current.pagination).toEqual({
            page: 20,
            perPage: 100,
        });
    });

    it('should provide setPage function to update the page state', () => {
        const { result } = renderHook(() => usePaginationState());
        expect(result.current.pagination).toEqual({ page: 1, perPage: 25 });

        act(() => result.current.setPage(20));

        expect(result.all).toHaveLength(2);

        expect(result.current.pagination).toEqual({
            page: 20,
            perPage: 25,
        });
    });

    it('should provide a setPerPage function to update the perPage state', () => {
        const { result } = renderHook(() => usePaginationState());
        expect(result.current.pagination).toEqual({ page: 1, perPage: 25 });

        act(() => result.current.setPerPage(100));

        expect(result.all).toHaveLength(2);

        expect(result.current.pagination).toEqual({
            page: 1,
            perPage: 100,
        });
    });

    it('should reset the current page to 1 when perPage state changes', () => {
        const { result } = renderHook(() =>
            usePaginationState({ page: 2, perPage: 25 })
        );

        expect(result.current.pagination).toEqual({ page: 2, perPage: 25 });

        act(() => result.current.setPerPage(100));

        expect(result.all).toHaveLength(2);

        expect(result.current.pagination).toEqual({
            page: 1,
            perPage: 100,
        });
    });
});
