import { put, takeEvery } from 'redux-saga/effects';
import resolveRedirectTo from '../../util/resolveRedirectTo';
import { push } from 'react-router-redux';

/**
 * Redirection Side Effects
 */
function* handleRedirection({ payload, meta: { basePath, redirectTo } }) {
    yield put(
        push(
            resolveRedirectTo(
                redirectTo,
                basePath,
                payload.id || payload.data.id
            )
        )
    );
}

export default function*() {
    yield takeEvery(
        action => action.meta && action.meta.redirectTo,
        handleRedirection
    );
}
