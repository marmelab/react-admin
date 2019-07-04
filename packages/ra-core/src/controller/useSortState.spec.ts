import renderHook from '../util/renderHook';
import useSortState, { defaultSort } from './useSortState';
import { act } from 'react-testing-library';

describe('useSortState', () => {
    it('should initialize sortState with default sort', () => {
        const { childrenProps } = renderHook(() => useSortState());

        expect(childrenProps.sort).toEqual(defaultSort);
    });

    it('should initialize sortState with given sort', () => {
        const { childrenProps } = renderHook(() =>
            useSortState({
                field: 'name',
                order: 'ASC',
            })
        );

        expect(childrenProps.sort).toEqual({ field: 'name', order: 'ASC' });
    });

    it('should provide setSort method to change the whole sort', () => {
        const { childrenProps, childrenMock } = renderHook(() =>
            useSortState({ field: 'id', order: 'DESC' })
        );

        expect(childrenProps.sort).toEqual({ field: 'id', order: 'DESC' });

        act(() => childrenProps.setSort({ field: 'name', order: 'ASC' }));
        expect(childrenMock.mock.calls[1][0].sort).toEqual({
            field: 'name',
            order: 'ASC',
        });
    });

    describe('should provide setSortField method that', () => {
        it('should just change the order if receiving the current field', () => {
            const { childrenProps, childrenMock } = renderHook(() =>
                useSortState({ field: 'id', order: 'DESC' })
            );

            expect(childrenProps.sort).toEqual({ field: 'id', order: 'DESC' });

            act(() => childrenProps.setSortField('id'));
            expect(childrenMock.mock.calls[1][0].sort).toEqual({
                field: 'id',
                order: 'ASC',
            });
        });

        it('should change the field and set the order to ASC if receiving another field', () => {
            const { childrenProps, childrenMock } = renderHook(() =>
                useSortState({ field: 'id', order: 'ASC' })
            );

            expect(childrenProps.sort).toEqual({ field: 'id', order: 'ASC' });

            act(() => childrenProps.setSortField('name'));
            expect(childrenMock.mock.calls[1][0].sort).toEqual({
                field: 'name',
                order: 'ASC',
            });
            act(() => childrenProps.setSortField('id'));
            expect(childrenMock.mock.calls[2][0].sort).toEqual({
                field: 'id',
                order: 'ASC',
            });
        });
    });
});
