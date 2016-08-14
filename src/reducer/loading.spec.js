import assert from 'assert';
import { FETCH_START, FETCH_END, FETCH_ERROR, FETCH_CANCEL } from '../actions/fetchActions';
import reducer from './loading';

describe('loading reducer', () => {
    it('should return 0 by default', () => {
        assert.equal(0, reducer(undefined, {}));
    });
    it('should increase with fetch actions', () => {
        assert.equal(1, reducer(0, { type: FETCH_START }));
    });
    it('should decrease with fetch actions success or failure', () => {
        assert.equal(0, reducer(1, { type: FETCH_END }));
        assert.equal(0, reducer(1, { type: FETCH_ERROR }));
        assert.equal(0, reducer(1, { type: FETCH_CANCEL }));
    });
});
