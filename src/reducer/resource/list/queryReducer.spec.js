import assert from 'assert';
import queryReducer from './queryReducer';

describe('Query Reducer', () => {
    describe('SET_FILTER action', () => {
        it('should add new filter with given value when set', () => {
            const updatedState = queryReducer({}, {
                type: 'SET_FILTER',
                payload: {
                    field: 'title',
                    value: 'foo',
                },
            });

            assert.deepEqual(updatedState.filter, { title: 'foo' });
        });

        it('should replace existing filter with given value', () => {
            const updatedState = queryReducer({
                filter: {
                    title: 'foo',
                },
            }, {
                type: 'SET_FILTER',
                payload: {
                    field: 'title',
                    value: 'bar',
                },
            });

            assert.deepEqual(updatedState.filter, { title: 'bar' });
        });

        it('should remove existing filter if value is empty', () => {
            const updatedState = queryReducer({
                filter: {
                    title: '',
                },
            }, {
                type: 'SET_FILTER',
                payload: {
                    field: 'title',
                    value: '',
                },
            });

            assert.deepEqual(updatedState.filter, {});
        });

        it('should remove existing filter if value is undefined', () => {
            const updatedState = queryReducer({
                filter: {
                    title: 'foo',
                },
            }, {
                type: 'SET_FILTER',
                payload: {
                    field: 'title',
                    value: undefined,
                },
            });

            assert.deepEqual(updatedState.filter, {});
        });

        it('should reset page to 1', () => {
            const updatedState = queryReducer({ page: 3 }, { type: 'SET_FILTER', payload: {} });
            assert.equal(updatedState.page, 1);
        });
    });
});
