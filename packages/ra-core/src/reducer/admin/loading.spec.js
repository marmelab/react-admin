import assert from 'assert';
import {
    FETCH_START,
    FETCH_END,
    FETCH_ERROR,
    FETCH_CANCEL,
} from '../../actions/fetchActions';

import {
    USER_LOGIN_LOADING,
    USER_LOGIN_SUCCESS,
    USER_LOGIN_FAILURE,
} from '../../actions/authActions';

import reducer from './loading';

describe('loading reducer', () => {
    it('should return 0 by default', () => {
        assert.equal(0, reducer(undefined, {}));
    });
    it('should increase with fetch or auth actions', () => {
        assert.equal(1, reducer(0, { type: FETCH_START }));
        assert.equal(1, reducer(0, { type: USER_LOGIN_LOADING }));
    });
    it('should decrease with fetch or auth actions success or failure', () => {
        assert.equal(0, reducer(1, { type: FETCH_END }));
        assert.equal(0, reducer(1, { type: FETCH_ERROR }));
        assert.equal(0, reducer(1, { type: FETCH_CANCEL }));
        assert.equal(0, reducer(1, { type: USER_LOGIN_SUCCESS }));
        assert.equal(0, reducer(1, { type: USER_LOGIN_FAILURE }));
    });
});
