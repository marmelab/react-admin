import { takeLatest } from 'redux-saga';
import { fetchSagaFactory } from '../util/fetch.js';
import { CRUD_FETCH_LIST } from './actions';

export function *watchFetchList() {
    yield* takeLatest(CRUD_FETCH_LIST, fetchSagaFactory(CRUD_FETCH_LIST));
}
