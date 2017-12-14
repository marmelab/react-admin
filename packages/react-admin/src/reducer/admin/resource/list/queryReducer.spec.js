import assert from 'assert';
import queryReducer from './queryReducer';

describe('Query Reducer', () => {
    describe('SET_PAGE action', () => {
        test('should update the page', () => {
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
        test('should not update the filter', () => {
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
        test('should add new filter with given value when set', () => {
            const updatedState = queryReducer(
                {},
                {
                    type: 'SET_FILTER',
                    payload: { title: 'foo' },
                }
            );
            assert.deepEqual(updatedState.filter, { title: 'foo' });
        });

        test('should replace existing filter with given value', () => {
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

        test('should reset page to 1', () => {
            const updatedState = queryReducer(
                { page: 3 },
                { type: 'SET_FILTER', payload: {} }
            );
            assert.equal(updatedState.page, 1);
        });
    });
});
