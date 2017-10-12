import assert from 'assert';
import { initialState as ids } from './ids';
import { initialState as params } from './params';
import { initialState as total } from './total';
import createReducer, { getParams } from './index';

export const initialState = {
    ids,
    params,
    total,
};

describe('list reducer', () => {
    it('should return initial state by default', () => {
        assert.deepEqual(initialState, createReducer('posts')(undefined, {}));
    });
});

describe('list selectors', () => {
    describe('getParams', () => {
        it('should return params state slice ', () => {
            assert.deepEqual(getParams(initialState), params);
        });
    });
});
