import * as React from 'react';
import { act, render, renderHook } from '@testing-library/react';

import useSortState, { defaultSort } from './useSortState';
import { SortPayload } from '../types';

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

    describe('sort prop change', () => {
        it('should never render children with the previous sort when the sort prop changes', () => {
            const renderedSorts: SortPayload[] = [];
            const Child = ({ sort }: { sort: SortPayload }) => {
                renderedSorts.push(sort);
                return null;
            };
            const Parent = ({ initialSort }: { initialSort: SortPayload }) => {
                const { sort } = useSortState(initialSort);
                return <Child sort={sort} />;
            };

            const { rerender } = render(
                <Parent initialSort={{ field: 'id', order: 'ASC' }} />
            );
            rerender(
                <Parent initialSort={{ field: 'title', order: 'DESC' }} />
            );

            expect(renderedSorts).toEqual([
                { field: 'id', order: 'ASC' },
                { field: 'title', order: 'DESC' },
            ]);
        });

        it('should keep the current sort when the sort prop is a new object with the same field and order', () => {
            const { result, rerender } = renderHook(
                ({ initialSort }: { initialSort: SortPayload }) =>
                    useSortState(initialSort),
                { initialProps: { initialSort: { field: 'id', order: 'ASC' } } }
            );

            act(() =>
                result.current.setSort({ field: 'title', order: 'DESC' })
            );
            rerender({ initialSort: { field: 'id', order: 'ASC' } });

            expect(result.current.sort).toEqual({
                field: 'title',
                order: 'DESC',
            });
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
