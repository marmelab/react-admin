import { delay } from 'redux-saga';
import { call, cancel, fork, put, takeEvery } from 'redux-saga/effects';

/**
 * Example
 *
 * let debouncedIds = {
 *   posts: { 4: true, 7: true, 345: true },
 *   authors: { 23: true, 47: true, 78: true },
 * }
 */
const debouncedIds = {};
const addIds = (resource, ids) => {
    if (!debouncedIds[resource]) {
        debouncedIds[resource] = {};
    }
    ids.forEach(id => {
        debouncedIds[resource][id] = true;
    }); // fast UNIQUE
};
const getIds = resource => {
    const ids = Object.keys(debouncedIds[resource]);
    delete debouncedIds[resource];
    return ids;
};

const tasks = {};

/**
 * Fetch the list of accumulated ids after a delay
 *
 * As this gets canceled by subsequent calls to accumulate(), only the last
 * call to finalize() will not be canceled. The delay acts as a
 * debounce.
 *
 * @see https://redux-saga.js.org/docs/recipes/#debouncing
 */
function* finalize(resource, actionCreator) {
    // combined with cancel(), this debounces the calls
    yield call(delay, 50);
    yield put(actionCreator(resource, getIds(resource)));
    delete tasks[resource];
}

/**
 * Cancel call to finalize, accumulate ids, and call finalize
 *
 * @example
 * accumulate({ type: CRUD_GET_MANY_ACCUMULATE, payload: { ids: [1, 3, 5], resource: 'posts' } })
 */
function* accumulate({ payload, meta }) {
    const { ids, resource } = payload;
    if (tasks[resource]) {
        yield cancel(tasks[resource]);
    }
    addIds(resource, ids);
    tasks[resource] = yield fork(finalize, resource, meta.accumulate);
}

export default function*() {
    yield takeEvery(
        action => action.meta && action.meta.accumulate,
        accumulate
    );
}
