import { delay } from 'redux-saga';
import { call, cancel, fork, put, take } from 'redux-saga/effects';
import { CRUD_GET_ONE_REFERENCE } from '../actions/referenceActions';
import { crudGetMany } from '../actions/dataActions';

function *referenceFetch(resource, ids) {
    yield call(delay, 50);
    yield Object.keys(ids).map(reference =>
        put(crudGetMany(resource, Object.keys(ids[reference])))
    );
}

export default function *watchReferenceFetch() {
    let task;
    const ids = {};
    while (true) {
        const { payload } = yield take(CRUD_GET_ONE_REFERENCE);
        const { id, resource } = payload;
        if (!ids[resource]) {
            ids[resource] = {};
        }
        ids[resource][id] = true; // poor man's UNIQUE
        if (task) {
            yield cancel(task);
        }
        task = yield fork(referenceFetch, resource, ids);
    }
}
