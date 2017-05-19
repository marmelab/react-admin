import { delay } from 'redux-saga';
import { call, cancel, fork, put, takeEvery } from 'redux-saga/effects';
import { CRUD_GET_ONE_ACCUMULATE, CRUD_GET_MANY_ACCUMULATE } from '../../actions/referenceActions';
import { crudGetMany } from '../../actions/dataActions';

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
    ids.forEach((id) => {
        debouncedIds[resource][id] = true;
    }); // fast UNIQUE
};
const getIds = (resource) => {
    const ids = Object.keys(debouncedIds[resource]);
    delete debouncedIds[resource];
    return ids;
};

const tasks = {};

/**
 * Fetch the list of accumulated ids after a delay
 *
 * As this gets canceled by subsequent calls to accumulate(), only the last
 * call to fetchReference() will not be canceled. The delay acts as a
 * debounce.
 *
 * @see http://yelouafi.github.io/redux-saga/docs/recipes/index.html#debouncing
 */
function* fetchReference(resource) {
    // combined with cancel(), this debounces the calls
    yield call(delay, 50);
    yield put(crudGetMany(resource, getIds(resource)));
    delete tasks[resource];
}

/**
 * Cancel call to fetchReference, accumulate ids, and call fetchReference
 *
 * @example
 * accumulate({ type: CRUD_GET_MANY_ACCUMULATE, payload: { ids: [1, 3, 5], resource: 'posts' } })
 */
function* accumulate({ payload }) {
    const { ids, resource } = payload;
    if (tasks[resource]) {
        yield cancel(tasks[resource]);
    }
    addIds(resource, ids);
    tasks[resource] = yield fork(fetchReference, resource);
}

export default function* () {
    yield takeEvery(CRUD_GET_MANY_ACCUMULATE, accumulate);
}
