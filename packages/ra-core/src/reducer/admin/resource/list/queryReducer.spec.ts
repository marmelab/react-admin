import assert from 'assert';
import queryReducer, { SORT_ASC, SORT_DESC } from './queryReducer';

describe('Query Reducer', () => {
    describe('SET_PAGE action', () => {
        it('should update the page', () => {
            const updatedState = queryReducer(
                {
                    page: 1,
                },
                {
                    type: 'SET_PAGE',
                    payload: 2,
                }
            );
            assert.equal(updatedState.page, 2);
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
            assert.equal(updatedState.filter, initialFilter);
        });
    });
    describe('SET_FILTER action', () => {
        it('should add new filter with given value when set', () => {
            const updatedState = queryReducer(
                {},
                {
                    type: 'SET_FILTER',
                    payload: { title: 'foo' },
                }
            );
            assert.deepEqual(updatedState.filter, { title: 'foo' });
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
                    payload: { title: 'bar' },
                }
            );

            assert.deepEqual(updatedState.filter, { title: 'bar' });
        });

        it('should reset page to 1', () => {
            const updatedState = queryReducer({ page: 3 }, { type: 'SET_FILTER', payload: {} });
            assert.equal(updatedState.page, 1);
        });
    });
    describe('SET_SORT action', () => {
        it('should set SORT_ASC order by default when sort value is new', () => {
            const updatedState = queryReducer(
                {},
                {
                    type: 'SET_SORT',
                    payload: { sort: 'foo' },
                }
            );
            assert.deepEqual(updatedState, {
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
                    payload: { sort: 'foo', order: SORT_DESC },
                }
            );
            assert.deepEqual(updatedState, {
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
                    payload: { sort: 'foo' },
                }
            );
            assert.deepEqual(updatedState, {
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
                    payload: { sort: 'foo', order: SORT_DESC },
                }
            );
            assert.deepEqual(updatedState, {
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
            assert.equal(updatedState.perPage, 25);
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
            assert.equal(updatedState.page, 1);
        });
    });
});
