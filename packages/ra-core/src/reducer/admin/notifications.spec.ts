import assert from 'assert';
import { HIDE_NOTIFICATION, SHOW_NOTIFICATION, NotificationType } from '../../actions/notificationActions';
import reducer from './notifications';

describe('notifications reducer', () => {
    it('should return empty notification by default', () => {
        assert.deepEqual([], reducer(undefined, { type: 'foo' }));
    });
    it('should set autoHideDuration when passed in payload', () => {
        assert.deepEqual(
            [{ message: 'test', type: 'info', autoHideDuration: 1337 }],
            reducer(undefined, {
                type: SHOW_NOTIFICATION,
                payload: {
                    message: 'test',
                    type: 'info',
                    autoHideDuration: 1337,
                },
            })
        );
    });
    it('should set text and type upon SHOW_NOTIFICATION', () => {
        assert.deepEqual(
            [{ message: 'foo', type: 'warning' }],
            reducer(undefined, {
                type: SHOW_NOTIFICATION,
                payload: {
                    message: 'foo',
                    type: 'warning',
                },
            })
        );
    });
    it('should have no elements upon last HIDE_NOTIFICATION', () => {
        assert.deepEqual(
            [],
            reducer([{ message: 'foo', type: 'warning' as NotificationType }], {
                type: HIDE_NOTIFICATION,
            })
        );
    });
    it('should have one less notification upon HIDE_NOTIFICATION with multiple notifications', () => {
        const notifications = [
            { message: 'foo', type: 'info' as NotificationType },
            { message: 'bar', type: 'info' as NotificationType },
        ];
        assert.equal(
            notifications.length - 1,
            reducer(notifications, {
                type: HIDE_NOTIFICATION,
            }).length
        );
    });
});
