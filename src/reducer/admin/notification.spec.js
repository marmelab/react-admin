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
    it('should set text and type upon SHOW_NOTIFICATION', () => {
        assert.deepEqual(
            { text: 'foo', type: 'warning', autoHideDuration: undefined },
            reducer(undefined, {
                type: SHOW_NOTIFICATION,
                payload: {
                    text: 'foo',
                    type: 'warning',
                    autoHideDuration: undefined,
                },
            })
        );
    });
    it('should set text to empty string upon HIDE_NOTIFICATION', () => {
        assert.deepEqual(
            { text: '', type: 'warning', autoHideDuration: undefined },
            reducer(
                { text: 'foo', type: 'warning', autoHideDuration: undefined },
                { type: HIDE_NOTIFICATION }
            )
        );
    });
});
