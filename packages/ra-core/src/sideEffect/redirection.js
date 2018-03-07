import { put, takeEvery } from 'redux-saga/effects';
import { push } from 'react-router-redux';
import { reset } from 'redux-form';

import resolveRedirectTo from '../util/resolveRedirectTo';

/**
 * Redirection Side Effects
 */
function* handleRedirection({ payload, meta: { basePath, redirectTo } }) {
    return redirectTo
        ? yield put(
              push(
                  resolveRedirectTo(
                      redirectTo,
                      basePath,
                      payload.id || payload.data.id
                  )
              )
          )
        : yield put(reset('record-form')); // explicit no redirection, reset the form
}

export default function*() {
    yield takeEvery(
        action => action.meta && typeof action.meta.redirectTo !== 'undefined',
        handleRedirection
    );
}
