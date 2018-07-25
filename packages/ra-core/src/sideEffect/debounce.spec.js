import { fork, put, take } from 'redux-saga/effects';
import {
    handleFinalize,
    handleDebouncedAction,
    handleDebounce,
} from './debounce';

describe('debounce saga', () => {
    const debouncedAction = { type: 'DEBOUNCED_ACTION', payload: 'a_payload' };

    it('handles only the first debounced action', () => {
        const handleDebounceSaga = handleDebounce({
            meta: { debounce: debouncedAction },
        });
        const handleDebounceSaga2 = handleDebounce({
            meta: { debounce: debouncedAction },
        });

        expect(handleDebounceSaga.next().value).toEqual(
            fork(handleDebouncedAction, '"a_payload"', debouncedAction)
        );
        handleDebounceSaga.next(); // This ensure the fork has been handled
        expect(handleDebounceSaga2.next().value).toEqual(undefined);
    });

    it('dispatches the debounced action', () => {
        const handleDebouncedActionSaga = handleDebouncedAction(
            '"a_payload"',
            debouncedAction
        );

        expect(handleDebouncedActionSaga.next().value).toEqual(
            put(debouncedAction)
        );
    });

    it('waits for the debounced action to finish', () => {
        const isRelatedAction = jest.fn();

        const handleDebouncedActionSaga = handleDebouncedAction(
            '"a_payload"',
            debouncedAction,
            isRelatedAction
        );

        handleDebouncedActionSaga.next();
        expect(handleDebouncedActionSaga.next().value).toEqual(
            take(isRelatedAction, handleFinalize, '"a_payload"')
        );
    });

    it('ensure another action with the same signature can be debounced after the debounced action has finished', () => {
        handleFinalize('"a_payload"');

        const handleDebounceSaga = handleDebounce({
            meta: { debounce: debouncedAction },
        });

        expect(handleDebounceSaga.next().value).toEqual(
            fork(handleDebouncedAction, '"a_payload"', debouncedAction)
        );
        handleDebounceSaga.next(); // This ensure the fork has been handled
    });
});
