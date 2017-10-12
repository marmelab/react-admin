import assert from 'assert';
import createReducer, { initialState } from './params';

describe('params reducer', () => {
    it('should return initial state by default', () => {
        assert.equal(initialState, createReducer('posts')(undefined, {}));
    });
});
