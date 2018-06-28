import { put } from 'redux-saga/effects';

import { showNotification } from '../actions/notificationActions';
import {
    startOptimisticMode,
    stopOptimisticMode,
} from '../actions/undoActions';
import { refreshView } from '../actions/uiActions';

import { handleUndoRace } from './undo';

describe('undo saga', () => {
    const action = {
        type: 'UNDOABLE',
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
        },
    };
    describe('cancelled', () => {
        const generator = handleUndoRace(action);

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
                        optimistic: true,
                    },
                })
            );
        });
        it('should fork the race', () => {
            expect(generator.next().value).toHaveProperty('RACE');
        });
        it('should stop the optimistic mode', () => {
            expect(generator.next({ undo: true }).value).toEqual(
                put(stopOptimisticMode())
            );
        });
        it('should display the notification', () => {
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
    describe('complete', () => {
        const generator = handleUndoRace(action);

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
                        optimistic: true,
                    },
                })
            );
        });
        it('should fork the race', () => {
            expect(generator.next().value).toHaveProperty('RACE');
        });
        it('should stop the optimistic mode', () => {
            expect(generator.next({ complete: true }).value).toEqual(
                put(stopOptimisticMode())
            );
        });
        it('should put the action in non-optimistic mode', () => {
            expect(generator.next().value).toEqual(
                put({
                    type: 'FOO',
                    payload: { id: 123 },
                    meta: {
                        foo: 1,
                        onSuccess: { refresh: true },
                        onFailure: { refresh: true },
                    },
                })
            );
        });
        it('should end there', () => {
            expect(generator.next().done).toEqual(true);
        });
    });
});
