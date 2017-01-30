import assert from 'assert';
import reducer from './params';

describe('List Params Reducer', () => {
    it('should contains correct default state', () => {
        const defaultState = reducer('foo')(undefined, {});
        assert.deepEqual(defaultState, {
            filter: {},
            order: 'DESC',
            page: 1,
            perPage: 10,
            sort: 'id',
        });
    });
});
