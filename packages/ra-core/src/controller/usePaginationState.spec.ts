import { act, renderHook } from '@testing-library/react';

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
        let all: any[] = [];
        let perPage = 50,
            page = 10;
        const { result, rerender } = renderHook(() => {
            const state = usePaginationState({ perPage, page });
            all.push(state);
            return state;
        });
        expect(result.current.pagination).toEqual({ page: 10, perPage: 50 });
        perPage = 100;
        rerender();

        expect(all).toHaveLength(3);

        expect(result.current.pagination).toEqual({
            page: 1,
            perPage: 100,
        });
    });

    it('should provide a setPagination function to update the pagination state (page + perPage)', () => {
        let all: any[] = [];
        const { result } = renderHook(() => {
            const state = usePaginationState();
            all.push(state);
            return state;
        });
        expect(result.current.pagination).toEqual({ page: 1, perPage: 25 });

        act(() => result.current.setPagination({ perPage: 100, page: 20 }));

        expect(all).toHaveLength(2);

        expect(result.current.pagination).toEqual({
            page: 20,
            perPage: 100,
        });
    });

    it('should provide setPage function to update the page state', () => {
        let all: any[] = [];
        const { result } = renderHook(() => {
            const state = usePaginationState();
            all.push(state);
            return state;
        });
        expect(result.current.pagination).toEqual({ page: 1, perPage: 25 });

        act(() => result.current.setPage(20));

        expect(all).toHaveLength(2);

        expect(result.current.pagination).toEqual({
            page: 20,
            perPage: 25,
        });
    });

    it('should provide a setPerPage function to update the perPage state', () => {
        let all: any[] = [];
        const { result } = renderHook(() => {
            const state = usePaginationState();
            all.push(state);
            return state;
        });
        expect(result.current.pagination).toEqual({ page: 1, perPage: 25 });

        act(() => result.current.setPerPage(100));

        expect(all).toHaveLength(2);

        expect(result.current.pagination).toEqual({
            page: 1,
            perPage: 100,
        });
    });

    it('should reset the current page to 1 when perPage state changes', () => {
        let all: any[] = [];
        const { result } = renderHook(() => {
            const state = usePaginationState({ page: 2, perPage: 25 });
            all.push(state);
            return state;
        });

        expect(result.current.pagination).toEqual({ page: 2, perPage: 25 });

        act(() => result.current.setPerPage(100));

        expect(all).toHaveLength(2);

        expect(result.current.pagination).toEqual({
            page: 1,
            perPage: 100,
        });
    });
});
