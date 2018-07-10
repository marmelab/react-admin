import { call, takeEvery } from 'redux-saga/effects';

/**
 * Callback Side Effects
 */
function* handleCallback({ payload, requestPayload, meta: { callback } }) {
    yield call(callback, { payload, requestPayload });
}

export default function*() {
    yield takeEvery(
        action => action.meta && action.meta.callback,
        handleCallback
    );
}
