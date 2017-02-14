import { put, takeEvery } from 'redux-saga/effects';
import { push } from 'react-router-redux';
import { FETCH_ERROR } from '../../actions/fetchActions';

export default function* () {
    yield takeEvery(FETCH_ERROR, function* redirectIfNotauthenticated({ error }) {
        if (error.status === 401 || error.status === 403) {
            yield put(push('/login'));
        }
    });
}
