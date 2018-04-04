import assert from 'assert';
import {
    HIDE_NOTIFICATION,
    SHOW_NOTIFICATION,
} from '../../actions/notificationActions';
import reducer from './notifications';

describe('notifications reducer', () => {
    it('should return empty notification by default', () => {
        assert.deepEqual([], reducer(undefined, {}));
    });
    it('should set autoHideDuration when passed in payload', () => {
        assert.deepEqual(
            [{ text: 'test', type: 'info', autoHideDuration: 1337 }],
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
            [{ text: 'foo', type: 'warning' }],
            reducer(undefined, {
                type: SHOW_NOTIFICATION,
                payload: {
                    text: 'foo',
                    type: 'warning',
                },
            })
        );
    });
    it('should have no elements upon last HIDE_NOTIFICATION', () => {
        assert.deepEqual(
            [],
            reducer([{ text: 'foo', type: 'warning' }], {
                type: HIDE_NOTIFICATION,
            })
        );
    });
    it('should have one less notification upon HIDE_NOTIFICATION with multiple notifications', () => {
        const notifications = [{ text: 'foo' }, { text: 'bar' }];
        assert.equal(
            notifications.length - 1,
            reducer(notifications, {
                type: HIDE_NOTIFICATION,
            }).length
        );
    });
});
