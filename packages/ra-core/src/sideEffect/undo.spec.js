import { put, call } from 'redux-saga/effects';
import { delay } from 'redux-saga';

import {
    showNotification,
    hideNotification,
} from '../actions/notificationActions';
import {
    startOptimisticMode,
    stopOptimisticMode,
} from '../actions/cancelActions';
import { refreshView } from '../actions/uiActions';

import { handleCancelRace } from './undo';

describe('undo saga', () => {
    const action = {
        type: 'CANCELLABLE',
        payload: {
            action: {
                type: 'FOO',
                payload: { id: 123 },
                meta: {
                    foo: 1,
                    onSuccess: {
                        bar: 2,
                    },
                },
            },
            delay: 100,
        },
    };
    describe('cancelled', () => {
        const generator = handleCancelRace(action);

        it('should start optimistic mode', () => {
            expect(generator.next().value).toEqual(put(startOptimisticMode()));
        });
        it('should put the optimistic action with success metas', () => {
            expect(generator.next().value).toEqual(
                put({
                    type: 'FOO_OPTIMISTIC',
                    payload: { id: 123 },
                    meta: {
                        foo: 1,
                        bar: 2,
                    },
                })
            );
        });
        it('should fork the race', () => {
            expect(generator.next().value).toHaveProperty('RACE');
        });
        it('should stop the optimistic mode', () => {
            expect(generator.next({ type: 'CANCEL' }).value).toEqual(
                put(stopOptimisticMode())
            );
        });
        it('should display the notification', () => {
            expect(generator.next().value).toEqual(put(hideNotification()));
            expect(generator.next().value).toEqual(
                put(showNotification('ra.notification.canceled'))
            );
        });
        it('should send a refresh', () => {
            expect(generator.next().value).toEqual(put(refreshView()));
        });
        it('should end there', () => {
            expect(generator.next().done).toEqual(true);
        });
    });
    describe('timed out', () => {
        const generator = handleCancelRace(action);

        it('should start optimistic mode', () => {
            expect(generator.next().value).toEqual(put(startOptimisticMode()));
        });
        it('should put the optimistic action with success metas', () => {
            expect(generator.next().value).toEqual(
                put({
                    type: 'FOO_OPTIMISTIC',
                    payload: { id: 123 },
                    meta: {
                        foo: 1,
                        bar: 2,
                    },
                })
            );
        });
        it('should fork the race', () => {
            expect(generator.next().value).toHaveProperty('RACE');
        });
        it('should stop the optimistic mode', () => {
            expect(generator.next(delay(110)).value).toEqual(
                put(stopOptimisticMode())
            );
        });
        it('should display the notification', () => {
            expect(generator.next().value).toEqual(put(hideNotification()));
        });
        it('should put the action in non-optimistic mode', () => {
            expect(generator.next().value).toEqual(
                put({
                    type: 'FOO_',
                    payload: { id: 123 },
                    meta: {
                        foo: 1,
                    },
                })
            );
        });
        it('should end there', () => {
            expect(generator.next().done).toEqual(true);
        });
    });
});
