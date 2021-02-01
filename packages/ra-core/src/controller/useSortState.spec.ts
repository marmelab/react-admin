import { renderHook } from 'ra-test';
import useSortState, { defaultSort } from './useSortState';
import { act } from '@testing-library/react';

describe('useSortState', () => {
    it('should initialize sortState with default sort', () => {
        const { hookValue } = renderHook(() => useSortState());

        expect(hookValue.sort).toEqual(defaultSort);
    });

    it('should initialize sortState with given sort', () => {
        const { hookValue } = renderHook(() =>
            useSortState({
                field: 'name',
                order: 'ASC',
            })
        );

        expect(hookValue.sort).toEqual({ field: 'name', order: 'ASC' });
    });

    it('should provide setSort method to change the whole sort', () => {
        const { hookValue, childrenMock } = renderHook(() =>
            useSortState({ field: 'id', order: 'DESC' })
        );

        expect(hookValue.sort).toEqual({ field: 'id', order: 'DESC' });

        act(() => hookValue.setSort({ field: 'name', order: 'ASC' }));
        expect(childrenMock.mock.calls[1][0].sort).toEqual({
            field: 'name',
            order: 'ASC',
        });
    });

    describe('setSortField in return value', () => {
        it('should just change the order if receiving the current field', () => {
            const { hookValue, childrenMock } = renderHook(() =>
                useSortState({ field: 'id', order: 'DESC' })
            );

            expect(hookValue.sort).toEqual({ field: 'id', order: 'DESC' });

            act(() => hookValue.setSortField('id'));
            expect(childrenMock.mock.calls[1][0].sort).toEqual({
                field: 'id',
                order: 'ASC',
            });
        });

        it('should change the field and set the order to ASC if receiving another field', () => {
            const { hookValue, childrenMock } = renderHook(() =>
                useSortState({ field: 'id', order: 'ASC' })
            );

            expect(hookValue.sort).toEqual({ field: 'id', order: 'ASC' });

            act(() => hookValue.setSortField('name'));
            expect(childrenMock.mock.calls[1][0].sort).toEqual({
                field: 'name',
                order: 'ASC',
            });
            act(() => hookValue.setSortField('id'));
            expect(childrenMock.mock.calls[2][0].sort).toEqual({
                field: 'id',
                order: 'ASC',
            });
        });
    });
});
