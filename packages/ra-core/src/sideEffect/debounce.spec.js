import { delay } from 'redux-saga';
import { call, fork, put } from 'redux-saga/effects';
import { handleDebouncedAction, handleDebounce } from './debounce';

describe('debounce saga', () => {
    const debouncedAction = { type: 'DEBOUNCED_ACTION', payload: 'a_payload' };
    const action = {
        meta: {
            debouncedAction,
            debounceKey: 'generated-from-payload',
        },
    };

    it('handles only the first debounced action', () => {
        const handleDebounceSaga = handleDebounce(action);
        const handleDebounceSaga2 = handleDebounce(action);

        expect(handleDebounceSaga.next().value).toEqual(
            fork(
                handleDebouncedAction,
                'generated-from-payload',
                debouncedAction
            )
        );
        handleDebounceSaga.next(); // This ensure the fork has been handled
        expect(handleDebounceSaga2.next().value).toEqual(undefined);
    });

    it('dispatches the debounced action', () => {
        const handleDebouncedActionSaga = handleDebouncedAction(
            'generated-from-payload',
            debouncedAction
        );

        expect(handleDebouncedActionSaga.next().value).toEqual(
            put({
                ...debouncedAction,
                meta: {
                    ...debouncedAction.meta,
                    debounceKey: 'generated-from-payload',
                },
            })
        );
    });

    it('waits for the debounced action to finish', () => {
        const handleDebouncedActionSaga = handleDebouncedAction(
            'generated-from-payload',
            debouncedAction
        );

        handleDebouncedActionSaga.next();
        expect(handleDebouncedActionSaga.next().value).toEqual(call(delay, 50));
    });

    it('ensure another action with the same signature can be debounced after the debounced action has finished', () => {
        const handleDebouncedActionSaga = handleDebouncedAction(
            'generated-from-payload',
            debouncedAction
        );

        // Ensure we finish the handleDebouncedAction saga
        handleDebouncedActionSaga.next();
        handleDebouncedActionSaga.next();
        handleDebouncedActionSaga.next();

        const handleDebounceSaga = handleDebounce({
            meta: {
                debouncedAction,
                debounceKey: 'generated-from-payload',
            },
        });

        expect(handleDebounceSaga.next().value).toEqual(
            fork(
                handleDebouncedAction,
                'generated-from-payload',
                debouncedAction
            )
        );
        handleDebounceSaga.next(); // This ensure the fork has been handled
    });
});
