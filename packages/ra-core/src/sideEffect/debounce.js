import { delay } from 'redux-saga';
import { call, fork, put, takeEvery } from 'redux-saga/effects';

const tasks = {};

/**
 * Dispatch the first action and ensure we don't prevent future actions of the same
 * type with the same parameter to execute again by listening to the action
 * `SUCCESS` or `FAILURE` counterparts and removing the action from our debounced tasks
 * list
 */
export function* handleDebouncedAction(debounceKey, debouncedAction) {
    yield put({
        ...debouncedAction,
        meta: {
            ...debouncedAction.meta,
            debounceKey,
        },
    });
    yield call(delay, 50);
    delete tasks[debounceKey];
}

/**
 * Debounce calls to the exact same action (with exact same parameters) by
 * only calling letting the first one to be handled
 */
export function* handleDebounce({ meta: { debouncedAction, debounceKey } }) {
    // Don't dispatch the debounced action if already dispatched
    if (tasks[debounceKey]) {
        return;
    }

    tasks[debounceKey] = true;
    yield fork(handleDebouncedAction, debounceKey, debouncedAction);
}

export default function*() {
    yield takeEvery(
        action => action.meta && action.meta.debouncedAction,
        handleDebounce
    );
}
