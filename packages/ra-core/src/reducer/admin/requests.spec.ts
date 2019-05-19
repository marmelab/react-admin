import expect from 'expect';
import {
    FETCH_START,
    FETCH_END,
    FETCH_ERROR,
    FETCH_CANCEL,
} from '../../actions/fetchActions';
import reducer from './requests';

describe('requests reducer', () => {
    it('should return an empty object by default', () => {
        expect(reducer(undefined, { type: 'OTHER_ACTION' })).toEqual({});
    });

    it('should return a loading state upon FETCH_START', () => {
        expect(
            reducer(
                {},
                {
                    type: 'GET_ONE_LOADING',
                    payload: { id: 123 },
                    meta: {
                        fetchStatus: FETCH_START,
                        fetchResponse: 'GET_ONE',
                    },
                }
            )
        ).toEqual({
            '{"type":"GET_ONE","payload":{"id":123}}': {
                loaded: false,
                loading: true,
            },
        });
    });
    it('should return a reloading state upon second FETCH_START', () => {
        expect(
            reducer(
                {
                    '{"type":"GET_ONE","payload":{"id":123}}': {
                        loaded: true,
                        loading: false,
                    },
                },
                {
                    type: 'GET_ONE_LOADING',
                    payload: { id: 123 },
                    meta: {
                        fetchStatus: FETCH_START,
                        fetchResponse: 'GET_ONE',
                    },
                }
            )
        ).toEqual({
            '{"type":"GET_ONE","payload":{"id":123}}': {
                loaded: true,
                loading: true,
            },
        });
    });
    it('should return a loaded state upon FETCH_END', () => {
        expect(
            reducer(
                {
                    '{"type":"GET_ONE","payload":{"id":123}}': {
                        loaded: false,
                        loading: true,
                    },
                },
                {
                    type: 'GET_ONE_SUCCESS',
                    requestPayload: { id: 123 },
                    meta: {
                        fetchStatus: FETCH_END,
                        fetchResponse: 'GET_ONE',
                    },
                }
            )
        ).toEqual({
            '{"type":"GET_ONE","payload":{"id":123}}': {
                loaded: true,
                loading: false,
            },
        });
    });
    it('should return an error state upon FETCH_ERROR', () => {
        expect(
            reducer(
                {
                    '{"type":"GET_ONE","payload":{"id":123}}': {
                        loaded: false,
                        loading: true,
                    },
                },
                {
                    type: 'GET_ONE_ERROR',
                    requestPayload: { id: 123 },
                    error: 'problem!',
                    meta: {
                        fetchStatus: FETCH_ERROR,
                        fetchResponse: 'GET_ONE',
                    },
                }
            )
        ).toEqual({
            '{"type":"GET_ONE","payload":{"id":123}}': {
                loaded: false,
                loading: false,
                error: 'problem!',
            },
        });
    });
    it('should not keep the error on subsequent reloads', () => {
        expect(
            reducer(
                {
                    '{"type":"GET_ONE","payload":{"id":123}}': {
                        loaded: false,
                        loading: false,
                        error: 'problem!',
                    },
                },
                {
                    type: 'GET_ONE_LOADING',
                    payload: { id: 123 },
                    meta: {
                        fetchStatus: FETCH_START,
                        fetchResponse: 'GET_ONE',
                    },
                }
            )
        ).toEqual({
            '{"type":"GET_ONE","payload":{"id":123}}': {
                loaded: false,
                loading: true,
            },
        });
    });
    it('should return a non loading state upon FETCH_CANCEL', () => {
        expect(
            reducer(
                {
                    '{"type":"GET_ONE","payload":{"id":123}}': {
                        loaded: false,
                        loading: true,
                    },
                },
                {
                    type: 'GET_ONE_ERROR',
                    requestPayload: { id: 123 },
                    meta: {
                        fetchStatus: FETCH_CANCEL,
                        fetchResponse: 'GET_ONE',
                    },
                }
            )
        ).toEqual({
            '{"type":"GET_ONE","payload":{"id":123}}': {
                loaded: false,
                loading: false,
            },
        });
    });
});
