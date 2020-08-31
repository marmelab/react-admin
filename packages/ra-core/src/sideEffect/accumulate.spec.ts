import expect from 'expect';
import { cancel, delay, fork, put } from 'redux-saga/effects';
import { createMockTask } from '@redux-saga/testing-utils';

import { accumulateFactory, finalizeFactory } from './accumulate';
import { crudGetMany } from '../actions';

describe('accumulate saga', () => {
    describe('backward compatibility', () => {
        it('proceeds with the accumulated action when no more actions are dispatched', () => {
            const tasks = {};
            const accumulations = {};
            const finalize = finalizeFactory(tasks, accumulations);

            const saga = accumulateFactory(
                tasks,
                accumulations,
                finalize
            )({
                payload: { resource: 'posts', ids: [1, 2] },
                meta: { accumulate: crudGetMany },
            });

            expect(saga.next().value).toEqual(
                fork(finalize, 'posts', crudGetMany)
            );

            expect(accumulations).toEqual({
                posts: [1, 2],
            });
        });

        it('cancels the previous action when a new matching action is dispatched then proceeds with the new one', () => {
            const task = createMockTask();
            const tasks = { posts: task };
            const accumulations = {
                posts: [1, 2],
            };
            const finalize = finalizeFactory(tasks, accumulations);

            const saga = accumulateFactory(
                tasks,
                accumulations,
                finalize
            )({
                payload: { resource: 'posts', ids: [2, 3] },
                meta: { accumulate: crudGetMany },
            });

            expect(saga.next().value).toEqual(cancel(task));

            expect(saga.next().value).toEqual(
                fork(finalize, 'posts', crudGetMany)
            );

            expect(accumulations).toEqual({
                posts: [1, 2, 3],
            });
        });

        it('waits for a 50ms delay before dispatching the action', () => {
            const task = createMockTask();
            const tasks = { posts: task };
            const accumulations = { posts: [1, 2] };
            const saga = finalizeFactory(tasks, accumulations)(
                'posts',
                crudGetMany
            );

            expect(saga.next().value).toEqual(delay(50));

            expect(saga.next().value).toEqual(
                put(crudGetMany('posts', [1, 2]))
            );

            saga.next(); // Ends the saga
            expect(tasks).toEqual({});
            expect(accumulations).toEqual({});
        });
    });

    describe('using all expected metas', () => {
        it('proceeds with the accumulated action when no more actions are dispatched', () => {
            const tasks = {};
            const accumulations = {};
            const finalize = finalizeFactory(tasks, accumulations);

            const saga = accumulateFactory(
                tasks,
                accumulations,
                finalize
            )({
                type: 'ACCUMULATE_ACTION',
                payload: { ids: [1, 2] },
                meta: {
                    accumulate: crudGetMany,
                    accumulateValues: (accumulations2, action) => [
                        ...(accumulations2 || []),
                        ...action.payload.ids,
                    ],
                    accumulateKey: 'posts',
                },
            });

            expect(saga.next().value).toEqual(
                fork(finalize, 'posts', crudGetMany)
            );

            expect(accumulations).toEqual({
                posts: [1, 2],
            });
        });

        it('cancels the previous action when a new matching action is dispatched then proceeds with the new one', () => {
            const task = createMockTask();
            const tasks = { posts: task };
            const accumulations = { posts: [1, 2] };
            const finalize = finalizeFactory(tasks, accumulations);

            const saga = accumulateFactory(
                tasks,
                accumulations,
                finalize
            )({
                type: 'ACCUMULATE_ACTION',
                payload: { ids: [3, 4] },
                meta: {
                    accumulate: crudGetMany,
                    accumulateValues: (accumulations2, action) => [
                        ...(accumulations2 || []),
                        ...action.payload.ids,
                    ],
                    accumulateKey: 'posts',
                },
            });

            expect(saga.next().value).toEqual(cancel(task));

            expect(saga.next().value).toEqual(
                fork(finalize, 'posts', crudGetMany)
            );

            expect(accumulations).toEqual({
                posts: [1, 2, 3, 4],
            });
        });
    });
});
