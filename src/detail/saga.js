import { takeLatest } from 'redux-saga';
import { fetchSagaFactory } from '../util/fetch.js';
import { CRUD_FETCH_RECORD } from './actions';

export function *watchFetchRecord() {
    yield* takeLatest(CRUD_FETCH_RECORD, fetchSagaFactory(CRUD_FETCH_RECORD));
}
