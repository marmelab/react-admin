import assert from 'assert';
import {
    SHOW_NOTIFICATION,
    HIDE_NOTIFICATION,
} from '../../actions/notificationActions';
import reducer from './notification';

describe('notification reducer', () => {
    it('should return empty notification by default', () => {
        assert.deepEqual({ text: '', type: 'info' }, reducer(undefined, {}));
    });
    it('should set text and type upon SHOW_NOTIFICATION', () => {
        assert.deepEqual(
            { text: 'foo', type: 'warning' },
            reducer(undefined, {
                type: SHOW_NOTIFICATION,
                payload: { text: 'foo', type: 'warning' },
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
