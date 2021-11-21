import expect from 'expect';
import {
    HIDE_NOTIFICATION,
    SHOW_NOTIFICATION,
    NotificationType,
} from '../../actions/notificationActions';
import reducer from './notifications';

describe('notifications reducer', () => {
    it('should return empty notification by default', () => {
        expect(reducer(undefined, { type: 'foo' })).toEqual([]);
    });
    it('should set autoHideDuration when passed in payload', () => {
        expect([
            { message: 'test', type: 'info', autoHideDuration: 1337 },
        ]).toEqual(
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
    it('should set multiLine when passed in payload', () => {
        expect([{ message: 'test', type: 'info', multiLine: true }]).toEqual(
            reducer(undefined, {
                type: SHOW_NOTIFICATION,
                payload: {
                    message: 'test',
                    type: 'info',
                    multiLine: true,
                },
            })
        );
    });
    it('should set text and type upon SHOW_NOTIFICATION', () => {
        expect([{ message: 'foo', type: 'warning' }]).toEqual(
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
        expect([]).toEqual(
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
        expect(notifications.length - 1).toEqual(
            reducer(notifications, {
                type: HIDE_NOTIFICATION,
            }).length
        );
    });
});
