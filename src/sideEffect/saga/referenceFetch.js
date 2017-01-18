import { delay } from 'redux-saga';
import { call, cancel, fork, put, takeEvery } from 'redux-saga/effects';
import { CRUD_GET_ONE_REFERENCE } from '../../actions/referenceActions';
import { crudGetMany } from '../../actions/dataActions';

/**
 * Example
 *
 * let id = {
 *   posts: { 4: true, 7: true, 345: true },
 *   authors: { 23: true, 47: true, 78: true },
 * }
 */
const ids = {};
const tasks = {};

// see http://yelouafi.github.io/redux-saga/docs/recipes/index.html#debouncing
function* fetchReference(resource) {
    // combined with cancel(), this debounces the calls
    yield call(delay, 50);
    yield put(crudGetMany(resource, Object.keys(ids[resource])));
    delete ids[resource];
    delete tasks[resource];
}

function* accumulate({ payload }) {
    const { id, resource } = payload;
    if (!ids[resource]) {
        ids[resource] = {};
    }
    ids[resource][id] = true; // fast UNIQUE
    if (tasks[resource]) {
        yield cancel(tasks[resource]);
    }
    tasks[resource] = yield fork(fetchReference, resource);
}

export default function* () {
    yield takeEvery(CRUD_GET_ONE_REFERENCE, accumulate);
}
