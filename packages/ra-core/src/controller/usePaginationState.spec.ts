import { renderHook } from 'ra-test';
import usePaginationState from './usePaginationState';
import { act } from '@testing-library/react';

describe('usePaginationState', () => {
    it('should initialize pagination state with default', () => {
        const { hookValue } = renderHook(() => usePaginationState());
        expect(hookValue.pagination).toEqual({ page: 1, perPage: 25 });
    });

    it('should take given page and perPage props to initialize with', () => {
        const { hookValue } = renderHook(() =>
            usePaginationState({ perPage: 50, page: 10 })
        );
        expect(hookValue.pagination).toEqual({ page: 10, perPage: 50 });
    });

    it('should update perPage state when the perPage props update', () => {
        const { hookValue, childrenMock, rerender } = renderHook(() =>
            usePaginationState({ perPage: 50, page: 10 })
        );
        expect(hookValue.pagination).toEqual({ perPage: 50, page: 10 });
        rerender(() => usePaginationState({ perPage: 100, page: 10 }));

        expect(childrenMock).toBeCalledTimes(3);

        expect(childrenMock.mock.calls[2][0].pagination).toEqual({
            page: 1,
            perPage: 100,
        });
    });

    it('should provide a setPagination function to update the pagination state (page + perPage)', () => {
        const { hookValue, childrenMock } = renderHook(() =>
            usePaginationState()
        );
        expect(hookValue.pagination).toEqual({ page: 1, perPage: 25 });

        act(() => hookValue.setPagination({ perPage: 100, page: 20 }));

        expect(childrenMock).toBeCalledTimes(2);

        expect(childrenMock.mock.calls[1][0].pagination).toEqual({
            page: 20,
            perPage: 100,
        });
    });

    it('should provide setPage function to update the page state', () => {
        const { hookValue, childrenMock } = renderHook(() =>
            usePaginationState()
        );
        expect(hookValue.pagination).toEqual({ page: 1, perPage: 25 });

        act(() => hookValue.setPage(20));

        expect(childrenMock).toBeCalledTimes(2);

        expect(childrenMock.mock.calls[1][0].pagination).toEqual({
            page: 20,
            perPage: 25,
        });
    });

    it('should provide a setPerPage function to update the perPage state', () => {
        const { hookValue, childrenMock } = renderHook(() =>
            usePaginationState()
        );
        expect(hookValue.pagination).toEqual({ page: 1, perPage: 25 });

        act(() => hookValue.setPerPage(100));

        expect(childrenMock).toBeCalledTimes(2);

        expect(childrenMock.mock.calls[1][0].pagination).toEqual({
            page: 1,
            perPage: 100,
        });
    });

    it('should reset the current page to 1 when perPage state changes', () => {
        const { hookValue, childrenMock } = renderHook(() =>
            usePaginationState({ page: 2, perPage: 25 })
        );
        expect(hookValue.pagination).toEqual({ page: 2, perPage: 25 });

        act(() => hookValue.setPerPage(100));

        expect(childrenMock).toBeCalledTimes(2);

        expect(childrenMock.mock.calls[1][0].pagination).toEqual({
            page: 1,
            perPage: 100,
        });
    });
});
