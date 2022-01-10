import expect from 'expect';
import { queryReducer, SORT_ASC, SORT_DESC } from './queryReducer';

describe('Query Reducer', () => {
    describe('SET_PAGE action', () => {
        it('should update the page', () => {
            const updatedState = queryReducer(
                { page: 1 },
                {
                    type: 'SET_PAGE',
                    payload: 2,
                }
            );
            expect(updatedState.page).toEqual(2);
        });
        it('should not update the filter', () => {
            const initialFilter = {};
            const updatedState = queryReducer(
                {
                    filter: initialFilter,
                    page: 1,
                },
                {
                    type: 'SET_PAGE',
                    payload: 2,
                }
            );
            expect(updatedState.filter).toEqual(initialFilter);
        });
    });
    describe('SET_FILTER action', () => {
        it('should add new filter with given value when set', () => {
            const updatedState = queryReducer(
                {},
                {
                    type: 'SET_FILTER',
                    payload: { filter: { title: 'foo' } },
                }
            );
            expect(updatedState.filter).toEqual({ title: 'foo' });
        });

        it('should replace existing filter with given value', () => {
            const updatedState = queryReducer(
                {
                    filter: {
                        title: 'foo',
                    },
                },
                {
                    type: 'SET_FILTER',
                    payload: { filter: { title: 'bar' } },
                }
            );

            expect(updatedState.filter).toEqual({ title: 'bar' });
        });

        it('should add new filter and displayedFilter with given value when set', () => {
            const updatedState = queryReducer(
                {},
                {
                    type: 'SET_FILTER',
                    payload: {
                        filter: { title: 'foo' },
                        displayedFilters: { title: true },
                    },
                }
            );
            expect(updatedState.filter).toEqual({ title: 'foo' });
            expect(updatedState.displayedFilters).toEqual({ title: true });
        });

        it('should reset page to 1', () => {
            const updatedState = queryReducer(
                { page: 3 },
                { type: 'SET_FILTER', payload: {} }
            );
            expect(updatedState.page).toEqual(1);
        });
    });
    describe('SHOW_FILTER action', () => {
        it('should add the filter to the displayed filters and set the filter value', () => {
            const updatedState = queryReducer(
                {
                    filter: { bar: 1 },
                    displayedFilters: { bar: true },
                },
                {
                    type: 'SHOW_FILTER',
                    payload: { filterName: 'foo', defaultValue: 'bar' },
                }
            );
            expect(updatedState.filter).toEqual({ bar: 1, foo: 'bar' });
            expect(updatedState.displayedFilters).toEqual({
                bar: true,
                foo: true,
            });
        });

        it('should work with false default value', () => {
            const updatedState = queryReducer(
                { filter: {}, displayedFilters: {} },
                {
                    type: 'SHOW_FILTER',
                    payload: { filterName: 'foo', defaultValue: false },
                }
            );
            expect(updatedState.filter).toEqual({ foo: false });
            expect(updatedState.displayedFilters).toEqual({
                foo: true,
            });
        });

        it('should work without default value', () => {
            const updatedState = queryReducer(
                {
                    filter: { bar: 1 },
                    displayedFilters: { bar: true },
                },
                {
                    type: 'SHOW_FILTER',
                    payload: { filterName: 'foo' },
                }
            );
            expect(updatedState.filter).toEqual({ bar: 1 });
            expect(updatedState.displayedFilters).toEqual({
                bar: true,
                foo: true,
            });
        });

        it('should not change an already shown filter', () => {
            const updatedState = queryReducer(
                {
                    filter: { foo: 1 },
                    displayedFilters: { foo: true },
                },
                {
                    type: 'SHOW_FILTER',
                    payload: { filterName: 'foo', defaultValue: 'bar' },
                }
            );
            expect(updatedState.filter).toEqual({ foo: 1 });
            expect(updatedState.displayedFilters).toEqual({ foo: true });
        });
    });
    describe('HIDE_FILTER action', () => {
        it('should remove the filter from the displayed filters and reset the filter value', () => {
            const updatedState = queryReducer(
                {
                    filter: { foo: 2, bar: 1 },
                    displayedFilters: { foo: true, bar: true },
                },
                {
                    type: 'HIDE_FILTER',
                    payload: 'bar',
                }
            );
            expect(updatedState.filter).toEqual({ foo: 2 });
            expect(updatedState.displayedFilters).toEqual({
                foo: true,
            });
        });

        it('should do nothing if the filter is already hidden', () => {
            const updatedState = queryReducer(
                {
                    filter: { foo: 2 },
                    displayedFilters: { foo: true },
                },
                {
                    type: 'HIDE_FILTER',
                    payload: 'bar',
                }
            );
            expect(updatedState.filter).toEqual({ foo: 2 });
            expect(updatedState.displayedFilters).toEqual({
                foo: true,
            });
        });
    });
    describe('SET_SORT action', () => {
        it('should set SORT_ASC order by default when sort value is new', () => {
            const updatedState = queryReducer(
                {},
                {
                    type: 'SET_SORT',
                    payload: { field: 'foo' },
                }
            );
            expect(updatedState).toEqual({
                sort: 'foo',
                order: SORT_ASC,
                page: 1,
            });
        });
        it('should set order by payload.order value when sort value is new', () => {
            const updatedState = queryReducer(
                {},
                {
                    type: 'SET_SORT',
                    payload: { field: 'foo', order: SORT_DESC },
                }
            );
            expect(updatedState).toEqual({
                sort: 'foo',
                order: SORT_DESC,
                page: 1,
            });
        });
        it("should set order as the opposite of the one in previous state when sort hasn't change", () => {
            const updatedState = queryReducer(
                {
                    sort: 'foo',
                    order: SORT_DESC,
                    page: 1,
                },
                {
                    type: 'SET_SORT',
                    payload: { field: 'foo' },
                }
            );
            expect(updatedState).toEqual({
                sort: 'foo',
                order: SORT_ASC,
                page: 1,
            });
        });
        it("should set order as the opposite of the one in previous state even if order is specified in the payload when sort hasn't change", () => {
            const updatedState = queryReducer(
                {
                    sort: 'foo',
                    order: SORT_DESC,
                    page: 1,
                },
                {
                    type: 'SET_SORT',
                    payload: { field: 'foo', order: SORT_DESC },
                }
            );
            expect(updatedState).toEqual({
                sort: 'foo',
                order: SORT_ASC,
                page: 1,
            });
        });
    });
    describe('SET_PER_PAGE action', () => {
        it('should update per page count', () => {
            const updatedState = queryReducer(
                {
                    perPage: 10,
                },
                {
                    type: 'SET_PER_PAGE',
                    payload: 25,
                }
            );
            expect(updatedState.perPage).toEqual(25);
        });
        it('should reset page to 1', () => {
            const updatedState = queryReducer(
                {
                    page: 5,
                    perPage: 10,
                },
                {
                    type: 'SET_PER_PAGE',
                    payload: 25,
                }
            );
            expect(updatedState.page).toEqual(1);
        });
    });
});
