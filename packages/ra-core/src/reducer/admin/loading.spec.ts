import expect from 'expect';
import {
    FETCH_START,
    FETCH_END,
    FETCH_ERROR,
    FETCH_CANCEL,
} from '../../actions/fetchActions';

import reducer from './loading';

describe('loading reducer', () => {
    it('should return 0 by default', () => {
        expect(reducer(undefined, { type: 'ANY' })).toEqual(0);
    });
    it('should increase with fetch or auth actions', () => {
        expect(reducer(0, { type: FETCH_START })).toEqual(1);
    });
    it('should decrease with fetch or auth actions success or failure', () => {
        expect(reducer(1, { type: FETCH_END })).toEqual(0);
        expect(reducer(1, { type: FETCH_ERROR })).toEqual(0);
        expect(reducer(1, { type: FETCH_CANCEL })).toEqual(0);
    });
});
