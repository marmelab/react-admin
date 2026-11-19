import * as React from 'react';
import { act, render, renderHook } from '@testing-library/react';

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
        const all: any[] = [];
        let perPage = 50;
        const page = 10;
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

    it('should never render children with the previous perPage when the perPage prop changes', () => {
        const renderedPaginations: { page: number; perPage: number }[] = [];
        const Child = ({
            page,
            perPage,
        }: {
            page: number;
            perPage: number;
        }) => {
            renderedPaginations.push({ page, perPage });
            return null;
        };
        const Parent = ({ initialPerPage }: { initialPerPage: number }) => {
            const { page, perPage } = usePaginationState({
                page: 3,
                perPage: initialPerPage,
            });
            return <Child page={page} perPage={perPage} />;
        };

        const { rerender } = render(<Parent initialPerPage={50} />);
        rerender(<Parent initialPerPage={5} />);

        expect(renderedPaginations).toEqual([
            { page: 3, perPage: 50 },
            { page: 1, perPage: 5 },
        ]);
    });

    it('should fall back to 25 items per page when the perPage prop is removed', () => {
        const { result, rerender } = renderHook(
            ({ perPage }: { perPage?: number }) =>
                usePaginationState({ perPage }),
            { initialProps: { perPage: 50 } }
        );

        rerender({ perPage: undefined });

        expect(result.current.pagination).toEqual({ page: 1, perPage: 25 });
    });

    it('should provide a setPagination function to update the pagination state (page + perPage)', () => {
        const all: any[] = [];
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
        const all: any[] = [];
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
        const all: any[] = [];
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
        const all: any[] = [];
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
