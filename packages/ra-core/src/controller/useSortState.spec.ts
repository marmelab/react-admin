import { act, renderHook } from '@testing-library/react';

import useSortState, { defaultSort } from './useSortState';

describe('useSortState', () => {
    it('should initialize sortState with default sort', () => {
        const { result } = renderHook(() => useSortState());

        expect(result.current.sort).toEqual(defaultSort);
    });

    it('should initialize sortState with given sort', () => {
        const { result } = renderHook(() =>
            useSortState({
                field: 'name',
                order: 'ASC',
            })
        );

        expect(result.current.sort).toEqual({ field: 'name', order: 'ASC' });
    });

    it('should provide setSort method to change the whole sort', () => {
        const { result } = renderHook(() =>
            useSortState({ field: 'id', order: 'DESC' })
        );

        expect(result.current.sort).toEqual({ field: 'id', order: 'DESC' });

        act(() => result.current.setSort({ field: 'name', order: 'ASC' }));
        expect(result.current.sort).toEqual({
            field: 'name',
            order: 'ASC',
        });
    });

    describe('setSortField in return value', () => {
        it('should just change the order if receiving the current field', () => {
            const { result } = renderHook(() =>
                useSortState({ field: 'id', order: 'DESC' })
            );

            expect(result.current.sort).toEqual({ field: 'id', order: 'DESC' });

            act(() => result.current.setSortField('id'));
            expect(result.current.sort).toEqual({
                field: 'id',
                order: 'ASC',
            });
        });

        it('should change the field and set the order to ASC if receiving another field', () => {
            const { result } = renderHook(() =>
                useSortState({ field: 'id', order: 'ASC' })
            );

            expect(result.current.sort).toEqual({ field: 'id', order: 'ASC' });

            act(() => result.current.setSortField('name'));
            expect(result.current.sort).toEqual({
                field: 'name',
                order: 'ASC',
            });
            act(() => result.current.setSortField('id'));
            expect(result.current.sort).toEqual({
                field: 'id',
                order: 'ASC',
            });
        });
    });
});
