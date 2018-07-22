import { call, fork, put, takeEvery, take } from 'redux-saga/effects';

const tasks = {};

const getKey = payload => JSON.stringify(payload);

const deleteKey = key => {
    delete tasks[key];
};

function* finalize(key) {
    yield call(deleteKey, key);
}

function* dispatchDebouncedAction(key, debouncedAction) {
    yield put(debouncedAction);
    yield take(
        action =>
            action.type.startsWith(
                debouncedAction.type && key === getKey(action.requestPayload)
            ),
        finalize,
        key
    );
}

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
