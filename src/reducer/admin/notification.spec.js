import assert from 'assert';
import {
    SHOW_NOTIFICATION,
    HIDE_NOTIFICATION,
} from '../../actions/notificationActions';
import reducer from './notification';

describe('notification reducer', () => {
    it('should return empty notification by default', () => {
        assert.deepEqual(
            { text: '', type: 'info', autoHideDuration: undefined },
            reducer(undefined, {})
        );
    });
    it('should set autoHideDuration when passed in payload', () => {
        assert.deepEqual(
            { text: 'test', type: 'info', autoHideDuration: 1337 },
            reducer(undefined, {
                type: SHOW_NOTIFICATION,
                payload: {
                    text: 'test',
                    type: 'info',
                    autoHideDuration: 1337,
                },
            })
        );
    });
    it('should set text and type upon SHOW_NOTIFICATION', () => {
        assert.deepEqual(
            { text: 'foo', type: 'warning', autoHideDuration: undefined },
            reducer(undefined, {
                type: SHOW_NOTIFICATION,
                payload: {
                    text: 'foo',
                    type: 'warning',
                },
            })
        );
    });
    it('should set text to empty string upon HIDE_NOTIFICATION', () => {
        assert.deepEqual(
            { text: '', type: 'warning' },
            reducer(
                { text: 'foo', type: 'warning' },
                { type: HIDE_NOTIFICATION }
            )
        );
    });
});
