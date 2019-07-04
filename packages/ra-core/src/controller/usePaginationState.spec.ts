import renderHook from '../util/renderHook';
import usePaginationState from './usePaginationState';
import { act } from 'react-testing-library';

describe('usePaginationState', () => {
    it('should initialise pagination state with default', () => {
        const { childrenProps } = renderHook(() => usePaginationState());
        expect(childrenProps.pagination).toEqual({ page: 1, perPage: 25 });
    });

    it('should take given page and perpage to initalise', () => {
        const { childrenProps } = renderHook(() =>
            usePaginationState({ perPage: 50, page: 10 })
        );
        expect(childrenProps.pagination).toEqual({ page: 10, perPage: 50 });
    });

    it('should update perPage if its props update', () => {
        const { childrenProps, childrenMock, rerender } = renderHook(() =>
            usePaginationState({ perPage: 50, page: 10 })
        );
        expect(childrenProps.pagination).toEqual({ page: 10, perPage: 50 });
        rerender(() => usePaginationState({ perPage: 100, page: 10 }));

        expect(childrenMock).toBeCalledTimes(3);

        expect(childrenMock.mock.calls[2][0].pagination).toEqual({
            page: 10,
            perPage: 100,
        });
    });

    it('should provide setPagination to setPaginationState', () => {
        const { childrenProps, childrenMock } = renderHook(() =>
            usePaginationState()
        );
        expect(childrenProps.pagination).toEqual({ page: 1, perPage: 25 });

        act(() => childrenProps.setPagination({ perPage: 100, page: 20 }));

        expect(childrenMock).toBeCalledTimes(2);

        expect(childrenMock.mock.calls[1][0].pagination).toEqual({
            page: 20,
            perPage: 100,
        });
    });

    it('should provide setPage to set only the page', () => {
        const { childrenProps, childrenMock } = renderHook(() =>
            usePaginationState()
        );
        expect(childrenProps.pagination).toEqual({ page: 1, perPage: 25 });

        act(() => childrenProps.setPage(20));

        expect(childrenMock).toBeCalledTimes(2);

        expect(childrenMock.mock.calls[1][0].pagination).toEqual({
            page: 20,
            perPage: 25,
        });
    });

    it('should provide setPerPage to set only perPage', () => {
        const { childrenProps, childrenMock } = renderHook(() =>
            usePaginationState()
        );
        expect(childrenProps.pagination).toEqual({ page: 1, perPage: 25 });

        act(() => childrenProps.setPerPage(100));

        expect(childrenMock).toBeCalledTimes(2);

        expect(childrenMock.mock.calls[1][0].pagination).toEqual({
            page: 1,
            perPage: 100,
        });
    });
});
