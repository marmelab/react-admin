import { call, fork, put, takeEvery, take } from 'redux-saga/effects';

const tasks = {};

// use the whole stringified payload to ensure actions such as getMatching
// are not mistaken for another getMatching targeting another resource or
// the same resource but with different filters, etc.
const getKey = payload => JSON.stringify(payload);

const deleteKey = key => {
    delete tasks[key];
};

function* finalize(key) {
    yield call(deleteKey, key);
}

/**
 * For example, will match `GET_MATCHING_SUCCESS` or `GET_MATCHING_FAILURE`
 * if the specified type is `GET_MATCHING` and the action's requestPayload
 * matches the key after being stringified
 */
const isRelatedAction = (type, key) => action =>
    [`${type}_SUCCESS`, `${type}_FAILURE`].includes(action.type) &&
    key === getKey(action.requestPayload);

/**
 * Dispatch the first action and ensure we don't prevent future actions of the same
 * type with the same parameter to execute again by listening to the action
 * `SUCCESS` or `FAILURE` counterparts and removing the action from our debounced tasks
 * list
 */
function* dispatchDebouncedAction(key, debouncedAction) {
    yield put(debouncedAction);
    yield take(isRelatedAction(debouncedAction.type, key), finalize, key);
}

/**
 * Debounce calls to the exact same action (with exact same parameters) by
 * only calling letting the first one to be handled
 */
function* debounce({ meta: { debounce } }) {
    const key = getKey(debounce.payload);

    // Don't dispatch the debounced action if already dispatched
    if (tasks[key]) {
        return;
    }
    tasks[key] = yield fork(dispatchDebouncedAction, key, debounce);
}

export default function*() {
    yield takeEvery(action => action.meta && action.meta.debounce, debounce);
}
