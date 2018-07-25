import { fork, put, takeEvery, take } from 'redux-saga/effects';

const tasks = {};

// use the whole stringified payload to ensure actions such as getMatching
// are not mistaken for another getMatching targeting another resource or
// the same resource but with different filters, etc.
const getKey = payload => JSON.stringify(payload);

export const handleFinalize = key => {
    delete tasks[key];
};

/**
 * For example, will match `GET_MATCHING_SUCCESS` or `GET_MATCHING_FAILURE`
 * if the specified type is `GET_MATCHING` and the action's requestPayload
 * matches the key after being stringified
 */
const defaultIsRelatedAction = (type, key) => action =>
    [`${type}_SUCCESS`, `${type}_FAILURE`].includes(action.type) &&
    key === getKey(action.requestPayload);

/**
 * Dispatch the first action and ensure we don't prevent future actions of the same
 * type with the same parameter to execute again by listening to the action
 * `SUCCESS` or `FAILURE` counterparts and removing the action from our debounced tasks
 * list
 */
export function* handleDebouncedAction(
    key,
    debouncedAction,
    isRelatedAction = defaultIsRelatedAction(debouncedAction.type, key)
) {
    yield put(debouncedAction);
    yield take(isRelatedAction, handleFinalize, key);
}

/**
 * Debounce calls to the exact same action (with exact same parameters) by
 * only calling letting the first one to be handled
 */
export function* handleDebounce({ meta: { debounce } }) {
    const key = getKey(debounce.payload);
    // Don't dispatch the debounced action if already dispatched
    if (tasks[key]) {
        return;
    }
    tasks[key] = yield fork(handleDebouncedAction, key, debounce);
}

export default function*() {
    yield takeEvery(
        action => action.meta && action.meta.debounce,
        handleDebounce
    );
}
