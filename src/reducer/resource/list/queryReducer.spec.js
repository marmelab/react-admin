import assert from 'assert';
import queryReducer from './queryReducer';

describe('Query Reducer', () => {
    describe('SET_FILTER action', () => {
        it('should add new filter with given value when set', () => {
            const updatedState = queryReducer({}, {
                type: 'SET_FILTER',
                payload: { title: 'foo' },
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
                payload: { title: 'bar' },
            });

            assert.deepEqual(updatedState.filter, { title: 'bar' });
        });

        it('should reset page to 1', () => {
            const updatedState = queryReducer({ page: 3 }, { type: 'SET_FILTER', payload: {} });
            assert.equal(updatedState.page, 1);
        });
    });
});
